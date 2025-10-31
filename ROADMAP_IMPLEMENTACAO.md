# Roadmap de Implementação

## 1. Visão Geral das Fases

```
┌──────────────────────────────────────────────────────────────────┐
│                    LINHA DO TEMPO                                │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Fase 1: Setup & MVP         [████████] 3-4 semanas             │
│  Fase 2: Agendamento Auto    [████████] 2-3 semanas             │
│  Fase 3: Chaveamento Avançado[████████] 2 semanas               │
│  Fase 4: UX & Otimizações    [████████] 2-3 semanas             │
│  Fase 5: Testes & Deploy     [████████] 1-2 semanas             │
│                                                                  │
│  TOTAL ESTIMADO: 10-14 semanas (~3 meses)                       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Fase 1: Setup & MVP (3-4 semanas)

### Semana 1: Configuração Inicial

#### Backend
- [ ] Inicializar projeto Node.js + TypeScript
- [ ] Configurar NestJS (ou Express)
- [ ] Configurar Prisma ORM
- [ ] Configurar PostgreSQL (Docker)
- [ ] Setup de variáveis de ambiente
- [ ] Configurar ESLint + Prettier
- [ ] Configurar Jest para testes

**Tempo estimado:** 2-3 dias

#### Frontend
- [ ] Inicializar projeto React + TypeScript (Vite)
- [ ] Configurar Material-UI ou Ant Design
- [ ] Configurar Redux Toolkit
- [ ] Configurar React Router
- [ ] Configurar Axios
- [ ] Setup de variáveis de ambiente

**Tempo estimado:** 2-3 dias

#### DevOps
- [ ] Criar docker-compose.yml
- [ ] Configurar containers (app, db)
- [ ] Script de inicialização

**Tempo estimado:** 1 dia

---

### Semana 2: Modelos e CRUD Básico

#### Database Schema
```prisma
// schema.prisma

model Tournament {
  id                    String   @id @default(uuid())
  name                  String
  sport                 String
  category              String
  startDate             DateTime
  endDate               DateTime
  status                TournamentStatus @default(DRAFT)
  format                TournamentFormat
  matchDuration         Int      @default(90)
  breakBetweenMatches   Int      @default(15)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  courts                Court[]
  teams                 Team[]
  matches               Match[]
  groups                Group[]
}

model Court {
  id            String   @id @default(uuid())
  tournamentId  String
  name          String
  location      String?
  sport         String
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())

  tournament    Tournament @relation(fields: [tournamentId], references: [id])
  timeSlots     TimeSlot[]
  matches       Match[]
}

model TimeSlot {
  id            String   @id @default(uuid())
  courtId       String
  dayOfWeek     DayOfWeek?
  date          DateTime?
  startTime     String
  endTime       String
  isAvailable   Boolean  @default(true)

  court         Court    @relation(fields: [courtId], references: [id])
}

model Team {
  id            String   @id @default(uuid())
  tournamentId  String
  name          String
  seed          Int?
  groupId       String?
  createdAt     DateTime @default(now())

  tournament    Tournament @relation(fields: [tournamentId], references: [id])
  group         Group?     @relation(fields: [groupId], references: [id])
  players       Player[]
  matchesAsTeamA Match[]   @relation("TeamA")
  matchesAsTeamB Match[]   @relation("TeamB")
}

model Player {
  id            String   @id @default(uuid())
  name          String
  email         String
  phone         String?
  category      String?
  createdAt     DateTime @default(now())

  teams         Team[]
  availabilities PlayerAvailability[]
}

model PlayerAvailability {
  id            String   @id @default(uuid())
  playerId      String
  tournamentId  String
  dayOfWeek     DayOfWeek?
  specificDate  DateTime?
  startTime     String
  endTime       String
  isAvailable   Boolean  @default(true)
  notes         String?

  player        Player   @relation(fields: [playerId], references: [id])
}

model Group {
  id                String   @id @default(uuid())
  tournamentId      String
  name              String
  advancingTeams    Int      @default(2)

  tournament        Tournament @relation(fields: [tournamentId], references: [id])
  teams             Team[]
  matches           Match[]
}

model Match {
  id                    String   @id @default(uuid())
  tournamentId          String
  phase                 MatchPhase
  groupId               String?
  round                 Int?
  teamAId               String
  teamBId               String
  courtId               String?
  scheduledDate         DateTime?
  scheduledStartTime    String?
  scheduledEndTime      String?
  actualStartTime       DateTime?
  actualEndTime         DateTime?
  status                MatchStatus @default(PENDING)
  scoreTeamA            Int?
  scoreTeamB            Int?
  winnerId              String?
  nextMatchId           String?
  nextMatchPosition     NextMatchPosition?
  createdAt             DateTime @default(now())

  tournament            Tournament @relation(fields: [tournamentId], references: [id])
  group                 Group?     @relation(fields: [groupId], references: [id])
  teamA                 Team       @relation("TeamA", fields: [teamAId], references: [id])
  teamB                 Team       @relation("TeamB", fields: [teamBId], references: [id])
  court                 Court?     @relation(fields: [courtId], references: [id])
  conflicts             Conflict[]
}

