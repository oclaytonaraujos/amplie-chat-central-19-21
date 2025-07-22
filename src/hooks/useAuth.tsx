
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  refreshSession: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Função para criar perfil do usuário quando necessário
const createUserProfile = async (user: User) => {
  try {
    console.log('Verificando perfil para:', user.email);
    
    // Verificar se o perfil já existe
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Erro ao verificar perfil existente:', profileError);
      return;
    }

    if (existingProfile) {
      console.log('Perfil já existe para o usuário');
      return;
    }

    // Se chegou aqui, o perfil não existe e precisa ser criado
    console.log('Criando perfil para usuário existente...');

    // Buscar a empresa Amplie Marketing como padrão
    const { data: empresa, error: empresaError } = await supabase
      .from('empresas')
      .select('id')
      .eq('email', 'ampliemarketing.mkt@gmail.com')
      .single();

    if (empresaError) {
      console.error('Erro ao buscar empresa:', empresaError);
      return;
    }

    // Verificar se é o usuário super admin
    const userEmail = user.email;
    if (!userEmail) {
      console.error('Usuário sem email, não é possível criar perfil');
      return;
    }

    const isSuperAdmin = userEmail === 'ampliemarketing.mkt@gmail.com';
    
    // Usar dados do user_metadata se disponível
    const userData = user.user_metadata || {};
    
    const profileData = {
      id: user.id,
      nome: userData.nome || (isSuperAdmin ? 'Super Admin' : userEmail.split('@')[0] || 'Usuário'),
      email: userEmail,
      empresa_id: userData.empresa_id || empresa.id,
      cargo: userData.cargo || (isSuperAdmin ? 'super_admin' : 'usuario'),
      setor: userData.setor || (isSuperAdmin ? 'Administração' : 'Geral'),
      status: userData.status || 'online',
      permissoes: userData.permissoes || []
    };

    console.log('Criando perfil com dados:', profileData);

    const { error } = await supabase
      .from('profiles')
      .insert(profileData);

    if (error) {
      console.error('Erro ao criar perfil:', error);
    } else {
      console.log('Perfil criado com sucesso para:', userEmail);
    }
  } catch (error) {
    console.error('Erro geral ao processar criação de perfil:', error);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = async () => {
    try {
      const { data: { session: newSession }, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Erro ao renovar sessão:', error);
        return;
      }
      setSession(newSession);
      setUser(newSession?.user ?? null);
    } catch (error) {
      console.error('Erro ao renovar sessão:', error);
    }
  };

  useEffect(() => {
    console.log('Configurando auth listener...');
    
    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Se o usuário acabou de fazer login, verificar/criar perfil se necessário
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('Usuário fez login, verificando perfil...');
          setTimeout(() => {
            createUserProfile(session.user);
          }, 100);
        }
        
        // Se o usuário fez logout, limpar dados
        if (event === 'SIGNED_OUT') {
          console.log('Usuário fez logout');
          setSession(null);
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Erro ao obter sessão:', error);
      }
      
      console.log('Sessão inicial:', session?.user?.email || 'Nenhuma sessão');
      setSession(session);
      setUser(session?.user ?? null);
      
      // Se já há uma sessão ativa, verificar perfil
      if (session?.user) {
        console.log('Sessão ativa encontrada, verificando perfil...');
        setTimeout(() => {
          createUserProfile(session.user);
        }, 100);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    console.log('Fazendo logout...');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Erro no logout:', error);
      }
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
