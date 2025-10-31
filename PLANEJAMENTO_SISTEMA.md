# Planejamento: Sistema de Agendamento de Jogos Esportivos

## 1. Visão Geral do Sistema

Sistema para gerenciar torneios esportivos com agendamento inteligente de jogos, considerando:
- Disponibilidade de quadras/campos
- Disponibilidade de horários dos jogadores
- Diferentes formatos de chaveamento (grupos, eliminatórias, misto)
- Resolução automática de conflitos de horários

---

## 2. Entidades/Modelos de Dados

### 2.1 Tournament (Torneio)
```
- id: UUID
- name: string
- sport: string (futebol, tênis, vôlei, etc)
- startDate: date
- endDate: date
- status: enum (draft, scheduled, in_progress, completed)
- format: enum (group, elimination, mixed)
- category: string (infantil, juvenil, adulto, etc)
- matchDuration: integer (minutos)
- breakBetweenMatches: integer (minutos)
- createdAt: timestamp
- updatedAt: timestamp
```

### 2.2 Court (Quadra/Campo)
```
- id: UUID
- tournamentId: UUID (FK)
- name: string
- sport: string
- location: string
- isActive: boolean
- createdAt: timestamp
```

### 2.3 TimeSlot (Horário Disponível)
```
- id: UUID
- courtId: UUID (FK)
- dayOfWeek: enum (monday-sunday)
- startTime: time
- endTime: time
- date: date (opcional, para horários específicos)
- isAvailable: boolean
```

### 2.4 Player (Jogador)
```
- id: UUID
- name: string
- email: string
- phone: string
- category: string
- createdAt: timestamp
```

### 2.5 Team (Equipe)
```
- id: UUID
- tournamentId: UUID (FK)
- name: string
- players: array[Player] (pode ser 1 jogador para individuais)
- groupId: UUID (FK, opcional)
- seed: integer (classificação)
- createdAt: timestamp
```

### 2.6 Group (Grupo)
```
- id: UUID
- tournamentId: UUID (FK)
- name: string (Grupo A, B, C, etc)
- teams: array[Team]
- advancingTeams: integer (quantos classificam)
```

### 2.7 Match (Jogo/Partida)
```
- id: UUID
- tournamentId: UUID (FK)
- phase: enum (group, round_16, quarter, semi, final, third_place)
- groupId: UUID (FK, opcional)
- round: integer
- teamA: UUID (FK)
- teamB: UUID (FK)
- courtId: UUID (FK)
- scheduledDate: date
- scheduledStartTime: time
- scheduledEndTime: time
- actualStartTime: time (opcional)
- actualEndTime: time (opcional)
- status: enum (scheduled, in_progress, completed, cancelled, conflict)
- scoreTeamA: integer
- scoreTeamB: integer
- winner: UUID (FK Team)
- nextMatchId: UUID (FK Match, para eliminatórias)
- nextMatchPosition: enum (teamA, teamB)
- createdAt: timestamp
```

### 2.8 PlayerAvailability (Disponibilidade do Jogador)
```
- id: UUID
- playerId: UUID (FK)
- tournamentId: UUID (FK)
- dayOfWeek: enum (monday-sunday)
- startTime: time
- endTime: time
- specificDate: date (opcional)
- isAvailable: boolean
- notes: text
```

### 2.9 Conflict (Conflito)
```
- id: UUID
- matchId: UUID (FK)
- type: enum (court_unavailable, player_unavailable, double_booking)
- description: text
- suggestedAlternatives: json (array de alternativas)
- status: enum (unresolved, resolved, ignored)
- createdAt: timestamp
```

---

## 3. Funcionalidades Principais

### 3.1 Configuração do Torneio
- Criar torneio com informações básicas
- Definir formato (grupos, eliminatórias, misto)
- Configurar duração dos jogos e intervalos
- Adicionar quadras disponíveis
- Definir horários disponíveis por quadra

### 3.2 Cadastro de Participantes
- Cadastrar jogadores/equipes
- Associar jogadores às equipes
- Definir categoria de cada participante
- Registrar disponibilidade de cada jogador

### 3.3 Sistema de Chaveamento

