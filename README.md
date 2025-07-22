# Amplie Chat - Sistema de Atendimento WhatsApp

Sistema completo de atendimento ao cliente via WhatsApp com chatbots inteligentes, automação de fluxos e gestão de equipes.

## 🚀 Funcionalidades

### Atendimento
- **Chat WhatsApp Integrado** - Atendimento direto via Z-API
- **Kanban de Atendimentos** - Gestão visual dos tickets
- **Transferência de Conversas** - Entre setores e agentes
- **Chat Interno** - Comunicação entre a equipe

### Chatbots e Automação
- **Flow Builder Visual** - Criação de fluxos sem código
- **Chatbots Inteligentes** - Atendimento automatizado
- **Triggers de Automação** - Ações baseadas em condições
- **Integração N8N** - Workflows avançados

### Gestão
- **Multi-empresas** - Suporte a várias organizações
- **Gestão de Usuários** - Controle de permissões e cargos
- **Setores Customizáveis** - Organização por departamentos
- **Planos e Limites** - Sistema de cobrança

### Administração
- **Painel Super Admin** - Controle total do sistema
- **Logs e Auditoria** - Rastreamento de ações
- **Monitoramento** - Métricas em tempo real
- **Configurações Avançadas** - Personalização completa

## 🛠️ Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Autenticação**: Supabase Auth
- **Real-time**: Supabase Realtime
- **WhatsApp**: Z-API
- **Automação**: N8N (opcional)

## 🚀 Como executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase
- Instância Z-API (para WhatsApp)

### Instalação

1. **Clone o repositório**
```bash
git clone <seu-repo-url>
cd amplie-chat
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:
- Supabase: URL e chave anônima do seu projeto
- Z-API: Instance ID e token (opcional para desenvolvimento)

4. **Execute o projeto**
```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:8080`

### Configuração do Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute as migrações SQL da pasta `supabase/migrations/`
3. Configure as políticas RLS conforme necessário
4. Adicione os segredos necessários no painel do Supabase

## 🧪 Testes

Execute os testes unitários:
```bash
npm run test
```

Execute testes com cobertura:
```bash
npm run test:coverage
```

Execute testes no modo watch:
```bash
npm run test:watch
```

## 📦 Build e Deploy

### Build local
```bash
npm run build
```

### Deploy via Lovable
1. Acesse o [projeto no Lovable](https://lovable.dev/projects/bc193d2a-e461-4e9e-996e-a26c0aa921e7)
2. Clique em "Share" → "Publish"
3. Configure domínio customizado se necessário

## 🔧 Configurações

### WhatsApp (Z-API)
1. Crie uma conta na [Z-API](https://z-api.io)
2. Obtenha o Instance ID e Token
3. Configure o webhook para receber mensagens
4. Adicione as credenciais no painel de configurações

### Chatbots
1. Acesse "ChatBot" no menu principal
2. Crie um novo fluxo usando o editor visual
3. Configure gatilhos e condições
4. Ative o chatbot para começar a funcionar

### Usuários e Permissões
- **Super Admin**: Acesso total ao sistema
- **Admin**: Gestão da empresa
- **Supervisor**: Gestão de setores
- **Agente**: Atendimento

## 📊 Estrutura do Banco

### Principais tabelas:
- `profiles` - Usuários do sistema
- `empresas` - Organizações
- `conversas` - Atendimentos
- `mensagens` - Histórico de mensagens
- `chatbot_flows` - Fluxos de chatbot
- `automation_triggers` - Automações
- `setores` - Departamentos

## 🔒 Segurança

- Autenticação obrigatória para todas as funcionalidades
- RLS (Row Level Security) configurado em todas as tabelas
- Logs de auditoria para ações críticas
- Sanitização de dados de entrada
- Rate limiting nas APIs

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte e dúvidas:
- Email: suporte@ampliemarketing.com
- WhatsApp: +55 (11) 99999-9999
- Documentação: [Wiki do projeto](link-para-wiki)
