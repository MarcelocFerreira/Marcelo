# Algoritmo de Agendamento - Detalhamento Técnico

## 1. Visão Geral do Problema

O problema de agendamento de jogos esportivos é uma variação do **problema de agendamento de recursos** (Resource Scheduling Problem), que é NP-completo. Precisamos otimizar:

### Restrições Rígidas (Hard Constraints)
- Um jogador não pode jogar dois jogos ao mesmo tempo
- Uma quadra não pode ter dois jogos ao mesmo tempo
- Um jogo só pode ser agendado se TODOS os jogadores estiverem disponíveis
- Um jogo deve caber completamente no slot de tempo disponível da quadra

### Restrições Flexíveis (Soft Constraints)
- Jogadores devem ter intervalo mínimo entre jogos (ex: 1 hora)
- Distribuir jogos equilibradamente ao longo dos dias
- Maximizar utilização de quadras
- Minimizar número de jogos por dia por jogador
- Priorizar horários mais convenientes (manhã/tarde vs noite)

---

## 2. Estrutura de Dados

### Slot de Tempo
```typescript
interface TimeSlot {
  id: string;
  courtId: string;
  date: Date;
  startTime: string; // "09:00"
  endTime: string;   // "10:00"
  durationMinutes: number;
  isOccupied: boolean;
  occupiedBy?: string; // matchId
}
```

### Requisitos do Jogo
```typescript
interface MatchSchedulingRequirements {
  matchId: string;
  players: Player[];
  duration: number; // minutos
  phase: MatchPhase; // group, quarter, semi, final
  priority: number; // calculado baseado na fase
  constraints: {
    earliestDate?: Date;
    latestDate?: Date;
    preferredTimeOfDay?: 'morning' | 'afternoon' | 'evening';
  };
}
```

### Disponibilidade do Jogador
```typescript
interface PlayerAvailability {
  playerId: string;
  availableSlots: {
    dayOfWeek: number; // 0-6
    startTime: string;
    endTime: string;
  }[];
  unavailableSlots: {
    date: Date;
    startTime: string;
    endTime: string;
    reason?: string;
  }[];
}
```

---

## 3. Algoritmo Principal (Greedy + Backtracking)