#### A) Fase de Grupos
- Dividir equipes em grupos (A, B, C, etc)
- Todos jogam contra todos no grupo
- Definir quantos classificam por grupo
- Calcular classificação (pontos, saldo, etc)

#### B) Eliminatórias
- Estrutura de bracket (16, 8, 4, 2)
- Definir confrontos baseado em classificação
- Jogo único ou melhor de 3/5
- Disputa de 3º lugar (opcional)

#### C) Misto (Grupos + Eliminatórias)
- Fase de grupos primeiro
- Classificados vão para eliminatórias
- Sorteio ou confronto cruzado entre grupos

### 3.4 Sorteio de Jogos
- Sorteio aleatório respeitando:
  - Cabeças de chave (seeds)
  - Equipes do mesmo grupo não se enfrentam nas primeiras fases
  - Distribuição geográfica (se aplicável)
- Sorteio de posição no bracket de eliminatórias

### 3.5 Agendamento Automático
- **Algoritmo de preenchimento inteligente**
- Ordenar jogos por prioridade (finais > semis > quartas > grupos)
- Tentar agendar considerando:
  1. Disponibilidade de quadras
  2. Disponibilidade de TODOS os jogadores envolvidos
  3. Intervalos entre jogos do mesmo jogador/equipe
  4. Distribuição equilibrada ao longo dos dias

### 3.6 Gestão de Conflitos
- Detectar conflitos automaticamente:
  - Jogador em dois jogos simultâneos
  - Jogador indisponível no horário
  - Quadra já ocupada
  - Falta de tempo para deslocamento
- Listar conflitos não resolvidos
- Sugerir alternativas:
  - Outros horários disponíveis
  - Outras quadras
  - Troca de ordem dos jogos
- Permitir resolução manual

---

## 4. Algoritmos Principais

### 4.1 Algoritmo de Geração de Chaveamento

#### Fase de Grupos (Round-Robin)
```
Para cada grupo:
  teams = equipes do grupo
  Para i de 0 até len(teams)-1:
    Para j de i+1 até len(teams):
      criar_jogo(teams[i], teams[j])
```

#### Eliminatórias (Bracket)
```
1. Ordenar equipes por seed
2. Criar estrutura do bracket:
   - Final: 1 jogo
   - Semi: 2 jogos (vencedores vão para final)
   - Quartas: 4 jogos (vencedores vão para semi)
   - Oitavas: 8 jogos (vencedores vão para quartas)
3. Distribuir equipes no bracket:
   - Seed 1 vs Seed N
   - Seed 2 vs Seed N-1
   - etc.
```

### 4.2 Algoritmo de Agendamento Automático

```python
def agendar_jogos(torneio):
    jogos = obter_jogos_nao_agendados(torneio)
    quadras = obter_quadras(torneio)
    slots_disponiveis = obter_slots_disponiveis(quadras)

    # Ordenar jogos por prioridade
    jogos = ordenar_por_prioridade(jogos)

    jogos_agendados = []
    conflitos = []

    for jogo in jogos:
        melhor_slot = None
        melhor_score = -1

        for slot in slots_disponiveis:
            if slot.is_occupied:
                continue

            # Verificar se o slot é viável
            score = calcular_viabilidade(jogo, slot)

            if score > melhor_score:
                melhor_score = score
                melhor_slot = slot

        if melhor_slot and melhor_score > 0:
            # Agendar jogo
            agendar(jogo, melhor_slot)
            marcar_slot_ocupado(melhor_slot)
            jogos_agendados.append(jogo)
        else:
            # Adicionar à lista de conflitos
            sugestoes = gerar_sugestoes(jogo, slots_disponiveis)
            conflitos.append({
                'jogo': jogo,
                'razao': 'sem_slot_disponivel',
                'sugestoes': sugestoes
            })

    return jogos_agendados, conflitos


def calcular_viabilidade(jogo, slot):
    score = 100

    # Penalizar se jogadores não estão disponíveis
    for jogador in obter_jogadores(jogo):
        if not jogador_disponivel(jogador, slot):
            return 0  # Inviável

    # Bonus se há intervalo adequado desde último jogo dos jogadores
    for jogador in obter_jogadores(jogo):
        ultimo_jogo = obter_ultimo_jogo(jogador)
        if ultimo_jogo:
            intervalo = calcular_intervalo(ultimo_jogo.end_time, slot.start_time)
            if intervalo < 30:  # Menos de 30 min
                score -= 50
            elif intervalo < 60:  # Menos de 1h
                score -= 20

    # Bonus para horários mais cedo no dia (para liberar quadras)
    if slot.start_time.hour < 12:
        score += 10

    return score


def gerar_sugestoes(jogo, slots_disponiveis):
    sugestoes = []

    # Tentar slots alternativos
    for slot in slots_disponiveis:
        if not slot.is_occupied:
            viabilidade = calcular_viabilidade(jogo, slot)
            if viabilidade > 0:
                sugestoes.append({
                    'quadra': slot.quadra,
                    'horario': slot.start_time,
                    'viabilidade': viabilidade
                })

    # Ordenar por viabilidade
    sugestoes = sorted(sugestoes, key=lambda x: x['viabilidade'], reverse=True)

    # Retornar top 5
    return sugestoes[:5]
```

