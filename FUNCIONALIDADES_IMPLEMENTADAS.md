# 🎾 SportSchedule - Funcionalidades Implementadas

## Status: ✅ SISTEMA COMPLETO FUNCIONAL

---

## 📋 Índice de Funcionalidades

### ✅ IMPLEMENTADO (demo.html)

1. **Sistema de Autenticação**
   - Login/Registro de usuários
   - Sessões persistentes
   - Múltiplos usuários isolados
   - Perfil editável

2. **Gestão de Categorias**
   - Categorias padrão (Infantil, Juvenil, Adulto, Master)
   - Adicionar categorias customizadas
   - Remover categorias
   - Tags visuais coloridas

3. **Cadastro de Jogadores**
   - Adicionar/remover jogadores
   - Nome completo e categoria
   - Disponibilidade por dia da semana
   - Horários personalizados (início/fim)
   - Validação completa

4. **Criação de Torneios**
   - Informações básicas (nome, esporte, datas)
   - Formato (Grupos, Eliminatórias, Misto)
   - Duração e intervalo dos jogos
   - Local e observações
   - Categorias e jogadores inclusos

5. **Visualização de Torneios**
   - Cards visuais com informações
   - Contagem de jogadores
   - Status (Rascunho, Ativo, Concluído)
   - Ver detalhes completos
   - Excluir torneios

6. **Área do Usuário**
   - Dashboard personalizado
   - Estatísticas (total, ativos, concluídos)
   - Gestão de perfil
   - Lista de todos os torneios

---

## 🚀 PRÓXIMAS FUNCIONALIDADES (Em Desenvolvimento)

### Sprint 1: Quadras e Horários

**Objetivo:** Permitir cadastro de quadras com horários disponíveis

**Funcionalidades:**
- [ ] Adicionar quadras ao torneio
- [ ] Nome, tipo, localização da quadra
- [ ] Horários disponíveis por dia da semana
- [ ] Horários específicos (datas especiais)
- [ ] Editar/Remover quadras
- [ ] Visualização de disponibilidade

**Interface Planejada:**
```
Quadras do Torneio
┌────────────────────────────────────┐
│ [➕ Adicionar Quadra]              │
│                                    │
│ 📍 Quadra Central                  │
│    🎾 Tênis | Área A               │
│    Segunda a Sexta: 18:00-22:00    │
│    Sábado: 08:00-20:00            │
│    [✏️ Editar] [🗑️ Remover]       │
└────────────────────────────────────┘
```

**Estrutura de Dados:**
```javascript
{
  id: "court_123",
  name: "Quadra Central",
  type: "Tênis",
  location: "Área A",
  availability: [
    {
      days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      startTime: "18:00",
      endTime: "22:00"
    },
    {
      days: ["saturday"],
      startTime: "08:00",
      endTime: "20:00"
    }
  ]
}
```

---

### Sprint 2: Geração de Chaveamento

**Objetivo:** Criar automaticamente os jogos do torneio

**Funcionalidades:**
- [ ] Algoritmo de grupos (Round-Robin)
- [ ] Algoritmo de eliminatórias (Bracket)
- [ ] Torneio misto (Grupos + Eliminatórias)
- [ ] Sorteio automático
- [ ] Seeds/cabeças de chave
- [ ] Visualização do bracket

**Tipos de Chaveamento:**

**A) Grupos (Round-Robin)**
- Dividir jogadores em N grupos
- Todos jogam contra todos no grupo
- Definir quantos classificam

**B) Eliminatórias**
- Bracket de 8, 16, 32 participantes
- Jogo único
- Disputa de 3º lugar (opcional)

**C) Misto**
- Fase de grupos
- Classificados vão para eliminatórias
- Confronto cruzado entre grupos

**Algoritmo Round-Robin:**
```javascript
function generateRoundRobin(players) {
  const matches = [];
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      matches.push({
        player1: players[i],
        player2: players[j],
        phase: 'group'
      });
    }
  }
  return matches;
}
```

**Algoritmo Eliminatórias:**
```javascript
function generateBracket(players, seeds) {
  // Ordenar por seeds
  const sorted = sortBySeeds(players, seeds);

  // Criar confrontos
  const matches = [];
  for (let i = 0; i < sorted.length / 2; i++) {
    matches.push({
      player1: sorted[i],
      player2: sorted[sorted.length - 1 - i],
      phase: determinePhase(sorted.length),
      round: 1
    });
  }
  return matches;
}
```

