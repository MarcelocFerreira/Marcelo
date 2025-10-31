# Exemplos Práticos do Sistema

## 1. Exemplo Completo: Torneio de Tênis Amateur

### Configuração
- **Nome:** Copa Verão de Tênis 2025
- **Esporte:** Tênis
- **Categoria:** Adulto Amateur
- **Formato:** Misto (Grupos + Eliminatórias)
- **Duração dos jogos:** 90 minutos
- **Intervalo entre jogos:** 15 minutos
- **Período:** 15/02/2025 a 22/02/2025

### Recursos Disponíveis

#### Quadras
1. **Quadra Central**
   - Sábados: 08:00 - 18:00
   - Domingos: 08:00 - 18:00
   - Semana: 18:00 - 22:00

2. **Quadra 2**
   - Todos os dias: 08:00 - 22:00

3. **Quadra 3**
   - Todos os dias: 08:00 - 20:00

### Participantes

#### Grupo A
- **Equipe 1:** João Silva
  - Disponível: Seg-Sex após 18h, Sáb-Dom qualquer hora
- **Equipe 2:** Maria Santos
  - Disponível: Apenas finais de semana
  - Indisponível: Sábado 17/02 manhã
- **Equipe 3:** Pedro Costa
  - Disponível: Seg-Qui após 19h, Sáb-Dom após 14h
- **Equipe 4:** Ana Oliveira
  - Disponível: Ter-Qui após 18h, Sáb-Dom qualquer hora

#### Grupo B
- **Equipe 5:** Carlos Mendes
- **Equipe 6:** Paula Ferreira
- **Equipe 7:** Ricardo Alves
- **Equipe 8:** Juliana Lima

---

## 2. Passo a Passo da Configuração

### Passo 1: Criação do Torneio

```json
POST /api/tournaments
{
  "name": "Copa Verão de Tênis 2025",
  "sport": "tennis",
  "category": "adult_amateur",
  "startDate": "2025-02-15",
  "endDate": "2025-02-22",
  "format": "mixed",
  "matchDuration": 90,
  "breakBetweenMatches": 15,
  "groupSettings": {
    "numberOfGroups": 2,
    "teamsPerGroup": 4,
    "advancingPerGroup": 2
  },
  "eliminationSettings": {
    "format": "single_elimination",
    "hasThirdPlace": true
  }
}
```

**Response:**
```json
{
  "id": "tour-123",
  "status": "draft",
  "createdAt": "2025-01-20T10:00:00Z"
}
```

### Passo 2: Cadastro de Quadras

```json
POST /api/tournaments/tour-123/courts
[
  {
    "name": "Quadra Central",
    "location": "Área Principal",
    "availabilities": [
      {
        "dayOfWeek": "saturday",
        "startTime": "08:00",
        "endTime": "18:00"
      },
      {
        "dayOfWeek": "sunday",
        "startTime": "08:00",
        "endTime": "18:00"
      },
      {
        "dayOfWeek": "monday",
        "startTime": "18:00",
        "endTime": "22:00"
      },
      // ... outros dias da semana
    ]
  },
  // ... outras quadras
]
```

### Passo 3: Cadastro de Equipes

```json
POST /api/tournaments/tour-123/teams
{
  "name": "João Silva",
  "players": [
    {
      "name": "João Silva",
      "email": "joao@email.com",
      "phone": "+5511999999999"
    }
  ],
  "seed": 1
}
```

### Passo 4: Jogadores Definem Disponibilidade

```json
POST /api/players/player-001/availability
{
  "tournamentId": "tour-123",
  "availableSlots": [
    {
      "dayOfWeek": "monday",
      "startTime": "18:00",
      "endTime": "22:00"
    },
    {
      "dayOfWeek": "tuesday",
      "startTime": "18:00",
      "endTime": "22:00"
    },
    {
      "dayOfWeek": "saturday",
      "startTime": "00:00",
      "endTime": "23:59"
    },
    {
      "dayOfWeek": "sunday",
      "startTime": "00:00",
      "endTime": "23:59"
    }
  ],
  "unavailableSlots": []
}
```