```typescript
class SchedulingEngine {
  private courts: Court[];
  private matches: Match[];
  private playerAvailabilities: Map<string, PlayerAvailability>;
  private timeSlots: TimeSlot[];
  private schedule: Map<string, TimeSlot>; // matchId -> slot
  private conflicts: Conflict[];

  /**
   * Algoritmo principal de agendamento
   */
  async scheduleMatches(
    tournament: Tournament
  ): Promise<SchedulingResult> {
    // 1. Inicialização
    this.initialize(tournament);

    // 2. Gerar todos os slots de tempo possíveis
    this.generateTimeSlots();

    // 3. Calcular prioridades dos jogos
    const prioritizedMatches = this.calculateMatchPriorities(this.matches);

    // 4. Ordenar slots por preferência
    const orderedSlots = this.orderSlotsByPreference();

    // 5. Tentar agendar cada jogo
    for (const match of prioritizedMatches) {
      const scheduled = this.scheduleMatch(match, orderedSlots);

      if (!scheduled) {
        // Não conseguiu agendar - criar conflito
        const suggestions = this.generateSuggestions(match, orderedSlots);
        this.conflicts.push({
          match,
          reason: 'no_feasible_slot',
          suggestions
        });
      }
    }

    // 6. Tentar resolver conflitos automaticamente
    this.attemptConflictResolution();

    // 7. Retornar resultado
    return {
      scheduled: Array.from(this.schedule.entries()),
      conflicts: this.conflicts,
      stats: this.calculateStatistics()
    };
  }

  /**
   * Gera todos os slots de tempo possíveis baseado nas quadras
   */
  private generateTimeSlots(): void {
    this.timeSlots = [];

    for (const court of this.courts) {
      for (const availability of court.availabilities) {
        const slots = this.splitIntoSlots(
          court,
          availability.date,
          availability.startTime,
          availability.endTime,
          30 // slot mínimo de 30 min
        );
        this.timeSlots.push(...slots);
      }
    }
  }

  /**
   * Divide um período em slots menores
   */
  private splitIntoSlots(
    court: Court,
    date: Date,
    startTime: string,
    endTime: string,
    slotSize: number
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const start = this.parseTime(startTime);
    const end = this.parseTime(endTime);

    let current = start;
    while (current + slotSize <= end) {
      slots.push({
        id: `${court.id}_${date}_${current}`,
        courtId: court.id,
        date,
        startTime: this.formatTime(current),
        endTime: this.formatTime(current + slotSize),
        durationMinutes: slotSize,
        isOccupied: false
      });
      current += slotSize;
    }

    return slots;
  }

  /**
   * Calcula prioridade de cada jogo
   */
  private calculateMatchPriorities(matches: Match[]): Match[] {
    const withPriority = matches.map(match => {
      let priority = 0;

      // Fase do torneio (finais têm maior prioridade)
      const phaseScores = {
        final: 100,
        third_place: 90,
        semi: 80,
        quarter: 70,
        round_16: 60,
        group: 50
      };
      priority += phaseScores[match.phase] || 0;

      // Jogos com menos opções de horário têm prioridade
      const availableSlots = this.countAvailableSlots(match);
      priority += Math.max(0, 50 - availableSlots);

      // Jogos com muitos jogadores têm prioridade
      const playerCount = this.getPlayerCount(match);
      priority += playerCount * 2;

      return { ...match, priority };
    });

    // Ordenar por prioridade decrescente
    return withPriority.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Tenta agendar um jogo específico
   */
  private scheduleMatch(
    match: Match,
    availableSlots: TimeSlot[]
  ): boolean {
    // Encontrar melhor slot para este jogo
    const candidateSlots = this.findCandidateSlots(match, availableSlots);

    for (const slot of candidateSlots) {
      if (this.isSlotFeasible(match, slot)) {
        // Verificar se não viola restrições rígidas
        if (this.checkHardConstraints(match, slot)) {
          // Alocar slot
          this.allocateSlot(match, slot);
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Encontra slots candidatos para um jogo
   */
  private findCandidateSlots(
    match: Match,
    allSlots: TimeSlot[]
  ): TimeSlot[] {
    const matchDuration = match.duration || this.tournament.defaultMatchDuration;

    // Filtrar slots que:
    // 1. Não estão ocupados
    // 2. Têm duração suficiente
    // 3. Estão no período válido do torneio
    let candidates = allSlots.filter(slot =>
      !slot.isOccupied &&
      slot.durationMinutes >= matchDuration &&
      this.isWithinTournamentDates(slot.date)
    );

    // Agrupar slots consecutivos da mesma quadra
    candidates = this.mergeConsecutiveSlots(candidates);

    // Ordenar por score de viabilidade
    return candidates
      .map(slot => ({
        slot,
        score: this.calculateSlotScore(match, slot)
      }))
      .sort((a, b) => b.score - a.score)
      .map(item => item.slot);
  }

  /**
   * Calcula score de viabilidade de um slot para um jogo
   */
  private calculateSlotScore(match: Match, slot: TimeSlot): number {
    let score = 100;

    const players = this.getMatchPlayers(match);

    // Verificar disponibilidade de cada jogador
    for (const player of players) {
      if (!this.isPlayerAvailable(player, slot)) {
        return -1; // Inviável
      }
    }

    // Calcular penalidades e bônus

    // 1. Intervalo desde último jogo dos jogadores
    for (const player of players) {
      const lastMatch = this.getPlayerLastMatch(player, slot.date);
      if (lastMatch) {
        const interval = this.calculateInterval(lastMatch, slot);
        if (interval < 30) {
          score -= 100; // Penalidade alta - menos de 30 min
        } else if (interval < 60) {
          score -= 30; // Menos de 1h
        } else if (interval > 240) {
          score -= 10; // Muito tempo entre jogos (> 4h)
        } else {
          score += 10; // Intervalo ideal
        }
      }
    }

    // 2. Horário do dia
    const hour = parseInt(slot.startTime.split(':')[0]);
    if (hour >= 8 && hour <= 12) {
      score += 20; // Manhã - preferível para liberar quadras
    } else if (hour >= 13 && hour <= 18) {
      score += 15; // Tarde
    } else {
      score += 5; // Noite
    }

    // 3. Dia da semana
    const dayOfWeek = slot.date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      score += 5; // Final de semana - mais pessoas disponíveis
    }

    // 4. Distribuição de jogos no dia
    const matchesOnDay = this.countMatchesOnDay(slot.date);
    if (matchesOnDay < 5) {
      score += 10; // Poucos jogos no dia - boa distribuição
    } else if (matchesOnDay > 15) {
      score -= 20; // Muitos jogos no dia
    }

    // 5. Utilização da quadra
    const courtUsage = this.getCourtUsageRate(slot.courtId, slot.date);
    if (courtUsage < 0.7) {
      score += 5; // Quadra subutilizada
    }

    // 6. Proximidade com outros jogos do mesmo grupo/fase
    const samePhaseMatches = this.getSamePhaseMatches(match);
    for (const otherMatch of samePhaseMatches) {
      const otherSlot = this.schedule.get(otherMatch.id);
      if (otherSlot && this.isSameDay(slot.date, otherSlot.date)) {
        score += 15; // Bônus por agrupar jogos da mesma fase
      }
    }

    return score;
  }

  /**
   * Verifica se um slot é viável para um jogo (restrições rígidas)
   */
  private checkHardConstraints(match: Match, slot: TimeSlot): boolean {
    const players = this.getMatchPlayers(match);

    // 1. Verificar se todos os jogadores estão disponíveis
    for (const player of players) {
      if (!this.isPlayerAvailable(player, slot)) {
        return false;
      }
    }

    // 2. Verificar se nenhum jogador tem outro jogo no mesmo horário
    for (const player of players) {
      if (this.hasPlayerMatchAt(player, slot)) {
        return false;
      }
    }

    // 3. Verificar se a quadra está livre
    if (this.isCourtOccupied(slot.courtId, slot.date, slot.startTime)) {
      return false;
    }

    // 4. Verificar se o jogo cabe no slot
    const matchDuration = match.duration || this.tournament.defaultMatchDuration;
    if (slot.durationMinutes < matchDuration) {
      return false;
    }

    return true;
  }

  /**
   * Verifica se um jogador está disponível em um slot
   */
  private isPlayerAvailable(player: Player, slot: TimeSlot): boolean {
    const availability = this.playerAvailabilities.get(player.id);
    if (!availability) {
      return true; // Se não informou, assume disponível
    }

    // Verificar indisponibilidades específicas
    for (const unavailable of availability.unavailableSlots) {
      if (
        this.isSameDay(unavailable.date, slot.date) &&
        this.timesOverlap(
          unavailable.startTime,
          unavailable.endTime,
          slot.startTime,
          slot.endTime
        )
      ) {
        return false;
      }
    }

    // Verificar disponibilidades gerais (dia da semana)
    const dayOfWeek = slot.date.getDay();
    const hasAvailability = availability.availableSlots.some(avail =>
      avail.dayOfWeek === dayOfWeek &&
      this.timeIsWithin(
        slot.startTime,
        slot.endTime,
        avail.startTime,
        avail.endTime
      )
    );

    return hasAvailability;
  }

  /**
   * Aloca um slot para um jogo
   */
  private allocateSlot(match: Match, slot: TimeSlot): void {
    // Marcar slot como ocupado
    slot.isOccupied = true;
    slot.occupiedBy = match.id;

    // Adicionar ao schedule
    this.schedule.set(match.id, slot);

    // Atualizar jogo com informações de agendamento
    match.courtId = slot.courtId;
    match.scheduledDate = slot.date;
    match.scheduledStartTime = slot.startTime;
    match.scheduledEndTime = this.calculateEndTime(
      slot.startTime,
      match.duration || this.tournament.defaultMatchDuration
    );
    match.status = 'scheduled';
  }

  /**
   * Tenta resolver conflitos automaticamente
   */
  private attemptConflictResolution(): void {
    const maxIterations = 3;
    let iteration = 0;

    while (this.conflicts.length > 0 && iteration < maxIterations) {
      const unresolvedConflicts: Conflict[] = [];

      for (const conflict of this.conflicts) {
        // Tentar cada sugestão
        let resolved = false;

        for (const suggestion of conflict.suggestions) {
          const slot = this.findSlot(suggestion.slotId);

          if (slot && this.checkHardConstraints(conflict.match, slot)) {
            // Tentar realocar
            const affectedMatches = this.findAffectedMatches(slot);

            if (affectedMatches.length === 0) {
              // Sem impacto - pode alocar
              this.allocateSlot(conflict.match, slot);
              resolved = true;
              break;
            } else {
              // Tentar realocar os jogos afetados
              const canReallocate = this.tryReallocate(affectedMatches);
              if (canReallocate) {
                this.allocateSlot(conflict.match, slot);
                resolved = true;
                break;
              }
            }
          }
        }

        if (!resolved) {
          unresolvedConflicts.push(conflict);
        }
      }

      this.conflicts = unresolvedConflicts;
      iteration++;
    }
  }

  /**
   * Gera sugestões para resolver um conflito
   */
  private generateSuggestions(
    match: Match,
    availableSlots: TimeSlot[]
  ): Suggestion[] {
    const suggestions: Suggestion[] = [];

    // Tentar relaxar algumas restrições flexíveis
    const relaxedSlots = this.findSlotsWithRelaxedConstraints(
      match,
      availableSlots
    );

    for (const slot of relaxedSlots.slice(0, 10)) {
      const score = this.calculateSlotScore(match, slot);

      if (score > 0) {
        suggestions.push({
          slotId: slot.id,
          courtId: slot.courtId,
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          score,
          issues: this.identifyIssues(match, slot),
          alternatives: []
        });
      }
    }

    // Se ainda não tem sugestões, tentar realocar outros jogos
    if (suggestions.length === 0) {
      const reallocationSuggestions = this.findReallocationOptions(match);
      suggestions.push(...reallocationSuggestions);
    }

    // Ordenar por score
    return suggestions.sort((a, b) => b.score - a.score).slice(0, 5);
  }

  /**
   * Identifica problemas específicos de um slot
   */
  private identifyIssues(match: Match, slot: TimeSlot): string[] {
    const issues: string[] = [];
    const players = this.getMatchPlayers(match);

    // Verificar cada restrição flexível violada
    for (const player of players) {
      const lastMatch = this.getPlayerLastMatch(player, slot.date);
      if (lastMatch) {
        const interval = this.calculateInterval(lastMatch, slot);
        if (interval < 60) {
          issues.push(
            `${player.name} tem outro jogo ${interval} minutos antes`
          );
        }
      }

      if (!this.isPlayerAvailable(player, slot)) {
        const availability = this.playerAvailabilities.get(player.id);
        issues.push(
          `${player.name} não marcou este horário como disponível`
        );
      }
    }

    const matchesOnDay = this.countMatchesOnDay(slot.date);
    if (matchesOnDay > 15) {
      issues.push(`Muitos jogos agendados neste dia (${matchesOnDay})`);
    }

    return issues;
  }

  /**
   * Calcula estatísticas do agendamento
   */
  private calculateStatistics(): SchedulingStats {
    return {
      totalMatches: this.matches.length,
      scheduledMatches: this.schedule.size,
      conflictedMatches: this.conflicts.length,
      courtUsageRate: this.calculateAverageCourtUsage(),
      averageMatchesPerDay: this.calculateAverageMatchesPerDay(),
      playersWithConflicts: this.countPlayersWithConflicts(),
      distribution: this.analyzeDistribution()
    };
  }
}
```

