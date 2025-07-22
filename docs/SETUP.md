# Guia de Configuração - Amplie Chat

## 1. Configuração Inicial

### Variáveis de Ambiente
```bash
# Copie o template
cp .env.example .env

# Edite com suas credenciais
# VITE_SUPABASE_URL=sua_url_do_supabase
# VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

### Primeiro Acesso
1. Acesse `/auth` para fazer login
2. Use o email: `ampliemarketing.mkt@gmail.com`
3. Após login, você terá acesso como Super Admin

## 2. Configuração WhatsApp

### Z-API
1. Crie conta na [Z-API](https://z-api.io)
2. Obtenha Instance ID e Token
3. Acesse "Configurações" → "WhatsApp"
4. Configure suas credenciais
5. Sincronize as conexões

### Webhook
Configure o webhook na Z-API:
```
https://seu-dominio.com/api/webhook/whatsapp
```

## 3. Configuração de Setores

1. Acesse "Setores"
2. Crie setores para sua empresa
3. Configure capacidade máxima de cada setor
4. Associe usuários aos setores

## 4. Configuração de Chatbots

1. Acesse "ChatBot"
2. Crie um novo fluxo
3. Use o editor visual para criar o fluxo
4. Configure condições de ativação
5. Teste o fluxo antes de ativar

## 5. Gestão de Usuários

### Cargos Disponíveis:
- **super_admin**: Acesso total
- **admin**: Gestão da empresa
- **supervisor**: Gestão de setores  
- **agente**: Atendimento

### Criando Usuários:
1. Acesse "Usuários"
2. Clique em "Novo Usuário"
3. Defina cargo e setor
4. Configure permissões

## 6. Monitoramento

### Métricas Disponíveis:
- Atendimentos ativos por setor
- Performance dos agentes
- Logs de sistema
- Relatórios de chatbot

### Logs:
- Acesse logs via painel admin
- Monitore erros em tempo real
- Configure alertas (opcional)

## 7. Backup e Segurança

### Backup Automático:
- Dados salvos no Supabase
- Backup automático diário
- Retenção de 30 dias

### Segurança:
- RLS habilitado em todas as tabelas
- Logs de auditoria
- Autenticação obrigatória
- Validação de dados

## 8. Troubleshooting

### Problemas Comuns:

**WhatsApp não conecta:**
- Verifique credenciais Z-API
- Confirme webhook configurado
- Teste status da instância

**Usuários não conseguem acessar:**
- Verifique permissões RLS
- Confirme cargo do usuário
- Verifique empresa associada

**Chatbot não responde:**
- Verifique se está ativo
- Teste condições de ativação
- Verifique logs de erro

### Logs Úteis:
```bash
# Logs de autenticação
SELECT * FROM auth.users WHERE email = 'usuario@exemplo.com';

# Logs de chatbot
SELECT * FROM chatbot_logs ORDER BY created_at DESC LIMIT 10;

# Status das conexões
SELECT * FROM whatsapp_connections WHERE ativo = true;
```