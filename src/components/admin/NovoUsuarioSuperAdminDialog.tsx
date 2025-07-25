
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Empresa {
  id: string;
  nome: string;
}

interface NovoUsuarioSuperAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUsuarioCreated: () => void;
  empresas: Empresa[];
}

const setoresDisponiveis = ['Vendas', 'Suporte', 'Marketing', 'Financeiro', 'RH', 'Administração', 'TI'];

const permissoesDisponiveis = [
  { id: 'dashboard', label: 'Visualizar Dashboard' },
  { id: 'atendimento', label: 'Acesso ao Atendimento' },
  { id: 'contatos', label: 'Gerenciar Contatos' },
  { id: 'usuarios', label: 'Gerenciar Usuários' },
  { id: 'setores', label: 'Gerenciar Setores' },
  { id: 'configuracoes', label: 'Configurações do Sistema' },
  { id: 'relatorios', label: 'Visualizar Relatórios' },
  { id: 'whatsapp', label: 'Gerenciar WhatsApp' },
  { id: 'chatbot', label: 'Gerenciar Chatbot' },
  { id: 'kanban', label: 'Acesso ao Kanban' },
  { id: 'chat_interno', label: 'Chat Interno' },
  { id: 'super_admin', label: 'Super Administrador' }
];

export default function NovoUsuarioSuperAdminDialog({ 
  open, 
  onOpenChange, 
  onUsuarioCreated, 
  empresas 
}: NovoUsuarioSuperAdminDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    empresa_id: '',
    cargo: 'usuario',
    setor: '',
    status: 'online',
    permissoes: [] as string[]
  });
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handlePermissaoChange = (permissaoId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissoes: checked 
        ? [...prev.permissoes, permissaoId]
        : prev.permissoes.filter(p => p !== permissaoId)
    }));
  };

  const getPermissoesPorCargo = (cargo: string): string[] => {
    switch (cargo) {
      case 'super_admin':
        return permissoesDisponiveis.map(p => p.id);
      case 'admin':
        return permissoesDisponiveis.filter(p => p.id !== 'super_admin').map(p => p.id);
      case 'supervisor':
        return ['dashboard', 'atendimento', 'contatos', 'usuarios', 'relatorios', 'kanban', 'chat_interno'];
      case 'agente':
        return ['dashboard', 'atendimento', 'contatos', 'kanban', 'chat_interno'];
      case 'usuario':
      default:
        return ['dashboard', 'atendimento', 'chat_interno'];
    }
  };

  const handleCargoChange = (cargo: string) => {
    const permissoesPadrao = getPermissoesPorCargo(cargo);
    setFormData(prev => ({
      ...prev,
      cargo,
      permissoes: permissoesPadrao
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Criando usuário com dados:', formData);

      // Criar usuário no Supabase Auth primeiro
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
        options: {
          data: {
            nome: formData.nome,
            empresa_id: formData.empresa_id,
            cargo: formData.cargo,
            setor: formData.setor,
            status: formData.status,
            permissoes: formData.permissoes
          }
        }
      });

      if (authError) {
        console.error('Erro ao criar usuário no Auth:', authError);
        if (authError.message.includes('already registered') || authError.message.includes('User already registered')) {
          throw new Error('Este email já está cadastrado no sistema.');
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Falha ao criar usuário no sistema de autenticação.');
      }

      console.log('Usuário criado no Auth:', authData.user.id);

      // Criar o perfil do usuário
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          nome: formData.nome,
          email: formData.email,
          empresa_id: formData.empresa_id,
          cargo: formData.cargo,
          setor: formData.setor,
          status: formData.status,
          permissoes: formData.permissoes
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar perfil:', error);
        // Se falhou ao criar o perfil, informar que o usuário foi criado parcialmente
        throw new Error('Usuário criado no sistema de autenticação, mas houve erro ao criar o perfil. Entre em contato com o administrador.');
      }

      console.log('Usuário e perfil criados com sucesso:', data);

      toast({
        title: "Sucesso",
        description: `Usuário criado com sucesso. Senha: ${formData.senha}`,
      });

      setFormData({
        nome: '',
        email: '',
        senha: '',
        empresa_id: '',
        cargo: 'usuario',
        setor: '',
        status: 'online',
        permissoes: ['dashboard', 'atendimento', 'chat_interno']
      });
      onUsuarioCreated();
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar usuário",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="senha">Senha de Acesso *</Label>
            <div className="relative">
              <Input
                id="senha"
                type={showPassword ? "text" : "password"}
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                required
                className="pr-10"
                placeholder="Digite a senha do usuário"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="empresa">Empresa *</Label>
              <Select
                value={formData.empresa_id}
                onValueChange={(value) => setFormData({ ...formData, empresa_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma empresa" />
                </SelectTrigger>
                <SelectContent>
                  {empresas.map((empresa) => (
                    <SelectItem key={empresa.id} value={empresa.id}>
                      {empresa.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cargo">Cargo *</Label>
              <Select
                value={formData.cargo}
                onValueChange={handleCargoChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usuario">Usuário</SelectItem>
                  <SelectItem value="agente">Agente</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="setor">Setor</Label>
              <Select
                value={formData.setor}
                onValueChange={(value) => setFormData({ ...formData, setor: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um setor" />
                </SelectTrigger>
                <SelectContent>
                  {setoresDisponiveis.map(setor => (
                    <SelectItem key={setor} value={setor}>{setor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="ausente">Ausente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">Permissões de Acesso</Label>
            <p className="text-sm text-gray-600 mb-3">
              Selecione as permissões que este usuário terá no sistema
            </p>
            <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto border rounded p-3">
              {permissoesDisponiveis.map((permissao) => (
                <div key={permissao.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={permissao.id}
                    checked={formData.permissoes.includes(permissao.id)}
                    onCheckedChange={(checked) => handlePermissaoChange(permissao.id, !!checked)}
                  />
                  <Label htmlFor={permissao.id} className="text-sm font-normal">
                    {permissao.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !formData.empresa_id || !formData.senha}>
              {loading ? 'Criando...' : 'Criar Usuário'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
