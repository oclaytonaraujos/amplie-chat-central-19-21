
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function FilterBar() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex gap-3">
        {/* Busca */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar contato ou mensagem..."
            className="pl-10"
          />
        </div>

        {/* Botão de Filtros - apenas ícone */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="w-10 h-10">
              <Filter className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-gray-900 mb-3">Filtrar por:</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Status</label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="novos">Novos</SelectItem>
                      <SelectItem value="em-atendimento">Em Atendimento</SelectItem>
                      <SelectItem value="pendentes">Pendentes</SelectItem>
                      <SelectItem value="finalizados">Finalizados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Agente</label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Todos os agentes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="ana">Ana Silva</SelectItem>
                      <SelectItem value="carlos">Carlos Santos</SelectItem>
                      <SelectItem value="maria">Maria Costa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Setor</label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Todos os setores" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="vendas">Vendas</SelectItem>
                      <SelectItem value="suporte">Suporte</SelectItem>
                      <SelectItem value="financeiro">Financeiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Tags</label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Todas as tags" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="reclamacao">Reclamação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="outline" size="sm">
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
