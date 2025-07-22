import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function AdminLayout({ children, title = "Super Admin", description = "Painel administrativo da plataforma" }: AdminLayoutProps) {
  const { user } = useAuth();
  const { adminLogout } = useAdminAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-full shadow-md">
                <img 
                  src="/lovable-uploads/eddc7fb8-220e-433f-89b2-915fbe2e2daf.png" 
                  alt="Amplie Icon" 
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <img 
                    src="/lovable-uploads/8ed7aa80-8a43-4375-a757-0f7dd486297f.png" 
                    alt="Amplie Chat Logo" 
                    className="h-6 object-contain"
                  />
                  <span className="text-lg font-bold text-primary">{title}</span>
                </div>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={adminLogout}
                className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair do Admin
              </Button>
              <div className="text-sm text-muted-foreground bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-full border">
                {user?.email}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}