### Passo 5: Gerar Chaveamento

```json
POST /api/tournaments/tour-123/generate-bracket
{
  "randomizeSeed": false
}
```

**Response:**
```json
{
  "groups": [
    {
      "id": "group-a",
      "name": "Grupo A",
      "teams": ["team-001", "team-002", "team-003", "team-004"],
      "matches": [
        {
          "id": "match-001",
          "teamA": "team-001",
          "teamB": "team-002",
          "phase": "group",
          "round": 1
        },
        {
          "id": "match-002",
          "teamA": "team-003",
          "teamB": "team-004",
          "phase": "group",
          "round": 1
        },
        // ... outros jogos do grupo
      ]
    },
    {
      "id": "group-b",
      "name": "Grupo B",
      "teams": ["team-005", "team-006", "team-007", "team-008"],
      "matches": [
        // ... jogos do grupo B
      ]
    }
  ],
  "totalMatches": 12, // 6 jogos por grupo
  "eliminationMatches": 4 // Semi (2) + Final (1) + 3º lugar (1)
}
```

### Passo 6: Gerar Agenda Automática

```json
POST /api/tournaments/tour-123/generate-schedule
```

**Response:**
```json
{
  "success": true,
  "scheduled": [
    {
      "matchId": "match-001",
      "teamA": "João Silva",
      "teamB": "Maria Santos",
      "court": "Quadra Central",
      "date": "2025-02-15",
      "startTime": "08:00",
      "endTime": "09:30",
      "status": "scheduled"
    },
    {
      "matchId": "match-002",
      "teamA": "Pedro Costa",
      "teamB": "Ana Oliveira",
      "court": "Quadra 2",
      "date": "2025-02-15",
      "startTime": "18:00",
      "endTime": "19:30",
      "status": "scheduled"
    },
    // ... mais jogos agendados
  ],
  "conflicts": [
    {
      "matchId": "match-003",
      "teamA": "Maria Santos",
      "teamB": "Pedro Costa",
      "reason": "no_feasible_slot",
      "details": "Maria Santos não está disponível nos horários em que Pedro Costa está disponível",
      "suggestions": [
        {
          "court": "Quadra 2",
          "date": "2025-02-16",
          "startTime": "14:00",
          "endTime": "15:30",
          "score": 65,
          "issues": [
            "Pedro Costa preferiu não marcar disponibilidade para este horário, mas não marcou como indisponível"
          ]
        },
        {
          "court": "Quadra Central",
          "date": "2025-02-17",
          "startTime": "10:00",
          "endTime": "11:30",
          "score": 60,
          "issues": [
            "Maria Santos tem outro jogo 2 horas antes"
          ]
        }
        // ... mais sugestões
      ]
    }
  ],
  "statistics": {
    "totalMatches": 12,
    "scheduledMatches": 11,
    "conflictedMatches": 1,
    "courtUsageRate": 0.68,
    "averageMatchesPerDay": 1.5,
    "distribution": {
      "2025-02-15": 3,
      "2025-02-16": 2,
      "2025-02-17": 4,
      "2025-02-18": 2
    }
  }
}
```

---

## 3. Visualização da Agenda Gerada

### Agenda Semanal

