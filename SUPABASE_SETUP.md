# 🔧 Guia de Configuração do Supabase

Este documento explica como configurar o backend Supabase para o Sistema de Agendamento de Jogos.

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com) (gratuita)
- Acesso ao arquivo `demo.html`

## 🚀 Passo a Passo

### 1. Criar Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em **"Start your project"** ou **"New Project"**
3. Escolha um nome para seu projeto (ex: `sports-schedule`)
4. Defina uma senha forte para o banco de dados
5. Escolha a região mais próxima (ex: South America - São Paulo)
6. Clique em **"Create new project"**
7. Aguarde alguns minutos até o projeto estar pronto

### 2. Obter Credenciais do Projeto

1. No painel do Supabase, vá em **Settings** (⚙️) > **API**
2. Você verá duas informações importantes:
   - **Project URL**: algo como `https://seu-projeto.supabase.co`
   - **anon public**: uma chave longa começando com `eyJ...`

### 3. Configurar o demo.html

1. Abra o arquivo `demo.html`
2. Localize as linhas (cerca da linha 2129):

```javascript
const SUPABASE_URL = 'https://seu-projeto.supabase.co';
const SUPABASE_ANON_KEY = 'sua-chave-anonima-aqui';
```

3. Substitua pelos valores copiados do Supabase:

```javascript
const SUPABASE_URL = 'https://seu-projeto-real.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Sua chave completa
```

### 4. Criar Tabelas no Banco de Dados

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em **"New query"**
3. Cole o seguinte SQL:

```sql
-- Tabela de perfis de usuários
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  organization TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tabela de torneios
CREATE TABLE tournaments (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  sport TEXT,
  categories JSONB DEFAULT '[]',
  format TEXT,
  start_date DATE,
  end_date DATE,
  duration INTEGER,
  break_time INTEGER,
  location TEXT,
  notes TEXT,
  status TEXT DEFAULT 'Rascunho',
  players JSONB DEFAULT '[]',
  courts JSONB DEFAULT '[]',
  matches JSONB DEFAULT '[]',
  groups JSONB DEFAULT '[]',
  standings JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para profiles
CREATE POLICY "Usuários podem ver apenas seu próprio perfil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar apenas seu próprio perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Políticas de segurança para tournaments
CREATE POLICY "Usuários podem ver apenas seus próprios torneios"
  ON tournaments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar torneios"
  ON tournaments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar apenas seus próprios torneios"
  ON tournaments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar apenas seus próprios torneios"
  ON tournaments FOR DELETE
  USING (auth.uid() = user_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON tournaments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

4. Clique em **"Run"** ou pressione **Ctrl+Enter**
5. Você deve ver a mensagem "Success. No rows returned"

### 5. Configurar Email de Autenticação (Opcional)

Por padrão, o Supabase envia emails de confirmação. Para desenvolvimento:

1. Vá em **Authentication** > **Providers** > **Email**
2. Desabilite **"Confirm email"** temporariamente
3. Isso permite criar contas sem verificação de email

### 6. Testar a Aplicação

1. Abra o arquivo `demo.html` no navegador
2. Você deve ver no console do navegador (F12):
   - `✅ Supabase conectado com sucesso!`
3. Crie uma nova conta
4. Faça login
5. Crie um torneio
6. Verifique no Supabase (Table Editor) se os dados foram salvos

## 🔄 Migração de Dados Existentes

Se você já tem dados salvos no localStorage:

### Opção 1: Manual (Recomendado para poucos dados)
- Crie novamente os torneios pelo sistema após conectar ao Supabase

### Opção 2: Exportar/Importar
1. Antes de configurar o Supabase, abra o console do navegador (F12)
2. Execute:
```javascript
// Exportar dados do localStorage
const users = JSON.parse(localStorage.getItem('users') || '[]');
const userId = localStorage.getItem('currentUserId');
const tournaments = JSON.parse(localStorage.getItem(`tournaments_${userId}`) || '[]');

console.log('Users:', JSON.stringify(users));
console.log('Tournaments:', JSON.stringify(tournaments));
```
3. Copie os dados
4. Após configurar o Supabase, insira manualmente via SQL Editor ou interface

## ✅ Verificações

### Console do Navegador deve mostrar:
- ✅ `Supabase conectado com sucesso!` (quando credenciais configuradas)
- ⚠️ `Supabase não configurado. Usando localStorage como fallback.` (quando não configurado)

### No Supabase você deve ver:
- Tabelas `profiles` e `tournaments` criadas
- Políticas de RLS ativas
- Dados sendo salvos após criar torneios

## 🔒 Segurança

As políticas de RLS (Row Level Security) garantem que:
- ✅ Cada usuário só vê seus próprios dados
- ✅ Ninguém pode acessar torneios de outros usuários
- ✅ A autenticação é gerenciada pelo Supabase Auth

## 🆘 Troubleshooting

### Erro: "Invalid API key"
- Verifique se copiou a chave `anon public` completa
- Certifique-se de não ter espaços extras

### Erro: "relation profiles does not exist"
- Execute o SQL de criação de tabelas
- Verifique se o projeto está completamente iniciado

### Dados não aparecem após login
- Abra o console (F12) e veja se há erros
- Verifique no Table Editor do Supabase se as tabelas existem
- Confirme que as políticas de RLS foram criadas

### Console mostra "Usando localStorage como fallback"
- Verifique se as credenciais foram inseridas corretamente
- Confirme que não há erros de digitação na URL ou chave

## 📊 Vantagens do Supabase

✅ **Dados persistentes** - Não se perdem ao limpar navegador
✅ **Acesso multi-dispositivo** - Mesmos dados em qualquer lugar
✅ **Backup automático** - Supabase faz backup regular
✅ **Segurança** - Autenticação e RLS protegem seus dados
✅ **Escalabilidade** - Suporta milhares de torneios
✅ **Gratuito** - Plano free generoso (500MB banco, 50MB storage)

## 🔄 Modo Fallback

O sistema funciona em dois modos:

1. **Com Supabase** (quando configurado):
   - Dados salvos no banco PostgreSQL
   - Sincronização em tempo real
   - Acesso de qualquer dispositivo

2. **Sem Supabase** (fallback automático):
   - Dados salvos no localStorage
   - Funciona offline
   - Dados locais ao navegador

**Nota**: O sistema detecta automaticamente se o Supabase está configurado e usa o modo apropriado!

## 📞 Suporte

Para mais informações:
- [Documentação do Supabase](https://supabase.com/docs)
- [Guia de JavaScript](https://supabase.com/docs/reference/javascript/introduction)
- [Community Discord](https://discord.supabase.com)

---

**Desenvolvido com ❤️ para organização de torneios esportivos**
