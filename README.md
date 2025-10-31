# Sistema de Agendamento de Jogos Esportivos

Sistema inteligente para gerenciar torneios esportivos com agendamento automático de jogos, considerando disponibilidade de quadras, horários e jogadores.

---

## 📚 Documentação do Projeto

Este projeto possui documentação completa dividida em 4 documentos principais:

### 1. [PLANEJAMENTO_SISTEMA.md](./PLANEJAMENTO_SISTEMA.md)
**Visão geral completa do sistema**

- Entidades e modelos de dados
- Funcionalidades principais
- Sistema de chaveamento (grupos, eliminatórias, misto)
- Gestão de conflitos
- Fluxo de funcionamento
- Stack tecnológico sugerido
- Arquitetura do sistema
- Casos de uso detalhados
- Priorização MVP

**📖 Leia este documento primeiro para entender o sistema como um todo**

---

### 2. [ALGORITMO_AGENDAMENTO_DETALHADO.md](./ALGORITMO_AGENDAMENTO_DETALHADO.md)
**Detalhamento técnico do algoritmo de agendamento**

- Estruturas de dados
- Algoritmo principal (Greedy + Backtracking)
- Cálculo de viabilidade de slots
- Detecção de conflitos
- Geração de sugestões
- Otimizações de performance
- Análise de complexidade
- Casos de teste

**🔧 Leia este documento para entender como funciona o coração do sistema**

---

### 3. [EXEMPLOS_PRATICOS.md](./EXEMPLOS_PRATICOS.md)
**Exemplos reais de uso do sistema**

- Torneio completo de tênis (passo a passo)
- APIs e requests/responses
- Visualização de agendas
- Resolução de conflitos na prática
- Notificações aos jogadores
- Dashboard de estatísticas
- Diferentes modalidades (tênis, futebol)
- Exportação de dados

**💡 Leia este documento para visualizar o sistema em ação**

---

### 4. [ROADMAP_IMPLEMENTACAO.md](./ROADMAP_IMPLEMENTACAO.md)
**Plano de execução e desenvolvimento**

- Timeline de desenvolvimento (10-14 semanas)
- Fases detalhadas (Setup, MVP, Agendamento, Chaveamento, UX, Deploy)
- Schema completo do banco de dados (Prisma)
- Estimativas de esforço por módulo
- Configurações de time (solo, dupla, time completo)
- Stack tecnológico definitivo
- Riscos e mitigações
- Priorização MoSCoW

**🗺️ Leia este documento para planejar a execução do projeto**

---

## 🎯 Resumo Executivo

### O Problema
Organizar torneios esportivos é complexo:
- Muitos jogos para agendar
- Quadras/campos limitados
- Jogadores com disponibilidades diferentes
- Conflitos de horários
- Múltiplos formatos de chaveamento

### A Solução
Sistema automatizado que:
- **Agenda automaticamente** todos os jogos otimizando uso de quadras
- **Respeita disponibilidades** de todos os jogadores
- **Detecta conflitos** e sugere soluções
- **Suporta múltiplos formatos**: grupos, eliminatórias, misto
- **Notifica jogadores** sobre seus jogos
- **Exporta agendas** em múltiplos formatos

### Principais Funcionalidades

#### ✅ Fase 1 - MVP
- CRUD de torneios, quadras, equipes e jogadores
- Cadastro de disponibilidade de jogadores
- Agendamento automático básico
- Detecção de conflitos
- Visualização de agenda em calendário
- Agendamento manual (drag & drop)

#### ⭐ Fase 2 - Agendamento Inteligente
- Algoritmo otimizado de agendamento
- Score de viabilidade de slots
- Resolução automática de conflitos
- Sugestões inteligentes para conflitos
- Dashboard de estatísticas

#### 🏆 Fase 3 - Chaveamentos Avançados
- Fase de grupos (round-robin)
- Eliminatórias (bracket)
- Torneio misto (grupos + eliminatórias)
- Sistema de seeds/classificação
- Atualização automática de brackets

#### 🎨 Fase 4 - UX & Extras
- Notificações por email/SMS
- Exportação (PDF, iCal, Excel)
- Responsividade mobile
- Múltiplos idiomas
- Templates de torneios

---

## 🏗️ Arquitetura

```
Frontend (React + TypeScript)
        ↕️
Backend API (NestJS + TypeScript)
        ↕️
Database (PostgreSQL + Prisma)
```

### Tecnologias Principais

**Backend:**
- Node.js 20+ + TypeScript
- NestJS (framework)
- Prisma (ORM)
- PostgreSQL (banco de dados)
- Jest (testes)

**Frontend:**
- React 18+ + TypeScript
- Material-UI (componentes)
- Redux Toolkit (estado)
- FullCalendar (visualização)
- Vite (bundler)

**DevOps:**
- Docker + Docker Compose
- GitHub Actions (CI/CD)
- Railway/Vercel (hosting)

---

## 📊 Estimativas

### Tempo de Desenvolvimento
- **Solo (1 Full Stack):** 3-4 meses
- **Dupla (Backend + Frontend):** 2 meses
- **Time (5 pessoas):** 1 mês