```
┌─────────────────────────────────────────────────────────────────────┐
│                  COPA VERÃO DE TÊNIS 2025                           │
│                    Fase de Grupos                                   │
└─────────────────────────────────────────────────────────────────────┘

SÁBADO - 15/02/2025
┌──────────┬─────────────────┬──────────────────────────────────────┐
│ Horário  │ Quadra          │ Jogo                                 │
├──────────┼─────────────────┼──────────────────────────────────────┤
│ 08:00    │ Quadra Central  │ João Silva vs Maria Santos (Grupo A) │
│          │                 │ [AGENDADO]                           │
├──────────┼─────────────────┼──────────────────────────────────────┤
│ 08:00    │ Quadra 2        │ Carlos Mendes vs Paula Ferreira      │
│          │                 │ (Grupo B) [AGENDADO]                 │
├──────────┼─────────────────┼──────────────────────────────────────┤
│ 10:00    │ Quadra Central  │ Ricardo Alves vs Juliana Lima        │
│          │                 │ (Grupo B) [AGENDADO]                 │
├──────────┼─────────────────┼──────────────────────────────────────┤
│ 14:00    │ Quadra 2        │ Pedro Costa vs Ana Oliveira          │
│          │                 │ (Grupo A) [AGENDADO]                 │
└──────────┴─────────────────┴──────────────────────────────────────┘

DOMINGO - 16/02/2025
┌──────────┬─────────────────┬──────────────────────────────────────┐
│ 08:00    │ Quadra Central  │ João Silva vs Pedro Costa (Grupo A)  │
│          │                 │ [AGENDADO]                           │
├──────────┼─────────────────┼──────────────────────────────────────┤
│ 10:00    │ Quadra 2        │ Carlos Mendes vs Ricardo Alves       │
│          │                 │ (Grupo B) [AGENDADO]                 │
└──────────┴─────────────────┴──────────────────────────────────────┘

SEGUNDA - 17/02/2025
┌──────────┬─────────────────┬──────────────────────────────────────┐
│ 18:00    │ Quadra 2        │ João Silva vs Ana Oliveira (Grupo A) │
│          │                 │ [AGENDADO]                           │
├──────────┼─────────────────┼──────────────────────────────────────┤
│ 20:00    │ Quadra 2        │ Paula Ferreira vs Juliana Lima       │
│          │                 │ (Grupo B) [AGENDADO]                 │
└──────────┴─────────────────┴──────────────────────────────────────┘

⚠️  CONFLITOS PENDENTES (1)
┌─────────────────────────────────────────────────────────────────────┐
│ Maria Santos vs Pedro Costa (Grupo A)                               │
│ Motivo: Incompatibilidade de disponibilidade                        │
│                                                                      │
│ SUGESTÕES:                                                           │
│ ⭐ Sexta 16/02 às 14:00 - Quadra 2 (Score: 65)                      │
│    ⚠️  Pedro não confirmou disponibilidade                          │
│                                                                      │
│ ⭐ Sábado 17/02 às 10:00 - Quadra Central (Score: 60)               │
│    ⚠️  Maria tem jogo 2h antes                                      │
│                                                                      │
│ [ Aceitar Sugestão 1 ]  [ Aceitar Sugestão 2 ]  [ Manual ]         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Cenário: Resolução de Conflito

### Interface de Resolução

```
┌─────────────────────────────────────────────────────────────────────┐
│              RESOLVER CONFLITO - Jogo #003                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ Jogo: Maria Santos vs Pedro Costa                                   │
│ Fase: Grupo A - Rodada 2                                            │
│ Duração: 90 minutos                                                  │
│                                                                      │
│ ❌ PROBLEMA DETECTADO:                                               │
│ Não foi possível encontrar horário em que ambos os jogadores        │
│ estejam disponíveis simultaneamente.                                │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│ DISPONIBILIDADE DOS JOGADORES                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ 👤 Maria Santos:                                                     │
│   ✅ Sábados e Domingos: 00:00 - 23:59                              │
│   ❌ Sábado 17/02: 08:00 - 12:00 (indisponível)                     │
│   ❌ Segunda a Sexta: indisponível                                  │
│                                                                      │
│ 👤 Pedro Costa:                                                      │
│   ✅ Segunda a Quinta: 19:00 - 22:00                                │
│   ✅ Sábados e Domingos: 14:00 - 20:00                              │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│ HORÁRIOS COMUNS ENCONTRADOS                                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ 🟢 OPÇÃO 1 (Recomendada) - Score: 85                                │
│    Sábado 16/02/2025 às 14:00                                       │
│    Quadra 2                                                          │
│    ✅ Ambos disponíveis                                             │
│    ✅ Quadra livre                                                  │
│    ✅ Intervalo adequado desde últimos jogos                        │
│    [ SELECIONAR ESTA OPÇÃO ]                                        │
│                                                                      │
│ 🟡 OPÇÃO 2 - Score: 70                                              │
│    Domingo 17/02/2025 às 15:00                                      │
│    Quadra 3                                                          │
│    ✅ Ambos disponíveis                                             │
│    ✅ Quadra livre                                                  │
│    ⚠️  Pedro tem jogo 3h antes                                      │
│    [ SELECIONAR ESTA OPÇÃO ]                                        │
│                                                                      │
│ 🟡 OPÇÃO 3 - Score: 60                                              │
│    Sábado 16/02/2025 às 16:00                                       │
│    Quadra Central                                                    │
│    ✅ Ambos disponíveis                                             │
│    ⚠️  Maria tem jogo 1h antes                                      │
│    ⚠️  Muitos jogos agendados neste dia (8 jogos)                  │
│    [ SELECIONAR ESTA OPÇÃO ]                                        │
│                                                                      │
│ 📅 OPÇÃO 4 - Agendar Manualmente                                    │
│    [ ABRIR CALENDÁRIO ]                                             │
│                                                                      │
│ 📞 OPÇÃO 5 - Solicitar Flexibilidade                                │
│    Enviar mensagem aos jogadores pedindo para revisar               │
│    disponibilidade                                                   │
│    [ ENVIAR SOLICITAÇÃO ]                                           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Após Resolver

