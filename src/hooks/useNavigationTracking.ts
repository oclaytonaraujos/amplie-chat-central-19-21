
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';

export function useNavigationTracking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isSuperAdmin, loading: roleLoading } = useUserRole();

  useEffect(() => {
    // Aguardar carregamento completo antes de tomar decisões de navegação
    if (authLoading || roleLoading) {
      console.log('Aguardando carregamento...', { authLoading, roleLoading });
      return;
    }

    console.log('Navegação checada:', {
      path: location.pathname,
      user: user?.email,
      isSuperAdmin,
      authLoading,
      roleLoading
    });

    // Redirecionar usuários não autenticados
    if (!user && location.pathname !== '/auth') {
      console.log('Usuário não autenticado, redirecionando para /auth');
      navigate('/auth', { replace: true });
      return;
    }

    // Redirecionar usuários autenticados da página de auth
    if (user && location.pathname === '/auth') {
      console.log('Usuário já autenticado, redirecionando para painel');
      navigate('/painel', { replace: true });
      return;
    }

    // Verificar acesso à página de super admin
    if (location.pathname === '/admin') {
      if (!user) {
        console.log('Sem usuário para acessar admin, redirecionando para auth');
        navigate('/auth', { replace: true });
        return;
      }
      
      if (!isSuperAdmin) {
        console.log('Usuário não é super admin, redirecionando para painel');
        navigate('/painel', { replace: true });
        return;
      }
      
      console.log('✅ Acesso autorizado ao admin para:', user.email);
    }

    // Redirecionar página inicial para painel
    if (location.pathname === '/' && user) {
      console.log('Redirecionando página inicial para painel');
      navigate('/painel', { replace: true });
      return;
    }
  }, [location.pathname, user, isSuperAdmin, authLoading, roleLoading, navigate]);

  return {
    currentPath: location.pathname,
    canAccessSuperAdmin: isSuperAdmin,
    isAuthenticated: !!user
  };
}