---

## 4. Algoritmo de Backtracking (Alternativa para Torneios Pequenos)

Para torneios pequenos (< 50 jogos), podemos usar backtracking para encontrar solução ótima:

```typescript
class BacktrackingScheduler {
  private bestSolution: Map<string, TimeSlot> | null = null;
  private bestScore: number = -Infinity;

  scheduleWithBacktracking(
    matches: Match[],
    slots: TimeSlot[],
    maxTime: number = 30000 // 30 segundos
  ): Map<string, TimeSlot> {
    const startTime = Date.now();
    const currentSchedule = new Map<string, TimeSlot>();

    this.backtrack(matches, slots, currentSchedule, 0, startTime, maxTime);

    return this.bestSolution || new Map();
  }

  private backtrack(
    matches: Match[],
    slots: TimeSlot[],
    currentSchedule: Map<string, TimeSlot>,
    matchIndex: number,
    startTime: number,
    maxTime: number
  ): boolean {
    // Timeout
    if (Date.now() - startTime > maxTime) {
      return false;
    }

    // Caso base: todos os jogos agendados
    if (matchIndex === matches.length) {
      const score = this.evaluateSolution(currentSchedule);
      if (score > this.bestScore) {
        this.bestScore = score;
        this.bestSolution = new Map(currentSchedule);
      }
      return true;
    }

    const match = matches[matchIndex];

    // Tentar cada slot
    for (const slot of slots) {
      if (this.canAllocate(match, slot, currentSchedule)) {
        // Alocar
        currentSchedule.set(match.id, slot);

        // Recursão
        this.backtrack(
          matches,
          slots,
          currentSchedule,
          matchIndex + 1,
          startTime,
          maxTime
        );

        // Desalocar (backtrack)
        currentSchedule.delete(match.id);
      }
    }

    return false;
  }

  private evaluateSolution(schedule: Map<string, TimeSlot>): number {
    let score = 0;

    // Avaliar qualidade da solução
    // Quanto maior o score, melhor

    for (const [matchId, slot] of schedule.entries()) {
      const match = this.findMatch(matchId);
      score += this.calculateSlotScore(match, slot);
    }

    return score;
  }
}
```