```
✅ Conflito resolvido com sucesso!

Jogo agendado:
- Maria Santos vs Pedro Costa
- Sábado 16/02/2025 às 14:00
- Quadra 2
- Duração: 90 minutos (14:00 - 15:30)

📧 Notificações enviadas para:
  - maria.santos@email.com
  - pedro.costa@email.com

[ Resolver Próximo Conflito ]  [ Voltar para Agenda ]
```

---

## 5. Exemplo de Notificação aos Jogadores

### Email para João Silva

```
Assunto: Sua agenda - Copa Verão de Tênis 2025

Olá João Silva,

Sua agenda para a Copa Verão de Tênis 2025 está pronta! 🎾

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SEUS JOGOS - FASE DE GRUPOS

📅 Sábado 15/02/2025
   08:00 - 09:30
   🏟️  Quadra Central
   ⚔️  João Silva vs Maria Santos

📅 Domingo 16/02/2025
   08:00 - 09:30
   🏟️  Quadra Central
   ⚔️  João Silva vs Pedro Costa

📅 Segunda 17/02/2025
   18:00 - 19:30
   🏟️  Quadra 2
   ⚔️  João Silva vs Ana Oliveira

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  IMPORTANTE:
- Chegue 15 minutos antes do horário
- Em caso de atraso, avise a organização
- Se não puder comparecer, avise com 24h de antecedência

🔗 Ver agenda completa: https://torneioapp.com/tour-123/schedule
🔗 Classificação ao vivo: https://torneioapp.com/tour-123/standings

Boa sorte! 🏆

--
Organização Copa Verão de Tênis 2025
```

---

## 6. Dashboard de Estatísticas