model Conflict {
  id                    String   @id @default(uuid())
  matchId               String
  type                  ConflictType
  description           String
  suggestedAlternatives Json
  status                ConflictStatus @default(UNRESOLVED)
  createdAt             DateTime @default(now())

  match                 Match    @relation(fields: [matchId], references: [id])
}

enum TournamentStatus {
  DRAFT
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum TournamentFormat {
  GROUP
  ELIMINATION
  MIXED
}

enum DayOfWeek {
  MONDAY
  TUESDAY
  WEDNESDAY
  THURSDAY
  FRIDAY
  SATURDAY
  SUNDAY
}

enum MatchPhase {
  GROUP
  ROUND_32
  ROUND_16
  QUARTER
  SEMI
  THIRD_PLACE
  FINAL
}

enum MatchStatus {
  PENDING
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  CONFLICT
}

enum NextMatchPosition {
  TEAM_A
  TEAM_B
}

enum ConflictType {
  COURT_UNAVAILABLE
  PLAYER_UNAVAILABLE
  DOUBLE_BOOKING
  TIME_CONSTRAINT
}

enum ConflictStatus {
  UNRESOLVED
  RESOLVED
  IGNORED
}
```

**Tempo estimado:** 2 dias

#### Backend - CRUD APIs
- [ ] Tournament CRUD
- [ ] Court CRUD
- [ ] Team CRUD
- [ ] Player CRUD
- [ ] TimeSlot CRUD
- [ ] PlayerAvailability CRUD

**Tempo estimado:** 3 dias

#### Frontend - Páginas Básicas
- [ ] Lista de Torneios
- [ ] Criar/Editar Torneio
- [ ] Gerenciar Quadras
- [ ] Gerenciar Equipes
- [ ] Gerenciar Jogadores

**Tempo estimado:** 3-4 dias

---

### Semana 3-4: Visualização de Agenda

#### Backend
- [ ] API para buscar agenda
- [ ] API para agendar jogo manualmente
- [ ] Validações básicas

**Tempo estimado:** 2 dias

#### Frontend
- [ ] Integrar biblioteca de calendário (FullCalendar)
- [ ] Visualização semanal
- [ ] Visualização por quadra
- [ ] Drag & drop para agendamento manual
- [ ] Modal de detalhes do jogo

**Tempo estimado:** 4-5 dias

#### Testes
- [ ] Testes unitários backend
- [ ] Testes de integração

**Tempo estimado:** 2 dias

---

## 3. Fase 2: Agendamento Automático (2-3 semanas)

### Semana 5: Algoritmo Base

#### Backend - Scheduling Service
```typescript
// scheduling.service.ts

@Injectable()
export class SchedulingService {
  async scheduleMatches(tournamentId: string): Promise<SchedulingResult> {
    // 1. Carregar dados
    const tournament = await this.loadTournament(tournamentId);
    const matches = await this.loadMatches(tournamentId);
    const courts = await this.loadCourts(tournamentId);
    const timeSlots = await this.generateTimeSlots(courts);
    const availabilities = await this.loadPlayerAvailabilities(tournamentId);

    // 2. Executar algoritmo
    const engine = new SchedulingEngine(
      matches,
      timeSlots,
      availabilities,
      tournament
    );

    return await engine.schedule();
  }
}
```

**Implementar:**
- [ ] Geração de time slots
- [ ] Cálculo de prioridades
- [ ] Função de score de viabilidade
- [ ] Verificação de hard constraints
- [ ] Alocação de slots

**Tempo estimado:** 5-6 dias

---

### Semana 6: Detecção e Resolução de Conflitos

#### Backend
- [ ] Serviço de detecção de conflitos
- [ ] Geração de sugestões
- [ ] API para listar conflitos
- [ ] API para resolver conflitos

**Tempo estimado:** 4 dias

#### Frontend
- [ ] Página de lista de conflitos
- [ ] Interface de resolução de conflitos
- [ ] Preview de sugestões
- [ ] Confirmação de resolução

**Tempo estimado:** 3 dias

---

### Semana 7: Otimizações do Algoritmo

- [ ] Implementar cache
- [ ] Otimizar queries do banco
- [ ] Adicionar índices
- [ ] Implementar paginação
- [ ] Melhorar performance do algoritmo

**Tempo estimado:** 4-5 dias

---

## 4. Fase 3: Chaveamento Avançado (2 semanas)

### Semana 8: Geração de Chaveamentos

#### Fase de Grupos
- [ ] Algoritmo de divisão em grupos
- [ ] Geração de jogos round-robin
- [ ] Cálculo de classificação
- [ ] Definir classificados

**Tempo estimado:** 3 dias

#### Eliminatórias
- [ ] Geração de bracket
- [ ] Distribuição por seeds
- [ ] Atualização automática após resultados
- [ ] Disputa de 3º lugar

**Tempo estimado:** 3 dias

#### Frontend - Visualização
- [ ] Componente de visualização de grupos
- [ ] Componente de bracket (eliminatórias)
- [ ] Tabela de classificação
- [ ] Interface de sorteio

**Tempo estimado:** 4 dias

---

### Semana 9: Torneio Misto

- [ ] Lógica de transição grupos → eliminatórias
- [ ] Sorteio cruzado entre grupos
- [ ] Agendamento em fases
- [ ] Testes integrados

**Tempo estimado:** 5 dias

---

## 5. Fase 4: UX & Funcionalidades Extras (2-3 semanas)

### Semana 10: Notificações

- [ ] Sistema de envio de emails
- [ ] Templates de email
- [ ] Notificação de agenda publicada
- [ ] Notificação de mudanças
- [ ] Lembrete de jogos (24h antes)
- [ ] SMS (opcional)

**Tempo estimado:** 4-5 dias

---

### Semana 11: Exportação e Relatórios

- [ ] Exportar para PDF
- [ ] Exportar para iCalendar (.ics)
- [ ] Exportar para Excel
- [ ] Dashboard de estatísticas
- [ ] Relatório de utilização de quadras

**Tempo estimado:** 4-5 dias

---

### Semana 12: Melhorias de UX

- [ ] Responsividade mobile
- [ ] Modo escuro (opcional)
- [ ] Loading states
- [ ] Error handling melhorado
- [ ] Tooltips e ajudas
- [ ] Tutoriais guiados
- [ ] Feedback visual

**Tempo estimado:** 5 dias

---

## 6. Fase 5: Testes & Deploy (1-2 semanas)

### Semana 13: Testes

- [ ] Testes end-to-end (Cypress/Playwright)
- [ ] Testes de carga
- [ ] Testes de regressão
- [ ] Testes com usuários reais (beta)
- [ ] Correção de bugs encontrados

**Tempo estimado:** 5-7 dias

---

### Semana 14: Deploy

- [ ] Configurar ambiente de produção
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Configurar domínio
- [ ] SSL/HTTPS
- [ ] Backup automático de banco
- [ ] Monitoring (Sentry, etc)
- [ ] Documentação final

**Tempo estimado:** 3-4 dias

---

## 7. Priorização de Features (MoSCoW)

### Must Have (Essencial)
- ✅ CRUD de torneios, quadras, equipes
- ✅ Cadastro de disponibilidade
- ✅ Agendamento automático básico
- ✅ Detecção de conflitos
- ✅ Visualização de agenda
- ✅ Chaveamento de grupos
- ✅ Chaveamento de eliminatórias

### Should Have (Importante)
- ⭐ Resolução inteligente de conflitos
- ⭐ Notificações por email
- ⭐ Exportação para PDF
- ⭐ Dashboard de estatísticas
- ⭐ Torneio misto
- ⭐ Sistema de seeds

### Could Have (Desejável)
- 💡 Notificações SMS
- 💡 App mobile
- 💡 Integração com Google Calendar
- 💡 Sistema de pagamento
- 💡 Chat entre jogadores
- 💡 Transmissão ao vivo

### Won't Have (Não será feito agora)
- ❌ Inteligência artificial para prever resultados
- ❌ Rede social completa
- ❌ Marketplace de torneios
- ❌ Gamificação avançada

---

## 8. Estimativas de Esforço

### Por Módulo

| Módulo                    | Complexidade | Dias | Desenvolvedor |
|---------------------------|--------------|------|---------------|
| Setup Inicial             | Baixa        | 5    | Backend       |
| Database & Models         | Média        | 3    | Backend       |
| CRUD APIs                 | Baixa        | 5    | Backend       |
| Frontend Base             | Média        | 5    | Frontend      |
| Calendário/Agenda         | Alta         | 7    | Frontend      |
| Algoritmo Agendamento     | Muito Alta   | 10   | Backend       |
| Gestão de Conflitos       | Alta         | 6    | Full Stack    |
| Chaveamento Grupos        | Média        | 4    | Backend       |
| Chaveamento Eliminatórias | Alta         | 5    | Backend       |
| Visualização Brackets     | Alta         | 5    | Frontend      |
| Notificações              | Média        | 4    | Backend       |
| Exportações               | Média        | 4    | Full Stack    |
| Dashboard                 | Média        | 3    | Frontend      |
| Testes                    | Alta         | 7    | Full Stack    |
| Deploy                    | Média        | 3    | DevOps        |
| **TOTAL**                 |              | **76 dias** | |

### Por Perfil

- **Backend Developer:** ~40 dias
- **Frontend Developer:** ~30 dias
- **Full Stack:** ~6 dias (pode fazer ambos)
- **DevOps:** ~3 dias

### Configurações de Time

#### Opção 1: Solo Full Stack Developer
- **Tempo total:** ~76 dias úteis (~4 meses)
- **Vantagens:** Menor custo, visão unificada
- **Desvantagens:** Mais lento, maior risco de burnout

#### Opção 2: Dupla (Backend + Frontend)
- **Tempo total:** ~40 dias úteis (~2 meses)
- **Vantagens:** Desenvolvimento paralelo, especialização
- **Desvantagens:** Necessita coordenação, maior custo

#### Opção 3: Time Completo (2 Backend + 2 Frontend + 1 DevOps)
- **Tempo total:** ~20 dias úteis (~1 mês)
- **Vantagens:** Muito rápido, alta qualidade
- **Desvantagens:** Alto custo, pode ter overhead de comunicação

---

## 9. Riscos e Mitigações

### Risco 1: Algoritmo de Agendamento Muito Complexo
**Probabilidade:** Alta
**Impacto:** Alto

**Mitigação:**
- Começar com versão simples (greedy)
- Iterar e melhorar baseado em testes reais
- Considerar usar biblioteca de constraint programming

### Risco 2: Performance com Muitos Jogos
**Probabilidade:** Média
**Impacto:** Alto

**Mitigação:**
- Implementar cache desde o início
- Usar indexação adequada no banco
- Processar em background para torneios grandes
- Limitar tamanho de torneios na versão 1

### Risco 3: UX Complexa para Usuários
**Probabilidade:** Média
**Impacto:** Médio

**Mitigação:**
- Fazer testes de usabilidade cedo
- Criar wizard guiado
- Fornecer templates prontos
- Documentação e vídeos tutoriais

### Risco 4: Bugs em Casos de Borda
**Probabilidade:** Alta
**Impacto:** Médio

**Mitigação:**
- Testes abrangentes
- Beta com usuários reais
- Logging detalhado
- Sistema de rollback

---

## 10. Stack Tecnológico Recomendado

### Backend
```json
{
  "runtime": "Node.js 20+",
  "framework": "NestJS",
  "language": "TypeScript",
  "orm": "Prisma",
  "database": "PostgreSQL 15+",
  "cache": "Redis (opcional para v1)",
  "validation": "class-validator",
  "testing": "Jest + Supertest",
  "documentation": "Swagger/OpenAPI"
}
```

### Frontend
```json
{
  "framework": "React 18+",
  "language": "TypeScript",
  "bundler": "Vite",
  "ui": "Material-UI v5",
  "state": "Redux Toolkit",
  "router": "React Router v6",
  "forms": "React Hook Form + Zod",
  "calendar": "FullCalendar",
  "http": "Axios",
  "testing": "Jest + React Testing Library"
}
```

### DevOps
```yaml
containerization: Docker + Docker Compose
ci_cd: GitHub Actions
hosting_backend: Railway / Render / DigitalOcean
hosting_frontend: Vercel / Netlify
database_hosting: Supabase / Railway
monitoring: Sentry
analytics: Google Analytics (opcional)
```

---

## 11. Próximos Passos Imediatos

### 1. Validação (Esta semana)
- [ ] Revisar planejamento com stakeholders
- [ ] Definir escopo final da v1
- [ ] Escolher stack definitivo
- [ ] Definir time e orçamento

### 2. Setup (Semana 1)
- [ ] Criar repositórios
- [ ] Configurar ambientes (dev, staging, prod)
- [ ] Setup de ferramentas (Slack, Jira, etc)
- [ ] Kickoff meeting

### 3. Desenvolvimento (Semanas 2-13)
- [ ] Seguir roadmap
- [ ] Sprints semanais
- [ ] Reviews regulares
- [ ] Ajustes conforme necessário

### 4. Lançamento (Semana 14)
- [ ] Beta fechado
- [ ] Correções finais
- [ ] Deploy produção
- [ ] Marketing e divulgação

---

**Documento criado em:** 2025-10-31
**Versão:** 1.0
**Próxima revisão:** Após validação com stakeholders
