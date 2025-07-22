import { useState } from 'react';
import { User, Mail, Phone, MapPin, Building, Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
export default function ConfiguracoesGerais() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [accountInfo, setAccountInfo] = useState({
    nome: 'João Silva',
    email: 'joao.silva@amplie.com',
    telefone: '+55 11 99999-9999',
    empresa: 'Amplie Tech',
    cargo: 'Administrador',
    endereco: 'São Paulo, SP'
  });
  const [accountSettings, setAccountSettings] = useState({
    twoFactorAuth: true,
    loginNotifications: true,
    sessionTimeout: false
  });
  const handleSave = () => {
    setIsEditing(false);
    console.log('Salvando configurações da conta:', accountInfo);
  };
  const handleInputChange = (field: string, value: string) => {
    setAccountInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSettingChange = (field: string, value: boolean) => {
    setAccountSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  return <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          
          
        </div>
        <Button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className="bg-amplie-primary hover:bg-amplie-primary-light">
          {isEditing ? 'Salvar' : 'Editar'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações da Conta */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-amplie-primary" />
            Informações da Conta
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome Completo</Label>
              <Input id="nome" value={accountInfo.nome} onChange={e => handleInputChange('nome', e.target.value)} disabled={!isEditing} className={!isEditing ? 'bg-gray-50' : ''} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={accountInfo.email} onChange={e => handleInputChange('email', e.target.value)} disabled={!isEditing} className={!isEditing ? 'bg-gray-50' : ''} />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" value={accountInfo.telefone} onChange={e => handleInputChange('telefone', e.target.value)} disabled={!isEditing} className={!isEditing ? 'bg-gray-50' : ''} />
            </div>
          </div>
        </Card>

        {/* Informações Profissionais */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Building className="w-5 h-5 mr-2 text-amplie-primary" />
            Informações Profissionais
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="empresa">Empresa</Label>
              <Input id="empresa" value={accountInfo.empresa} onChange={e => handleInputChange('empresa', e.target.value)} disabled={!isEditing} className={!isEditing ? 'bg-gray-50' : ''} />
            </div>
            <div>
              <Label htmlFor="cargo">Cargo</Label>
              <Input id="cargo" value={accountInfo.cargo} onChange={e => handleInputChange('cargo', e.target.value)} disabled={!isEditing} className={!isEditing ? 'bg-gray-50' : ''} />
            </div>
            <div>
              <Label htmlFor="endereco">Endereço</Label>
              <Input id="endereco" value={accountInfo.endereco} onChange={e => handleInputChange('endereco', e.target.value)} disabled={!isEditing} className={!isEditing ? 'bg-gray-50' : ''} />
            </div>
          </div>
        </Card>

        {/* Alteração de Senha */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-amplie-primary" />
            Alteração de Senha
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="senhaAtual">Senha Atual</Label>
              <div className="relative">
                <Input id="senhaAtual" type={showPassword ? 'text' : 'password'} placeholder="Digite sua senha atual" />
                <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="novaSenha">Nova Senha</Label>
              <Input id="novaSenha" type="password" placeholder="Digite sua nova senha" />
            </div>
            <div>
              <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
              <Input id="confirmarSenha" type="password" placeholder="Confirme sua nova senha" />
            </div>
          </div>
        </Card>

        {/* Configurações de Segurança */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-amplie-primary" />
            Configurações de Segurança
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Autenticação de Dois Fatores</Label>
                <p className="text-sm text-gray-500">Adicionar uma camada extra de segurança</p>
              </div>
              <Switch checked={accountSettings.twoFactorAuth} onCheckedChange={checked => handleSettingChange('twoFactorAuth', checked)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Notificações de Login</Label>
                <p className="text-sm text-gray-500">Receber alertas sobre novos logins</p>
              </div>
              <Switch checked={accountSettings.loginNotifications} onCheckedChange={checked => handleSettingChange('loginNotifications', checked)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Timeout de Sessão</Label>
                <p className="text-sm text-gray-500">Logout automático após inatividade</p>
              </div>
              <Switch checked={accountSettings.sessionTimeout} onCheckedChange={checked => handleSettingChange('sessionTimeout', checked)} />
            </div>
          </div>
        </Card>
      </div>
    </div>;
}