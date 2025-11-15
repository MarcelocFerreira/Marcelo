# 📺 Sistema de Criação e Divulgação de IPTV Online

Sistema completo e profissional para criar, gerenciar e divulgar sua lista de canais IPTV.

---

## 🚀 Início Rápido

### Como Usar:

1. **Baixe o arquivo**
   - Faça o download de `iptv-system.html`
   - Ou clone este repositório

2. **Abra no navegador**
   - Dê um duplo clique no arquivo `iptv-system.html`
   - Ou arraste o arquivo para o navegador
   - Funciona em Chrome, Firefox, Safari, Edge

3. **Comece a usar!**
   - Não precisa instalar nada
   - Não precisa de servidor
   - Funciona 100% offline

---

## ✨ Funcionalidades Completas

### 📊 Dashboard
- Estatísticas em tempo real
- Total de canais cadastrados
- Número de categorias
- Canais ativos
- Últimos canais adicionados

### ➕ Adicionar Canais
- **Nome do Canal:** Ex: Globo HD, SBT, Record
- **URL do Stream:** Link M3U8 ou HLS do canal
- **Categoria:** Filmes, Séries, Esportes, etc.
- **Logo:** URL da imagem do canal
- **Descrição:** Informações adicionais
- **Qualidade:** SD, HD, Full HD ou 4K
- **Status:** Ativo/Inativo

### 📺 Gerenciar Canais
- Visualizar todos os canais cadastrados
- Buscar canais por nome
- Filtrar por categoria
- Editar informações
- Excluir canais
- Ativar/desativar canais

### 🏷️ Categorias
Categorias pré-configuradas:
- 🎬 Filmes
- 📺 Séries
- ⚽ Esportes
- 📰 Notícias
- 🎓 Documentários
- 👶 Infantil
- 🎵 Música
- 🎭 Variedades
- 📡 Abertos
- ⛪ Religiosos

**Adicione suas próprias categorias!**

### ▶️ Player Integrado
- Reproduzir canais diretamente no navegador
- Player HTML5 nativo
- Controles completos (play, pause, volume, fullscreen)
- Lista de canais disponíveis
- Clique e assista instantaneamente

### 📤 Exportar e Divulgar

#### Exportação M3U
- Baixe sua lista completa em formato M3U
- Compatível com qualquer player IPTV
- Visualize o código gerado

#### Compartilhamento
- 📱 WhatsApp
- ✈️ Telegram
- 📧 Email
- 📋 Copiar código

#### Estatísticas
- Canais por categoria
- Total de canais ativos
- Gráficos visuais

---

## 📖 Como Usar - Passo a Passo

### 1️⃣ Adicionar Primeiro Canal

```
1. Clique em "➕ Adicionar Canal"
2. Preencha os dados:
   - Nome: "Globo HD"
   - URL: "http://seu-servidor.com/globo.m3u8"
   - Categoria: "Abertos"
   - Logo: "http://exemplo.com/logo-globo.png" (opcional)
   - Qualidade: "HD"
3. Clique em "💾 Salvar Canal"
```

### 2️⃣ Organizar por Categorias

```
1. Clique em "🏷️ Categorias"
2. Adicione categorias personalizadas
3. Gerencie as existentes
4. Exclua as que não usa
```

### 3️⃣ Assistir Canais

```
1. Clique em "▶️ Player"
2. Escolha um canal da lista
3. Clique para reproduzir
4. Aproveite!
```

### 4️⃣ Exportar Lista M3U

```
1. Clique em "📤 Exportar/Divulgar"
2. Clique em "📥 Baixar arquivo M3U"
3. Salve o arquivo
4. Use em qualquer player IPTV
```

---

## 🎯 Casos de Uso

### Para Provedores de IPTV
- Crie listas profissionais para seus clientes
- Organize canais por categoria
- Exporte e distribua facilmente
- Demonstre a qualidade do serviço

### Para Usuários Finais
- Organize seus canais favoritos
- Teste canais antes de adicionar
- Crie listas personalizadas
- Compartilhe com amigos e família

### Para Desenvolvedores
- Base para criar seu próprio sistema
- Código limpo e documentado
- Fácil de personalizar
- Sem dependências externas

---

## 💡 Dicas e Truques