---

## 5. Otimizações de Performance

### 5.1 Indexação de Dados
```typescript
class SchedulingCache {
  // Índices para acesso rápido
  private playerMatchIndex: Map<string, Set<string>>; // playerId -> matchIds
  private courtSlotIndex: Map<string, TimeSlot[]>; // courtId -> slots
  private dateSlotIndex: Map<string, TimeSlot[]>; // date -> slots

  buildIndexes(matches: Match[], slots: TimeSlot[]): void {
    // Construir índices uma vez no início
    this.playerMatchIndex = new Map();
    this.courtSlotIndex = new Map();
    this.dateSlotIndex = new Map();

    // Popular índices...
  }

  getPlayerMatches(playerId: string): Set<string> {
    return this.playerMatchIndex.get(playerId) || new Set();
  }
}
```

### 5.2 Paralelização
```typescript
async scheduleInParallel(matches: Match[]): Promise<void> {
  // Dividir jogos em grupos independentes
  const groups = this.groupIndependentMatches(matches);

  // Agendar cada grupo em paralelo
  await Promise.all(
    groups.map(group => this.scheduleGroup(group))
  );
}

private groupIndependentMatches(matches: Match[]): Match[][] {
  // Agrupar jogos que não compartilham jogadores
  const groups: Match[][] = [];
  const used = new Set<string>();

  for (const match of matches) {
    const players = this.getMatchPlayers(match);
    const playerIds = players.map(p => p.id);

    // Verificar se algum jogador já está em uso
    const hasOverlap = playerIds.some(id => used.has(id));

    if (!hasOverlap) {
      // Criar novo grupo
      groups.push([match]);
      playerIds.forEach(id => used.add(id));
    } else {
      // Adicionar a grupo existente compatível
      const compatibleGroup = groups.find(g =>
        !this.hasPlayerOverlap(g, playerIds)
      );

      if (compatibleGroup) {
        compatibleGroup.push(match);
      } else {
        groups.push([match]);
      }
    }
  }

  return groups;
}
```