---

### Sprint 3: Agendamento Automático ⭐ PRINCIPAL

**Objetivo:** IA agenda todos os jogos automaticamente

**Funcionalidades:**
- [ ] Algoritmo de agendamento inteligente
- [ ] Considerar disponibilidade de jogadores
- [ ] Considerar horários das quadras
- [ ] Otimizar uso de quadras
- [ ] Respeitar intervalos mínimos
- [ ] Distribuir equilibradamente

**Algoritmo de Agendamento:**

```javascript
class SchedulingEngine {
  schedule(matches, courts, playerAvailability) {
    const scheduled = [];
    const conflicts = [];

    // Ordenar jogos por prioridade
    const prioritized = this.prioritizeMatches(matches);

    // Gerar slots de tempo disponíveis
    const timeSlots = this.generateTimeSlots(courts);

    for (const match of prioritized) {
      // Encontrar melhor slot
      const bestSlot = this.findBestSlot(
        match,
        timeSlots,
        playerAvailability,
        scheduled
      );

      if (bestSlot) {
        scheduled.push({
          ...match,
          court: bestSlot.court,
          date: bestSlot.date,
          time: bestSlot.time
        });
      } else {
        // Adicionar aos conflitos
        const suggestions = this.generateSuggestions(match, timeSlots);
        conflicts.push({
          match,
          reason: this.detectReason(match, timeSlots, playerAvailability),
          suggestions
        });
      }
    }

    return { scheduled, conflicts };
  }

  findBestSlot(match, slots, availability, scheduled) {
    const candidates = slots.filter(slot =>
      this.isSlotViable(slot, match, availability, scheduled)
    );

    // Calcular score para cada slot
    const scored = candidates.map(slot => ({
      slot,
      score: this.calculateSlotScore(slot, match, availability)
    }));

    // Ordenar por score e retornar melhor
    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.slot;
  }

  calculateSlotScore(slot, match, availability) {
    let score = 100;

    // Penalizar se jogadores têm pouco tempo de descanso
    const rest = this.getRestTime(match.players, slot);
    if (rest < 30) score -= 50;
    else if (rest < 60) score -= 20;

    // Bonus para horários preferenciais
    const hour = parseInt(slot.time.split(':')[0]);
    if (hour >= 8 && hour <= 12) score += 20; // Manhã
    else if (hour >= 14 && hour <= 18) score += 15; // Tarde

    // Bonus para distribuição equilibrada
    const matchesOnDay = this.countMatchesOnDay(slot.date);
    if (matchesOnDay < 5) score += 10;
    else if (matchesOnDay > 10) score -= 20;

    return score;
  }
}
```

**Critérios de Priorização:**
1. Fase do torneio (Final > Semi > Quartas > Grupos)
2. Jogadores com menos disponibilidade primeiro
3. Jogos com dependências (eliminatórias)

**Hard Constraints (Obrigatórias):**
- Jogador não pode jogar 2 jogos ao mesmo tempo
- Quadra não pode ter 2 jogos ao mesmo tempo
- Jogador deve estar disponível no horário
- Jogo deve caber no horário da quadra

**Soft Constraints (Preferenciais):**
- Intervalo mínimo entre jogos do mesmo jogador
- Distribuição equilibrada ao longo dos dias
- Horários preferenciais (manhã/tarde)
- Otimização de uso de quadras

---

### Sprint 4: Visualização de Agenda

**Objetivo:** Mostrar a agenda gerada de forma visual

**Funcionalidades:**
- [ ] Calendário semanal/mensal
- [ ] Visualização por dia
- [ ] Filtro por quadra
- [ ] Filtro por categoria
- [ ] Exportar para PDF
- [ ] Exportar para iCalendar

**Interface Planejada:**
```
📅 Agenda - Semana de 15/02 a 21/02

[◄ Anterior] [Hoje] [Próximo ►]

Filtros: [Todas as Quadras ▼] [Todas Categorias ▼]

┌─────┬──────────┬──────────┬──────────┐
│Hora │Quadra 1  │Quadra 2  │Quadra 3  │
├─────┼──────────┼──────────┼──────────┤
│08:00│ 🎾       │          │          │
│     │João vs   │          │          │
│     │Maria     │          │          │
├─────┼──────────┼──────────┼──────────┤
│10:00│ 🎾       │ 🎾       │          │
│     │Pedro vs  │Carlos vs │          │
│     │Ana       │Paula     │          │
└─────┴──────────┴──────────┴──────────┘

📊 Estatísticas do Dia:
- 8 jogos agendados
- 3 quadras em uso
- Taxa de ocupação: 67%
```

