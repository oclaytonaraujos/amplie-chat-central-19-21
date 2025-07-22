import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2, RefreshCw, Download, Upload, Search, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'bounce';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'spinner',
  className,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  if (variant === 'spinner') {
    return (
      <Loader2 
        className={cn(
          'animate-spin text-primary',
          sizeClasses[size],
          className
        )} 
      />
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex space-x-1', className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              'bg-primary rounded-full animate-pulse',
              size === 'sm' && 'w-1 h-1',
              size === 'md' && 'w-2 h-2',
              size === 'lg' && 'w-3 h-3',
              size === 'xl' && 'w-4 h-4'
            )}
            style={{
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div 
        className={cn(
          'bg-primary rounded-full animate-pulse',
          sizeClasses[size],
          className
        )}
      />
    );
  }

  if (variant === 'bounce') {
    return (
      <div className={cn('flex space-x-1', className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              'bg-primary rounded-full animate-bounce',
              size === 'sm' && 'w-1 h-1',
              size === 'md' && 'w-2 h-2',
              size === 'lg' && 'w-3 h-3',
              size === 'xl' && 'w-4 h-4'
            )}
            style={{
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    );
  }

  return null;
};

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  message?: string;
  variant?: 'overlay' | 'blur' | 'skeleton';
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  message = 'Carregando...',
  variant = 'overlay',
  className,
}) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  if (variant === 'skeleton') {
    return (
      <div className={cn('space-y-4', className)}>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-5/6" />
        <div className="space-y-2">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {variant === 'blur' && (
        <div className="filter blur-sm pointer-events-none">
          {children}
        </div>
      )}
      
      <div className={cn(
        'absolute inset-0 flex items-center justify-center z-50',
        variant === 'overlay' && 'bg-background/80 backdrop-blur-sm'
      )}>
        <Card className="p-6">
          <CardContent className="flex flex-col items-center space-y-4">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-muted-foreground text-center">{message}</p>
          </CardContent>
        </Card>
      </div>
      
      {variant === 'overlay' && children}
    </div>
  );
};

interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  children,
  loadingText,
  icon,
  className,
  disabled,
  onClick,
}) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md',
        'bg-primary text-primary-foreground hover:bg-primary/90',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-all duration-200',
        className
      )}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" />
          {loadingText || 'Carregando...'}
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
};

interface ProgressiveLoadingProps {
  steps: Array<{
    label: string;
    completed: boolean;
  }>;
  currentStep?: number;
  className?: string;
}

export const ProgressiveLoading: React.FC<ProgressiveLoadingProps> = ({
  steps,
  currentStep = 0,
  className,
}) => {
  const completedSteps = steps.filter(step => step.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  return (
    <Card className={cn('p-6', className)}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={cn(
                'flex items-center gap-3 text-sm',
                step.completed && 'text-green-600',
                index === currentStep && 'text-primary font-medium',
                !step.completed && index !== currentStep && 'text-muted-foreground'
              )}
            >
              <div
                className={cn(
                  'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                  step.completed && 'bg-green-600 border-green-600',
                  index === currentStep && 'border-primary',
                  !step.completed && index !== currentStep && 'border-muted-foreground'
                )}
              >
                {step.completed && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
                {index === currentStep && !step.completed && (
                  <LoadingSpinner size="sm" />
                )}
              </div>
              <span>{step.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface ActionLoadingProps {
  action: 'upload' | 'download' | 'search' | 'send' | 'refresh' | 'save';
  isLoading: boolean;
  message?: string;
  className?: string;
}

export const ActionLoading: React.FC<ActionLoadingProps> = ({
  action,
  isLoading,
  message,
  className,
}) => {
  const getIcon = () => {
    switch (action) {
      case 'upload': return <Upload className="w-5 h-5" />;
      case 'download': return <Download className="w-5 h-5" />;
      case 'search': return <Search className="w-5 h-5" />;
      case 'send': return <MessageSquare className="w-5 h-5" />;
      case 'refresh': return <RefreshCw className="w-5 h-5" />;
      case 'save': return <Download className="w-5 h-5" />;
      default: return <Loader2 className="w-5 h-5" />;
    }
  };

  const getDefaultMessage = () => {
    switch (action) {
      case 'upload': return 'Enviando arquivo...';
      case 'download': return 'Baixando...';
      case 'search': return 'Procurando...';
      case 'send': return 'Enviando mensagem...';
      case 'refresh': return 'Atualizando...';
      case 'save': return 'Salvando...';
      default: return 'Processando...';
    }
  };

  if (!isLoading) return null;

  return (
    <div className={cn('flex items-center gap-2 text-sm text-muted-foreground', className)}>
      <div className={cn(isLoading && 'animate-spin')}>
        {getIcon()}
      </div>
      <span>{message || getDefaultMessage()}</span>
    </div>
  );
};

// Hook para estados de loading
export const useLoadingState = (initialState = false) => {
  const [isLoading, setIsLoading] = React.useState(initialState);
  const [error, setError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState(0);

  const startLoading = React.useCallback(() => {
    setIsLoading(true);
    setError(null);
    setProgress(0);
  }, []);

  const stopLoading = React.useCallback(() => {
    setIsLoading(false);
    setProgress(100);
  }, []);

  const setLoadingError = React.useCallback((errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
  }, []);

  const updateProgress = React.useCallback((newProgress: number) => {
    setProgress(Math.max(0, Math.min(100, newProgress)));
  }, []);

  return {
    isLoading,
    error,
    progress,
    startLoading,
    stopLoading,
    setLoadingError,
    updateProgress,
  };
};