### 5.3 Heurísticas de Poda
```typescript
private shouldPruneSlot(
  match: Match,
  slot: TimeSlot,
  currentSchedule: Map<string, TimeSlot>
): boolean {
  // Poda antecipada para evitar explorações inúteis

  // 1. Se o slot já está claramente inviável
  const quickScore = this.calculateQuickScore(match, slot);
  if (quickScore < 0) {
    return true; // Poda
  }

  // 2. Se este slot tornaria impossível agendar jogos futuros
  const remainingMatches = this.getRemainingMatches(match);
  const remainingSlots = this.getRemainingSlots(currentSchedule);

  if (remainingSlots.length < remainingMatches.length) {
    return true; // Poda - não há slots suficientes
  }

  // 3. Se estamos longe da melhor solução encontrada
  if (this.bestScore > -Infinity) {
    const potentialScore = this.estimatePotentialScore(
      currentSchedule,
      remainingMatches
    );
    if (potentialScore < this.bestScore * 0.8) {
      return true; // Poda - improvável melhorar a melhor solução
    }
  }

  return false;
}
```

---

## 6. Casos de Teste

### Teste 1: Torneio Simples
- 8 equipes
- 2 quadras
- 2 dias disponíveis
- Sem restrições de jogadores
- Esperado: Todos os jogos agendados sem conflitos

### Teste 2: Restrições de Disponibilidade
- 4 equipes
- 1 quadra
- Jogador A disponível apenas manhã
- Jogador B disponível apenas tarde
- Esperado: Jogos distribuídos conforme disponibilidade

### Teste 3: Conflito Irresolvível
- 2 equipes com mesmo jogador
- 1 quadra
- 1 slot disponível
- Esperado: Um conflito gerado com sugestões

### Teste 4: Torneio Grande
- 64 equipes
- 4 quadras
- 7 dias disponíveis
- 30% dos jogadores com restrições
- Esperado: Maioria dos jogos agendados, lista de conflitos gerenciável

---

## 7. Complexidade

### Tempo de Execução
- **Pior caso:** O(n! * m) onde n = número de jogos, m = número de slots
- **Caso médio com heurísticas:** O(n * m * log(m))
- **Com cache e índices:** O(n * m)

### Espaço
- O(n + m + p) onde:
  - n = jogos
  - m = slots
  - p = jogadores

---

**Documento criado em:** 2025-10-31
**Versão:** 1.0