### Onde Encontrar URLs de Canais?
- Canais públicos disponíveis na internet
- Provedores de IPTV
- Streams de teste
- **Importante:** Use apenas canais que você tem direito de acessar

### Como Adicionar Logo dos Canais?
```
1. Encontre a imagem do canal (Google Imagens)
2. Copie o link da imagem
3. Cole no campo "Logo do Canal"
4. A prévia aparecerá automaticamente
```

### Como Testar se o Canal Funciona?
```
1. Adicione o canal
2. Vá em "▶️ Player"
3. Clique no canal
4. Se reproduzir, está funcionando!
```

### Como Importar no VLC Player?
```
1. Exporte o arquivo M3U
2. Abra o VLC Player
3. Mídia > Abrir Arquivo
4. Selecione o arquivo M3U baixado
```

### Como Usar no Smartphone?
```
1. Baixe um app de IPTV (GSE SMART IPTV, IPTV Smarters, etc)
2. Exporte seu M3U
3. Transfira para o celular
4. Importe no app
```

---

## 🔧 Personalização

### Mudar Cores do Sistema
No arquivo `iptv-system.html`, procure por:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Adicionar Mais Campos
Edite a função `addChannel()` e adicione novos campos no formulário.

### Integrar com Backend
O sistema usa localStorage. Para usar banco de dados:
1. Crie uma API REST
2. Substitua `localStorage` por chamadas fetch()
3. Implemente autenticação

---

## 📱 Compatibilidade

### Navegadores
- ✅ Chrome/Edge (Recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ✅ Brave

### Dispositivos
- ✅ Desktop (Windows, Mac, Linux)
- ✅ Tablet
- ✅ Smartphone
- ✅ Smart TV (com navegador)

### Formatos de Stream Suportados
- ✅ M3U8 (HLS)
- ✅ MP4
- ✅ WebM
- ⚠️ RTMP (requer plugin)

---

## 🛡️ Segurança e Privacidade

- **Dados locais:** Tudo salvo no seu navegador
- **Sem rastreamento:** Nenhum dado enviado para servidores
- **Sem login:** Não requer cadastro
- **Código aberto:** Você pode auditar todo o código

---

## 🐛 Solução de Problemas

### Canal não reproduz?
- Verifique se a URL está correta
- Teste a URL em outro player (VLC)
- Verifique sua conexão de internet
- Alguns canais podem estar offline

### Dados foram perdidos?
- Dados salvos no localStorage do navegador
- Não limpe o cache do navegador
- Não use modo anônimo/privado
- Faça backup exportando o M3U

### Player não aparece?
- Atualize a página (F5)
- Limpe o cache do navegador
- Teste em outro navegador

---

## 📊 Formato M3U Gerado

Exemplo do arquivo exportado:

```m3u
#EXTM3U

#EXTINF:-1 tvg-logo="http://exemplo.com/logo-globo.png" group-title="Abertos",Globo HD
http://servidor.com/globo.m3u8

#EXTINF:-1 tvg-logo="http://exemplo.com/logo-sbt.png" group-title="Abertos",SBT HD
http://servidor.com/sbt.m3u8

#EXTINF:-1 tvg-logo="http://exemplo.com/logo-espn.png" group-title="Esportes",ESPN HD
http://servidor.com/espn.m3u8
```

---

## 🎓 Recursos Adicionais

### Players IPTV Recomendados
- **Desktop:** VLC Media Player
- **Android:** GSE SMART IPTV, IPTV Smarters
- **iOS:** GSE SMART IPTV
- **Smart TV:** Smart IPTV, SS IPTV

### Links Úteis
- [Especificação M3U](https://en.wikipedia.org/wiki/M3U)
- [HLS Streaming](https://developer.apple.com/streaming/)
- [VLC Media Player](https://www.videolan.org/)

---

## 📝 Licença

Este é um projeto de código aberto. Use livremente para fins pessoais ou comerciais.

**Importante:** Respeite os direitos autorais dos conteúdos transmitidos.

---

## 🤝 Contribuindo

Sugestões e melhorias são bem-vindas!

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Revise este README
2. Verifique o código no arquivo HTML
3. Teste em diferentes navegadores

---

**Desenvolvido com ❤️ para facilitar a gestão de IPTV**

**Status:** ✅ Pronto para uso

**Última atualização:** 2025-11-15
