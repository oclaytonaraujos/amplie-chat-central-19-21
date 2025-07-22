
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';

interface Contato {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
  empresa?: string;
  tags?: string[];
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

interface ExcluirContatoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contato: Contato | null;
  onContatoExcluido: (id: string) => void;
}

export function ExcluirContatoDialog({ open, onOpenChange, contato, onContatoExcluido }: ExcluirContatoDialogProps) {
  const handleConfirm = () => {
    if (contato) {
      onContatoExcluido(contato.id);
      onOpenChange(false);
    }
  };

  if (!contato) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span>Confirmar Exclusão</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-gray-600 mb-4">
            Tem certeza que deseja excluir o contato <strong>{contato.nome}</strong>?
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-800 text-sm">
              <strong>Atenção:</strong> Esta ação não pode ser desfeita. Todo o histórico de atendimentos e dados do contato serão permanentemente removidos.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Excluir Contato
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