```
┌─────────────────────────────────────────────────────────────────────┐
│              COPA VERÃO DE TÊNIS 2025 - DASHBOARD                   │
└─────────────────────────────────────────────────────────────────────┘

VISÃO GERAL
┌──────────────────────┬──────────────────────┬──────────────────────┐
│  Total de Jogos      │  Jogos Agendados     │  Conflitos           │
│       16             │        15            │         1            │
│  ████████████  100%  │  ███████████░  94%   │  █░░░░░░░░░░  6%     │
└──────────────────────┴──────────────────────┴──────────────────────┘

TAXA DE UTILIZAÇÃO DAS QUADRAS
┌─────────────────────────────────────────────────────────────────────┐
│ Quadra Central  ████████░░░░  68%  │  34h de 50h disponíveis       │
│ Quadra 2        ███████████░  82%  │  57h de 70h disponíveis       │
│ Quadra 3        ████████░░░░  65%  │  39h de 60h disponíveis       │
└─────────────────────────────────────────────────────────────────────┘

DISTRIBUIÇÃO DE JOGOS POR DIA
┌─────────────────────────────────────────────────────────────────────┐
│       4 jogos                                                        │
│   3 │     ██                                                         │
│   2 │ ██  ██  ██                                                     │
│   1 │ ██  ██  ██  ██  ██                                             │
│   0 └─────────────────────────────────────────────                  │
│       Sáb Dom Seg Ter Qua                                            │
│       15  16  17  18  19                                             │
└─────────────────────────────────────────────────────────────────────┘

JOGADORES COM MAIS JOGOS
┌─────────────────────────────────────────────────────────────────────┐
│ 1. João Silva         █████████  3 jogos                            │
│ 2. Maria Santos       █████████  3 jogos                            │
│ 3. Pedro Costa        █████████  3 jogos                            │
│ 4. Ana Oliveira       █████████  3 jogos                            │
└─────────────────────────────────────────────────────────────────────┘

HORÁRIOS MAIS UTILIZADOS
┌─────────────────────────────────────────────────────────────────────┐
│ 08:00 - 10:00  ███████████  5 jogos                                 │
│ 10:00 - 12:00  ████████░░░  3 jogos                                 │
│ 14:00 - 16:00  ████████░░░  3 jogos                                 │
│ 18:00 - 20:00  ██████░░░░░  2 jogos                                 │
│ 20:00 - 22:00  ███████░░░░  2 jogos                                 │
└─────────────────────────────────────────────────────────────────────┘

TAXA DE SATISFAÇÃO (baseada em disponibilidade)
┌─────────────────────────────────────────────────────────────────────┐
│ Jogos em horários preferenciais:    13/15  (87%)                    │
│ Jogos com intervalo adequado:       15/15  (100%)                   │
│ Jogadores com conflitos:             2/8   (25%)                    │
│                                                                      │
│ SCORE GERAL: ████████░░ 87/100                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 7. Fluxo de Fase de Eliminatórias

Após a fase de grupos, o sistema automaticamente:

### 1. Calcula Classificação

```
GRUPO A - CLASSIFICAÇÃO FINAL
┌──────┬─────────────────┬─────┬─────┬─────┬──────┬─────┬────────┐
│ Pos  │ Equipe          │  J  │  V  │  D  │  SP  │ SC  │ Pontos │
├──────┼─────────────────┼─────┼─────┼─────┼──────┼─────┼────────┤
│  1º  │ João Silva      │  3  │  3  │  0  │  18  │  8  │   9    │
│  2º  │ Ana Oliveira    │  3  │  2  │  1  │  15  │ 11  │   6    │
│  3º  │ Maria Santos    │  3  │  1  │  2  │  12  │ 14  │   3    │
│  4º  │ Pedro Costa     │  3  │  0  │  3  │   7  │ 19  │   0    │
└──────┴─────────────────┴─────┴─────┴─────┴──────┴─────┴────────┘
✅ Classificados: João Silva, Ana Oliveira

GRUPO B - CLASSIFICAÇÃO FINAL
┌──────┬─────────────────┬─────┬─────┬─────┬──────┬─────┬────────┐
│  1º  │ Carlos Mendes   │  3  │  3  │  0  │  18  │  9  │   9    │
│  2º  │ Paula Ferreira  │  3  │  2  │  1  │  16  │ 10  │   6    │
│  3º  │ Ricardo Alves   │  3  │  1  │  2  │  11  │ 15  │   3    │
│  4º  │ Juliana Lima    │  3  │  0  │  3  │   6  │ 17  │   0    │
└──────┴─────────────────┴─────┴─────┴─────┴──────┴─────┴────────┘
✅ Classificados: Carlos Mendes, Paula Ferreira
```

### 2. Gera Bracket de Eliminatórias

```
SEMIFINAIS
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  1º Grupo A (João Silva)      ┐                           │
│                                ├─────► [SF1] ─────┐       │
│  2º Grupo B (Paula Ferreira)  ┘                   │       │
│                                                    │       │
│                                                    ▼       │
│  1º Grupo B (Carlos Mendes)   ┐              [ FINAL ]    │
│                                ├─────► [SF2] ─────┘       │
│  2º Grupo A (Ana Oliveira)    ┘                           │
│                                                            │
└────────────────────────────────────────────────────────────┘