### 4.3 Algoritmo de Detecção de Conflitos

```python
def detectar_conflitos(torneio):
    jogos_agendados = obter_jogos_agendados(torneio)
    conflitos = []

    for jogo in jogos_agendados:
        # Verificar conflito de quadra
        outros_jogos_mesma_quadra = filtrar_jogos_por_quadra_e_horario(
            jogos_agendados, jogo.quadra, jogo.start_time, jogo.end_time
        )
        if len(outros_jogos_mesma_quadra) > 1:
            conflitos.append({
                'tipo': 'quadra_duplicada',
                'jogo': jogo,
                'outros_jogos': outros_jogos_mesma_quadra
            })

        # Verificar conflito de jogadores
        jogadores = obter_jogadores(jogo)
        for jogador in jogadores:
            outros_jogos_jogador = filtrar_jogos_por_jogador_e_horario(
                jogos_agendados, jogador, jogo.start_time, jogo.end_time
            )
            if len(outros_jogos_jogador) > 1:
                conflitos.append({
                    'tipo': 'jogador_duplicado',
                    'jogo': jogo,
                    'jogador': jogador,
                    'outros_jogos': outros_jogos_jogador
                })

            # Verificar disponibilidade do jogador
            if not jogador_disponivel(jogador, jogo.start_time, jogo.end_time):
                disponibilidades = obter_disponibilidade_jogador(jogador)
                conflitos.append({
                    'tipo': 'jogador_indisponivel',
                    'jogo': jogo,
                    'jogador': jogador,
                    'disponibilidade': disponibilidades
                })

    return conflitos
```

---

## 5. Fluxo de Funcionamento

### Fluxo 1: Criação de Torneio Simples (Grupos)

```
1. Admin cria torneio
   ↓
2. Define formato: "Grupos"
   ↓
3. Cadastra quadras e horários disponíveis
   ↓
4. Cadastra equipes/jogadores
   ↓
5. Cada jogador define sua disponibilidade
   ↓
6. Sistema divide equipes em grupos automaticamente
   ↓
7. Sistema gera todos os jogos (round-robin)
   ↓
8. Admin clica em "Gerar Agenda Automática"
   ↓
9. Sistema executa algoritmo de agendamento
   ↓
10. Sistema exibe:
    - Jogos agendados com sucesso
    - Lista de conflitos (se houver)
    - Sugestões para resolver conflitos
   ↓
11. Admin resolve conflitos manualmente (se necessário)
   ↓
12. Admin finaliza e publica a agenda
```

### Fluxo 2: Criação de Torneio Eliminatórias

```
1. Admin cria torneio
   ↓
2. Define formato: "Eliminatórias"
   ↓
3. Cadastra quadras e horários
   ↓
4. Cadastra equipes/jogadores
   ↓
5. Define seeds (classificação) de cada equipe
   ↓
6. Jogadores definem disponibilidade
   ↓
7. Sistema gera bracket de eliminatórias
   ↓
8. Admin executa sorteio (ou sistema faz automaticamente)
   ↓
9. Sistema gera agenda automática
   ↓
10. Admin resolve conflitos (se houver)
   ↓
11. Publica agenda
```

