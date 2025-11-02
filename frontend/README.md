# Sports Tournament Scheduler - Frontend

Frontend em React + TypeScript para o Sistema de Agendamento de Jogos Esportivos.

## Stack Tecnológica

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Material-UI (MUI)** - Componentes e design system
- **Redux Toolkit** - Gerenciamento de estado
- **React Router** - Roteamento
- **date-fns** - Manipulação de datas
- **FullCalendar** - Visualização de calendário (preparado)

## Estrutura do Projeto

```
src/
├── components/         # Componentes reutilizáveis
│   └── Layout.tsx     # Layout principal com navegação
├── pages/             # Páginas da aplicação
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   ├── TournamentsPage.tsx
│   ├── TournamentDetailPage.tsx
│   ├── PlayersPage.tsx
│   ├── CategoriesPage.tsx
│   └── CourtsPage.tsx
├── store/             # Redux store e slices
│   ├── index.ts
│   ├── authSlice.ts
│   ├── tournamentSlice.ts
│   ├── playerSlice.ts
│   ├── courtSlice.ts
│   └── categorySlice.ts
├── services/          # Serviços e APIs
│   └── localStorage.service.ts
├── types/             # TypeScript types
│   └── index.ts
├── theme/             # Material-UI theme
│   └── theme.ts
├── hooks/             # Custom hooks
│   └── useRedux.ts
├── utils/             # Funções utilitárias
│   └── helpers.ts
├── App.tsx            # Componente principal
└── main.tsx           # Entry point
```

## Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## Funcionalidades Implementadas

### Autenticação
- ✅ Login de usuário
- ✅ Registro de novo usuário
- ✅ Proteção de rotas
- ✅ Logout

### Dashboard
- ✅ Estatísticas gerais (torneios, jogadores, quadras)
- ✅ Visão geral dos torneios ativos
- ✅ Lista de jogadores recentes

### Gerenciamento de Torneios
- ✅ Listagem de torneios
- ✅ Criação de novos torneios
- ✅ Visualização de detalhes
- ✅ Exclusão de torneios
- ✅ Suporte para diferentes formatos (Grupos, Eliminatórias, Misto)

### Gerenciamento de Jogadores
- ✅ Listagem de jogadores
- ✅ Cadastro de novos jogadores
- ✅ Exclusão de jogadores
- ✅ Associação com categorias

### Gerenciamento de Categorias
- ✅ Listagem de categorias
- ✅ Criação de categorias personalizadas
- ✅ Cores customizáveis
- ✅ Exclusão de categorias

### Gerenciamento de Quadras
- ✅ Listagem de quadras
- ✅ Cadastro de quadras
- ✅ Exclusão de quadras
- ✅ Status (ativa/inativa)

## Funcionalidades Futuras

- [ ] Disponibilidade de jogadores (horários)
- [ ] Disponibilidade de quadras (time slots)
- [ ] Geração automática de chaveamento
- [ ] Agendamento automático de jogos
- [ ] Visualização em calendário (FullCalendar)
- [ ] Detecção e resolução de conflitos
- [ ] Sistema de notificações
- [ ] Exportação de agenda (ICS, CSV, PDF)
- [ ] Integração com backend API
- [ ] Modo escuro
- [ ] PWA (Progressive Web App)

## Persistência de Dados

Atualmente, a aplicação usa **localStorage** para persistir dados localmente. Quando o backend estiver implementado, o `localStorage.service.ts` pode ser facilmente substituído por chamadas de API.

## Categorias Padrão

O sistema vem com 4 categorias pré-cadastradas:
- **Infantil** (Verde)
- **Juvenil** (Azul)
- **Adulto** (Laranja)
- **Master** (Roxo)

## URLs da Aplicação

- **Login**: `/login`
- **Registro**: `/register`
- **Dashboard**: `/dashboard`
- **Torneios**: `/tournaments`
- **Detalhes do Torneio**: `/tournaments/:id`
- **Jogadores**: `/players`
- **Categorias**: `/categories`
- **Quadras**: `/courts`

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (se necessário):

```env
VITE_API_URL=http://localhost:3000/api
```

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter

## Temas e Estilização

O projeto usa Material-UI com tema customizado. As configurações estão em `src/theme/theme.ts`.

### Cores Principais
- **Primary**: `#1976d2` (Azul)
- **Secondary**: `#dc004e` (Rosa)
- **Success**: `#4caf50` (Verde)
- **Warning**: `#ff9800` (Laranja)
- **Error**: `#f44336` (Vermelho)
- **Info**: `#2196f3` (Azul claro)

## Integração com Backend

Quando o backend estiver pronto, basta:

1. Criar um serviço `api.service.ts` com Axios
2. Atualizar os Redux slices para usar async thunks
3. Substituir chamadas ao `localStorage.service` por chamadas de API
4. Adicionar gerenciamento de loading states e error handling

Exemplo de estrutura:

```typescript
// services/api.service.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const tournamentAPI = {
  getAll: () => api.get('/tournaments'),
  getById: (id: string) => api.get(`/tournaments/${id}`),
  create: (data) => api.post('/tournaments', data),
  update: (id: string, data) => api.put(`/tournaments/${id}`, data),
  delete: (id: string) => api.delete(`/tournaments/${id}`),
};
```

## Contribuindo

1. Clone o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT.

---

**Desenvolvido com ❤️ usando React + TypeScript + Material-UI**