DISPUTA DE 3º LUGAR
┌────────────────────────────────────────────────────────────┐
│  Perdedor SF1  ──────► [3º Lugar] ◄────── Perdedor SF2     │
└────────────────────────────────────────────────────────────┘
```

### 3. Agenda Eliminatórias

```
POST /api/tournaments/tour-123/schedule-elimination
```

**Agenda Gerada:**

```
SEMIFINAIS - 21/02/2025 (Sábado)
┌──────────┬─────────────────┬──────────────────────────────────┐
│ 10:00    │ Quadra Central  │ SF1: João Silva vs Paula Ferreira│
│ 14:00    │ Quadra Central  │ SF2: Carlos Mendes vs Ana Oliveira│
└──────────┴─────────────────┴──────────────────────────────────┘

FINAIS - 22/02/2025 (Domingo)
┌──────────┬─────────────────┬──────────────────────────────────┐
│ 10:00    │ Quadra Central  │ Disputa de 3º Lugar              │
│ 14:00    │ Quadra Central  │ GRANDE FINAL 🏆                  │
└──────────┴─────────────────┴──────────────────────────────────┘
```

---

## 8. Exportação de Agenda (PDF)

### Opções de Exportação

```
EXPORTAR AGENDA
┌─────────────────────────────────────────────────────────────┐
│ Formato:                                                    │
│  ○ PDF Completo (todos os jogos)                           │
│  ○ PDF por Jogador (individual)                            │
│  ○ PDF por Quadra                                          │
│  ○ iCalendar (.ics) - importar para Google/Outlook        │
│  ○ Excel (.xlsx)                                           │
│  ○ CSV                                                     │
│                                                             │
│ Incluir:                                                    │
│  ☑ Endereço das quadras                                    │
│  ☑ Telefones de contato                                   │
│  ☑ Regras do torneio                                       │
│  ☑ QR Code para acompanhamento online                     │
│                                                             │
│ [ GERAR ]  [ CANCELAR ]                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Caso de Uso: Torneio de Futebol Society

### Diferenças em relação ao Tênis

- **Jogo por Equipe:** 6-10 jogadores por time
- **Disponibilidade:** Verificar todos os jogadores da equipe
- **Duração:** 50 minutos (2 tempos de 25min)
- **Intervalo:** 10 minutos entre jogos
- **Critério de Agendamento:**
  - Mínimo 50% dos jogadores disponíveis
  - Priorizar horários com mais jogadores disponíveis

### Exemplo de Conflito Complexo

```
⚠️  CONFLITO DETECTADO

Jogo: Estrelas FC vs Relâmpago FC
Quadra: Campo 1
Horário Sugerido: Sábado 10:00

DISPONIBILIDADE ESTRELAS FC (8 jogadores)
✅ Disponíveis (6): João, Pedro, Carlos, Ana, Rita, Paulo
❌ Indisponíveis (2): Fernando, Lucas

DISPONIBILIDADE RELÂMPAGO FC (7 jogadores)
✅ Disponíveis (5): Marcelo, Junior, Rodrigo, Sandra, Beatriz
❌ Indisponíveis (2): Rafael, Gustavo

ANÁLISE:
✅ Estrelas FC: 75% disponível (6/8) - ✅ SUFICIENTE
✅ Relâmpago FC: 71% disponível (5/7) - ✅ SUFICIENTE
✅ Total: 73% dos jogadores disponíveis

RECOMENDAÇÃO: ✅ AGENDAR
Este horário atende ao critério mínimo (50%) e tem boa participação.

[ CONFIRMAR AGENDAMENTO ]  [ VER OUTRAS OPÇÕES ]
```

---

**Documento criado em:** 2025-10-31
**Versão:** 1.0