### Fluxo 3: Torneio Misto (Grupos + Eliminatórias)

```
1. Admin cria torneio
   ↓
2. Define formato: "Misto"
   ↓
3. Configura:
   - Número de grupos
   - Quantos classificam por grupo
   - Formato das eliminatórias
   ↓
4. Cadastra quadras, horários, equipes
   ↓
5. Jogadores definem disponibilidade
   ↓
6. Sistema gera fase de grupos
   ↓
7. Sistema agenda jogos da fase de grupos
   ↓
8. Admin publica agenda da fase de grupos
   ↓
9. Jogos da fase de grupos são realizados
   ↓
10. Sistema calcula classificação
   ↓
11. Sistema gera bracket de eliminatórias com classificados
   ↓
12. Sistema agenda eliminatórias
   ↓
13. Admin publica agenda das eliminatórias
```

### Fluxo 4: Resolução de Conflitos

```
1. Sistema detecta conflito
   ↓
2. Sistema adiciona à lista de conflitos
   ↓
3. Sistema analisa alternativas viáveis
   ↓
4. Sistema gera top 5 sugestões ordenadas por viabilidade
   ↓
5. Admin visualiza conflito com sugestões
   ↓
6. Admin escolhe uma das opções:
   a) Aceitar sugestão do sistema
   b) Modificar manualmente
   c) Marcar como "não resolver agora"
   ↓
7. Sistema atualiza agenda
   ↓
8. Sistema verifica se a mudança criou novos conflitos
   ↓
9. Se sim, volta ao passo 1
   Se não, conflito resolvido
```

---

## 6. Stack Tecnológico Sugerido

### Frontend
- **Framework:** React.js com TypeScript
- **State Management:** Redux Toolkit ou Zustand
- **UI Components:** Material-UI ou Ant Design
- **Calendar/Schedule:** FullCalendar ou React Big Calendar
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Routing:** React Router

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js ou NestJS (recomendado para projetos maiores)
- **Language:** TypeScript
- **ORM:** Prisma ou TypeORM
- **Authentication:** JWT + bcrypt
- **Validation:** Zod ou class-validator

### Database
- **Primary DB:** PostgreSQL (relacional, bom para relacionamentos complexos)
- **Alternative:** MongoDB (se preferir NoSQL)

### Infraestrutura
- **Containerization:** Docker
- **API Documentation:** Swagger/OpenAPI
- **Testing:** Jest + React Testing Library
- **Code Quality:** ESLint + Prettier

---

## 7. Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Torneios   │  │  Agendamento │  │   Conflitos  │      │
│  │   Module     │  │   Module     │  │    Module    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Equipes    │  │  Jogadores   │  │   Quadras    │      │
│  │   Module     │  │   Module     │  │    Module    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ REST API
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                          BACKEND                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   API Layer                          │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │   │
│  │  │Torneios│ │ Jogos  │ │Equipes │ │Quadras │        │   │
│  │  │  API   │ │  API   │ │  API   │ │  API   │        │   │
│  │  └────────┘ └────────┘ └────────┘ └────────┘        │   │
│  └──────────────────────────────────────────────────────┘   │
│                              │                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  Service Layer                       │   │
│  │  ┌──────────────────┐  ┌──────────────────┐         │   │
│  │  │  Chaveamento     │  │   Agendamento    │         │   │
│  │  │   Service        │  │     Service      │         │   │
│  │  └──────────────────┘  └──────────────────┘         │   │
│  │  ┌──────────────────┐  ┌──────────────────┐         │   │
│  │  │    Conflitos     │  │     Sorteio      │         │   │
│  │  │     Service      │  │     Service      │         │   │
│  │  └──────────────────┘  └──────────────────┘         │   │
│  └──────────────────────────────────────────────────────┘   │
│                              │                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │               Repository Layer (ORM)                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                        DATABASE                             │
│                     PostgreSQL                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Estrutura de Pastas Proposta