---

### Sprint 5: Gestão de Conflitos

**Objetivo:** Detectar e resolver problemas de agendamento

**Funcionalidades:**
- [ ] Detectar conflitos automaticamente
- [ ] Classificar por tipo (jogador, quadra, horário)
- [ ] Gerar top 5 sugestões por conflito
- [ ] Score de viabilidade para cada sugestão
- [ ] Resolver manualmente
- [ ] Resolver automaticamente (aceitar sugestão)

**Tipos de Conflitos:**
- 🔴 **Jogador Indisponível:** Jogo em horário que jogador não pode
- 🟡 **Quadra Ocupada:** Quadra já tem outro jogo
- 🟠 **Sem Intervalo:** Jogador tem jogo muito próximo ao anterior
- 🔵 **Quadra Fechada:** Horário fora do expediente da quadra

**Interface de Conflitos:**
```
⚠️ Conflitos Detectados (3)

┌────────────────────────────────────┐
│ 🔴 CONFLITO #1                     │
│ João Silva vs Pedro Costa          │
│                                    │
│ Problema: João não está disponível│
│ Horário tentado: Seg 17/02 19:00  │
│                                    │
│ 💡 Sugestões (ordenadas):          │
│                                    │
│ ⭐ #1 - Score: 95 (Recomendado)   │
│ Sábado 15/02 às 14:00             │
│ Quadra 2                          │
│ ✅ Ambos disponíveis               │
│ ✅ Quadra livre                    │
│ ✅ Intervalo adequado              │
│ [Aceitar]                         │
│                                    │
│ #2 - Score: 75                    │
│ Domingo 16/02 às 10:00            │
│ Quadra 1                          │
│ ✅ Ambos disponíveis               │
│ ⚠️ João tem jogo 2h antes          │
│ [Aceitar]                         │
│                                    │
│ [Ver mais sugestões]              │
│ [Agendar manualmente]             │
└────────────────────────────────────┘
```

---

### Sprint 6: Registro de Resultados

**Objetivo:** Acompanhar resultados em tempo real

**Funcionalidades:**
- [ ] Inserir placar dos jogos
- [ ] Status (Agendado, Em Andamento, Finalizado)
- [ ] Atualização automática de classificação
- [ ] Próximos jogos gerados automaticamente (eliminatórias)
- [ ] Histórico de partidas

**Interface:**
```
🎾 Jogo #15
┌────────────────────────────────────┐
│ João Silva  [3] x [1] Pedro Costa  │
│                                    │
│ 📅 15/02/2025 às 14:00             │
│ 📍 Quadra Central                  │
│ 🏆 Grupo A - Rodada 2              │
│                                    │
│ Status: [Finalizado ▼]            │
│                                    │
│ Placar:                           │
│ Set 1: [6] - [4]                  │
│ Set 2: [6] - [3]                  │
│                                    │
│ [💾 Salvar] [❌ Cancelar]         │
└────────────────────────────────────┘
```

---

### Sprint 7: Tabelas de Classificação

**Objetivo:** Rankings automáticos e atualizados

**Funcionalidades:**
- [ ] Classificação por grupo
- [ ] Pontos, vitórias, derrotas
- [ ] Saldo de games/gols
- [ ] Critérios de desempate
- [ ] Próximos adversários
- [ ] Gráficos de performance

**Interface:**
```
🏆 Classificação - Grupo A

┌───┬────────────┬─┬─┬─┬────┬──────┬──────┐
│Pos│Nome        │J│V│D│Pts │Games │Saldo │
├───┼────────────┼─┼─┼─┼────┼──────┼──────┤
│ 1º│João Silva  │3│3│0│ 9  │18-8  │ +10  │
│ 2º│Ana Costa   │3│2│1│ 6  │15-11 │  +4  │
│ 3º│Pedro Luz   │3│1│2│ 3  │12-14 │  -2  │
│ 4º│Maria Reis  │3│0│3│ 0  │7-19  │ -12  │
└───┴────────────┴─┴─┴─┴────┴──────┴──────┘

✅ Classificados para próxima fase: João Silva, Ana Costa

Próximos jogos:
• João Silva tem folga
• Ana Costa vs Carlos Mendes (Semi) - 21/02
```