### Fases
1. **Setup & MVP:** 3-4 semanas
2. **Agendamento Automático:** 2-3 semanas
3. **Chaveamento Avançado:** 2 semanas
4. **UX & Otimizações:** 2-3 semanas
5. **Testes & Deploy:** 1-2 semanas

**Total:** 10-14 semanas

---

## 🚀 Como Começar

### 1. Ler Documentação
```bash
# Leia nesta ordem:
1. PLANEJAMENTO_SISTEMA.md      # Entender o sistema
2. ALGORITMO_AGENDAMENTO_DETALHADO.md  # Entender a lógica
3. EXEMPLOS_PRATICOS.md          # Ver exemplos
4. ROADMAP_IMPLEMENTACAO.md      # Planejar execução
```

### 2. Validar Escopo
- Revisar funcionalidades propostas
- Definir o que entra na v1
- Ajustar timeline conforme necessário

### 3. Montar Time
- Definir desenvolvedores
- Escolher configuração (solo/dupla/time)
- Estimar orçamento

### 4. Iniciar Desenvolvimento
- Seguir Fase 1 do roadmap
- Setup de ambiente
- Começar pelo MVP

---

## 📋 Estrutura de Pastas (Futura)

```
Marcelo/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── tournaments/
│   │   │   ├── matches/
│   │   │   ├── teams/
│   │   │   ├── players/
│   │   │   ├── courts/
│   │   │   ├── scheduling/      # 🎯 Algoritmo principal
│   │   │   └── availability/
│   │   └── main.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── services/
│   └── package.json
│
├── docs/                        # 📚 Você está aqui
│   ├── README.md
│   ├── PLANEJAMENTO_SISTEMA.md
│   ├── ALGORITMO_AGENDAMENTO_DETALHADO.md
│   ├── EXEMPLOS_PRATICOS.md
│   └── ROADMAP_IMPLEMENTACAO.md
│
└── docker-compose.yml
```

---

## 🎯 Casos de Uso Principais

### Para Organizadores
1. Criar torneio em minutos
2. Cadastrar quadras e horários
3. Adicionar equipes/jogadores
4. Gerar agenda automaticamente
5. Resolver conflitos facilmente
6. Publicar e notificar participantes

### Para Jogadores
1. Informar disponibilidade
2. Receber agenda por email
3. Ver jogos em calendário online
4. Exportar para Google Calendar
5. Receber lembretes

---

## 💡 Diferenciais do Sistema

✅ **Agendamento 100% Automático** - Não precisa fazer manualmente

✅ **Inteligente** - Aprende com as restrições e otimiza

✅ **Flexível** - Suporta vários esportes e formatos

✅ **Fácil de Usar** - Interface intuitiva

✅ **Resolve Conflitos** - Detecta e sugere soluções

✅ **Notificações** - Todos ficam informados

✅ **Multi-formato** - PDF, Excel, iCal

---

## 📞 Próximos Passos

### Decisões Necessárias

1. **Validar Escopo**
   - Revisar funcionalidades
   - Aprovar MVP
   - Definir nice-to-have

2. **Escolher Stack**
   - Confirmar tecnologias
   - Avaliar alternativas se necessário

3. **Montar Time**
   - Definir recursos disponíveis
   - Escolher configuração de desenvolvimento

4. **Iniciar Projeto**
   - Setup de repositórios
   - Configurar ambientes
   - Começar desenvolvimento

---

## 📖 Glossário

- **Slot:** Espaço de tempo em uma quadra
- **Conflito:** Situação onde não é possível agendar um jogo
- **Hard Constraint:** Restrição obrigatória (ex: jogador disponível)
- **Soft Constraint:** Restrição preferencial (ex: intervalo entre jogos)
- **Seed:** Classificação inicial de uma equipe
- **Bracket:** Chave de eliminatórias
- **Round-robin:** Todos jogam contra todos

---

## 📄 Licença

Este é um projeto de planejamento. A licença será definida na implementação.

---

## 👥 Contribuindo

Atualmente em fase de planejamento. Implementação seguirá o roadmap definido.

---

**Status atual:** 📋 Planejamento completo finalizado

**Próximo passo:** ✅ Validar com stakeholders e iniciar desenvolvimento

**Criado em:** 2025-10-31

---

## 🗂️ Navegação Rápida

| Documento | Descrição | Quando Ler |
|-----------|-----------|------------|
| [PLANEJAMENTO_SISTEMA.md](./PLANEJAMENTO_SISTEMA.md) | Visão geral e arquitetura | Primeiro |
| [ALGORITMO_AGENDAMENTO_DETALHADO.md](./ALGORITMO_AGENDAMENTO_DETALHADO.md) | Algoritmos técnicos | Desenvolvimento |
| [EXEMPLOS_PRATICOS.md](./EXEMPLOS_PRATICOS.md) | Casos de uso reais | Para entender UX |
| [ROADMAP_IMPLEMENTACAO.md](./ROADMAP_IMPLEMENTACAO.md) | Plano de execução | Antes de começar |

---

**Dúvidas?** Revise os documentos ou entre em contato com a equipe de desenvolvimento.