```
Marcelo/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── tournaments/
│   │   │   │   ├── controllers/
│   │   │   │   ├── services/
│   │   │   │   ├── repositories/
│   │   │   │   ├── dto/
│   │   │   │   └── entities/
│   │   │   ├── matches/
│   │   │   ├── teams/
│   │   │   ├── players/
│   │   │   ├── courts/
│   │   │   ├── scheduling/
│   │   │   │   ├── services/
│   │   │   │   │   ├── scheduling.service.ts
│   │   │   │   │   ├── conflict.service.ts
│   │   │   │   │   └── bracket.service.ts
│   │   │   └── availability/
│   │   ├── common/
│   │   │   ├── decorators/
│   │   │   ├── filters/
│   │   │   ├── guards/
│   │   │   └── interceptors/
│   │   ├── config/
│   │   ├── database/
│   │   │   ├── migrations/
│   │   │   └── seeds/
│   │   └── main.ts
│   ├── test/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── tournaments/
│   │   │   ├── matches/
│   │   │   ├── schedule/
│   │   │   ├── conflicts/
│   │   │   └── common/
│   │   ├── pages/
│   │   │   ├── TournamentList.tsx
│   │   │   ├── TournamentCreate.tsx
│   │   │   ├── TournamentDetail.tsx
│   │   │   ├── ScheduleView.tsx
│   │   │   └── ConflictResolution.tsx
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   └── store.ts
│   │   ├── services/
│   │   │   └── api/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 9. Casos de Uso Detalhados

### UC-01: Criar Torneio
**Ator:** Administrador
**Pré-condições:** Admin autenticado
**Fluxo:**
1. Admin acessa "Criar Torneio"
2. Preenche informações básicas (nome, esporte, datas, categoria)
3. Seleciona formato (grupos/eliminatórias/misto)
4. Define duração dos jogos e intervalos
5. Sistema valida dados
6. Sistema cria torneio com status "draft"

### UC-02: Cadastrar Quadras
**Ator:** Administrador
**Fluxo:**
1. Admin acessa torneio
2. Clica em "Gerenciar Quadras"
3. Adiciona quadra (nome, localização, esporte)
4. Define horários disponíveis por dia da semana
5. Sistema salva configuração

### UC-03: Cadastrar Equipes e Jogadores
**Ator:** Administrador
**Fluxo:**
1. Admin acessa torneio
2. Adiciona equipes com nome
3. Para cada equipe, adiciona jogadores
4. Define seed (classificação) se aplicável
5. Sistema associa equipes ao torneio

### UC-04: Jogador Define Disponibilidade
**Ator:** Jogador
**Fluxo:**
1. Jogador recebe link/acessa sistema
2. Visualiza calendário do torneio
3. Marca horários em que está disponível
4. Marca horários em que NÃO está disponível
5. Adiciona observações se necessário
6. Sistema salva disponibilidade

### UC-05: Gerar Chaveamento
**Ator:** Sistema (acionado por Admin)
**Fluxo:**
1. Admin clica em "Gerar Chaveamento"
2. Sistema valida se há equipes suficientes
3. Se formato = grupos:
   - Sistema divide equipes em grupos balanceados
   - Gera jogos round-robin em cada grupo
4. Se formato = eliminatórias:
   - Sistema cria bracket baseado em seeds
   - Define confrontos da primeira fase
5. Se formato = misto:
   - Gera fase de grupos primeiro
6. Sistema salva todos os jogos

### UC-06: Agendar Jogos Automaticamente
**Ator:** Sistema (acionado por Admin)
**Fluxo:**
1. Admin clica em "Gerar Agenda Automática"
2. Sistema carrega:
   - Todos os jogos não agendados
   - Todas as quadras e horários disponíveis
   - Disponibilidade de todos os jogadores
3. Sistema executa algoritmo de agendamento
4. Para cada jogo:
   - Busca melhor horário/quadra
   - Verifica conflitos
   - Agenda se viável
5. Sistema retorna:
   - Lista de jogos agendados
   - Lista de conflitos não resolvidos
   - Sugestões para cada conflito

### UC-07: Resolver Conflito
**Ator:** Administrador
**Fluxo:**
1. Admin visualiza lista de conflitos
2. Seleciona um conflito
3. Sistema exibe:
   - Detalhes do jogo
   - Motivo do conflito
   - 5 alternativas sugeridas
4. Admin escolhe uma alternativa OU modifica manualmente
5. Sistema atualiza agenda
6. Sistema verifica se gerou novos conflitos
7. Se sim, adiciona à lista de conflitos

### UC-08: Publicar Agenda
**Ator:** Administrador
**Fluxo:**
1. Admin revisa agenda completa
2. Verifica se há conflitos pendentes
3. Se há conflitos, sistema alerta
4. Admin decide publicar mesmo assim ou resolver conflitos
5. Admin clica em "Publicar Agenda"
6. Sistema altera status do torneio para "scheduled"
7. Sistema envia notificações para jogadores

---

## 10. Priorização de Funcionalidades (MVP)

### Fase 1 - MVP (Mínimo Produto Viável)
- [ ] CRUD de Torneios
- [ ] CRUD de Quadras
- [ ] CRUD de Equipes/Jogadores
- [ ] Cadastro de horários disponíveis (quadras)
- [ ] Geração de chaveamento de grupos (round-robin)
- [ ] Agendamento manual de jogos
- [ ] Visualização de agenda (calendário simples)

### Fase 2 - Agendamento Inteligente
- [ ] Cadastro de disponibilidade de jogadores
- [ ] Algoritmo de agendamento automático básico
- [ ] Detecção de conflitos básicos
- [ ] Lista de conflitos com sugestões

### Fase 3 - Chaveamentos Avançados
- [ ] Geração de eliminatórias (bracket)
- [ ] Torneio misto (grupos + eliminatórias)
- [ ] Sistema de seeds/classificação
- [ ] Atualização automática de bracket após resultados

### Fase 4 - Otimizações e UX
- [ ] Algoritmo de agendamento otimizado
- [ ] Resolução inteligente de conflitos
- [ ] Notificações por email/SMS
- [ ] Exportação de agenda (PDF, iCal)
- [ ] Dashboard com estatísticas

---

## 11. Desafios Técnicos Identificados

### Desafio 1: Otimização do Algoritmo de Agendamento
**Problema:** Com muitos jogos, quadras e restrições, o problema se torna NP-completo
**Solução:**
- Usar algoritmos heurísticos (greedy, backtracking limitado)
- Implementar cache de cálculos
- Limitar profundidade de busca
- Usar programação de restrições (constraint programming)

### Desafio 2: Conflitos Circulares
**Problema:** Resolver um conflito pode criar outro
**Solução:**
- Implementar sistema de propagação de mudanças
- Usar transações para rollback se necessário
- Limitar número de iterações de resolução automática
- Alertar admin sobre conflitos cascata

### Desafio 3: Performance com Muitos Jogadores
**Problema:** Verificar disponibilidade de centenas de jogadores pode ser lento
**Solução:**
- Indexar corretamente no banco de dados
- Usar cache (Redis) para disponibilidades
- Processar em background para torneios grandes
- Implementar paginação e lazy loading no frontend

### Desafio 4: Sincronização de Dados
**Problema:** Múltiplos admins editando agenda simultaneamente
**Solução:**
- Implementar WebSockets para updates em tempo real
- Sistema de locks otimistas
- Versionamento de documentos
- Alertas de conflito de edição

---

## 12. Métricas de Sucesso

- **Taxa de agendamento automático:** % de jogos agendados sem intervenção manual
- **Taxa de conflitos:** % de jogos que geraram conflitos
- **Tempo de resolução:** Tempo médio para resolver um conflito
- **Satisfação dos jogadores:** Jogos agendados em horários disponíveis
- **Utilização de quadras:** % de ocupação das quadras disponíveis
- **Tempo de setup:** Tempo médio para configurar um torneio completo

---

## 13. Próximos Passos

1. **Validar planejamento** com stakeholders
2. **Escolher stack tecnológico** definitivo
3. **Configurar ambiente de desenvolvimento**
4. **Criar estrutura de pastas** e boilerplate
5. **Implementar modelos de dados** (schema do banco)
6. **Desenvolver MVP** (Fase 1)
7. **Testar com torneio real pequeno**
8. **Iterar e adicionar funcionalidades** (Fases 2-4)

---

**Documento criado em:** 2025-10-31
**Versão:** 1.0