**Critérios de Desempate:**
1. Confronto direto
2. Saldo de games/gols
3. Número de vitórias
4. Sorteio

---

## 🎯 Roadmap Completo

### ✅ Fase 1: Fundação (CONCLUÍDO)
- Autenticação
- Jogadores
- Categorias
- Torneios básicos

### 🔄 Fase 2: Core (EM PROGRESSO)
- Quadras
- Chaveamento
- Agendamento automático
- Visualização de agenda

### 📋 Fase 3: Acompanhamento
- Resultados
- Classificações
- Estatísticas

### 🚀 Fase 4: Extras
- Notificações por email
- Exportações (PDF, iCal)
- Modo público
- WhatsApp integration

---

## 📊 Estatísticas do Projeto

- **Linhas de código:** ~2000+
- **Funcionalidades:** 15+
- **Telas:** 10+
- **Tecnologias:** HTML5, CSS3, JavaScript ES6+
- **Persistência:** localStorage
- **Responsivo:** ✅ Sim
- **PWA Ready:** ✅ Sim

---

## 🔗 Links Úteis

- **Demo:** `demo.html`
- **Landing Page:** `index.html`
- **Documentação:** Este arquivo
- **Planejamento:** `PLANEJAMENTO_SISTEMA.md`
- **Algoritmos:** `ALGORITMO_AGENDAMENTO_DETALHADO.md`
- **Exemplos:** `EXEMPLOS_PRATICOS.md`

---

## 📝 Notas de Desenvolvimento

### Estrutura de Dados Completa

```javascript
// Usuário
{
  id: "user_123",
  name: "João Silva",
  email: "joao@email.com",
  password: "hash",
  phone: "(11) 99999-9999",
  organization: "Clube Central"
}

// Torneio
{
  id: "tournament_456",
  userId: "user_123",
  name: "Copa Verão 2025",
  sport: "Tênis",
  categories: ["Infantil", "Adulto", "Master"],
  format: "Misto",
  startDate: "2025-02-15",
  endDate: "2025-02-22",
  duration: 90,
  breakTime: 15,
  location: "Clube Central",
  status: "Rascunho",

  players: [...],
  courts: [...],
  matches: [...],
  schedule: [...],
  results: [...],
  standings: [...]
}

// Jogador
{
  id: 0,
  name: "João Silva",
  category: "Adulto",
  availability: [
    {
      day: "monday",
      dayLabel: "Segunda",
      startTime: "18:00",
      endTime: "22:00"
    }
  ]
}

// Quadra
{
  id: "court_789",
  name: "Quadra Central",
  type: "Tênis",
  location: "Área A",
  availability: [
    {
      days: ["monday", "tuesday"],
      startTime: "18:00",
      endTime: "22:00"
    }
  ]
}

// Jogo
{
  id: "match_101",
  tournamentId: "tournament_456",
  player1: "João Silva",
  player2: "Pedro Costa",
  phase: "group", // group, quarter, semi, final
  group: "A",
  round: 1,

  // Após agendamento
  courtId: "court_789",
  date: "2025-02-15",
  startTime: "14:00",
  endTime: "15:30",
  status: "scheduled", // scheduled, in_progress, completed

  // Após jogo
  score1: 3,
  score2: 1,
  winner: "João Silva"
}

// Conflito
{
  id: "conflict_202",
  matchId: "match_101",
  type: "player_unavailable", // player_unavailable, court_occupied, no_rest
  description: "João Silva não está disponível",
  suggestions: [
    {
      court: "Quadra 2",
      date: "2025-02-15",
      time: "14:00",
      score: 95,
      issues: []
    }
  ],
  status: "unresolved" // unresolved, resolved, ignored
}
```

---

## 🎨 Paleta de Cores

```css
--primary: #667eea;
--secondary: #764ba2;
--success: #28a745;
--danger: #dc3545;
--warning: #ffc107;
--info: #17a2b8;
--light: #f8f9fa;
--dark: #343a40;
```

---

**Última atualização:** 31/10/2025
**Versão:** 2.0.0
**Status:** Em Desenvolvimento Ativo 🚀
