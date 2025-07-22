
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

interface Contato {
  id: number;
  nome: string;
  telefone: string;
  email?: string;
  ultimoAtendente: string;
  setorUltimoAtendimento: string;
  dataUltimaInteracao: string;
  tags: string[];
  status: 'ativo' | 'inativo' | 'bloqueado';
  totalAtendimentos: number;
  atendentesAssociados: {
    setor: string;
    atendente: string;
  }[];
}

interface EditarContatoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contato: Contato | null;
  onContatoEditado: (contato: Contato) => void;
}

const statusDisponiveis = ['ativo', 'inativo', 'bloqueado'];
const tagsDisponiveis = ['VIP', 'Interessado', 'Problema Recorrente', 'Novo Contato', 'Cliente Premium'];
const setoresDisponiveis = ['Vendas', 'Suporte', 'Marketing', 'Financeiro', 'RH'];

export function EditarContatoDialog({ open, onOpenChange, contato, onContatoEditado }: EditarContatoDialogProps) {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    status: 'ativo' as 'ativo' | 'inativo' | 'bloqueado',
    setorUltimoAtendimento: ''
  });
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (contato) {
      setFormData({
        nome: contato.nome,
        telefone: contato.telefone,
        email: contato.email || '',
        status: contato.status,
        setorUltimoAtendimento: contato.setorUltimoAtendimento
      });
      setTags(contato.tags || []);
    }
  }, [contato]);

  const toggleTag = (tag: string) => {
    setTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (contato) {
      const contatoEditado: Contato = {
        ...contato,
        ...formData,
        tags
      };

      onContatoEditado(contatoEditado);
      onOpenChange(false);
    }
  };

  if (!contato) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Contato</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="setor">Setor *</Label>
              <Select value={formData.setorUltimoAtendimento} onValueChange={(value) => setFormData(prev => ({ ...prev, setorUltimoAtendimento: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {setoresDisponiveis.map(setor => (
                    <SelectItem key={setor} value={setor}>{setor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
                <SelectItem value="bloqueado">Bloqueado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Tags</Label>
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
              {tagsDisponiveis.map(tag => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox
                    id={tag}
                    checked={tags.includes(tag)}
                    onCheckedChange={() => toggleTag(tag)}
                  />
                  <Label htmlFor={tag} className="text-sm font-normal cursor-pointer">
                    {tag}
                  </Label>
                </div>
              ))}
            </div>
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
