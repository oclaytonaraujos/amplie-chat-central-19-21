/**
 * Componentes e recursos de acessibilidade
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// Context para configurações de acessibilidade
interface AccessibilityContextType {
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  fontSize: 'small' | 'medium' | 'large';
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  toggleScreenReader: () => void;
  toggleKeyboardNavigation: () => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [keyboardNavigation, setKeyboardNavigation] = useState(true);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  // Detectar preferências do sistema
  useEffect(() => {
    // Detectar reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Aplicar configurações ao DOM
  useEffect(() => {
    const root = document.documentElement;
    
    root.classList.toggle('high-contrast', highContrast);
    root.classList.toggle('reduced-motion', reducedMotion);
    root.setAttribute('data-font-size', fontSize);
    
    if (screenReader) {
      root.setAttribute('aria-live', 'polite');
    } else {
      root.removeAttribute('aria-live');
    }
  }, [highContrast, reducedMotion, screenReader, fontSize]);

  const toggleHighContrast = () => setHighContrast(!highContrast);
  const toggleReducedMotion = () => setReducedMotion(!reducedMotion);
  const toggleScreenReader = () => setScreenReader(!screenReader);
  const toggleKeyboardNavigation = () => setKeyboardNavigation(!keyboardNavigation);

  const value = {
    highContrast,
    reducedMotion,
    screenReader,
    keyboardNavigation,
    fontSize,
    toggleHighContrast,
    toggleReducedMotion,
    toggleScreenReader,
    toggleKeyboardNavigation,
    setFontSize
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

// Componente Skip Link
export function SkipLink({ href = "#main-content", children = "Pular para o conteúdo principal" }: { 
  href?: string; 
  children?: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium"
    >
      {children}
    </a>
  );
}

// Hook para navegação por teclado
export function useKeyboardNavigation(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Tab navigation
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
      
      // Escape para fechar modais
      if (e.key === 'Escape') {
        const modals = document.querySelectorAll('[role="dialog"], [role="alertdialog"]');
        modals.forEach(modal => {
          const closeButton = modal.querySelector('[aria-label="Close"], [aria-label="Fechar"]');
          if (closeButton && closeButton instanceof HTMLElement) {
            closeButton.click();
          }
        });
      }
    };

    const handleMouseDown = () => {
      document.body.classList.remove('keyboard-navigation');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [enabled]);
}

// Componente para texto com screen reader
interface ScreenReaderTextProps {
  children: React.ReactNode;
  className?: string;
}

export function ScreenReaderText({ children, className }: ScreenReaderTextProps) {
  return (
    <span className={cn("sr-only", className)}>
      {children}
    </span>
  );
}

// Componente para melhorar foco
interface FocusableProps {
  children: React.ReactNode;
  className?: string;
  autoFocus?: boolean;
}

export function Focusable({ children, className, autoFocus = false }: FocusableProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoFocus && ref.current) {
      ref.current.focus();
    }
  }, [autoFocus]);

  return (
    <div
      ref={ref}
      tabIndex={-1}
      className={cn(
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded",
        className
      )}
    >
      {children}
    </div>
  );
}

// Hook para gerenciar foco
export function useFocusManagement() {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);

  const trapFocus = React.useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            e.preventDefault();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const restoreFocus = React.useCallback((element?: HTMLElement) => {
    const elementToFocus = element || focusedElement;
    elementToFocus?.focus();
    setFocusedElement(null);
  }, [focusedElement]);

  const saveFocus = React.useCallback(() => {
    setFocusedElement(document.activeElement as HTMLElement);
  }, []);

  return { trapFocus, restoreFocus, saveFocus };
}

// Componente de região de live announcements
export function LiveRegion({ 
  children, 
  politeness = 'polite' 
}: { 
  children: React.ReactNode;
  politeness?: 'polite' | 'assertive' | 'off';
}) {
  return (
    <div
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {children}
    </div>
  );
}

// Hook para anúncios de screen reader
export function useScreenReaderAnnouncement() {
  const [announcement, setAnnouncement] = useState('');

  const announce = React.useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncement(''); // Limpar primeiro para garantir que a mudança seja detectada
    setTimeout(() => {
      setAnnouncement(message);
    }, 100);

    // Limpar após um tempo
    setTimeout(() => {
      setAnnouncement('');
    }, 3000);
  }, []);

  const AnnouncementComponent = React.useMemo(() => 
    announcement ? <LiveRegion>{announcement}</LiveRegion> : null,
    [announcement]
  );

  return { announce, AnnouncementComponent };
}

// Componente para indicador de loading acessível
interface AccessibleLoadingProps {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export function AccessibleLoading({ 
  isLoading, 
  loadingText = "Carregando...", 
  children 
}: AccessibleLoadingProps) {
  return (
    <div>
      {isLoading && (
        <div
          role="status"
          aria-live="polite"
          aria-label={loadingText}
          className="sr-only"
        >
          {loadingText}
        </div>
      )}
      <div aria-hidden={isLoading}>
        {children}
      </div>
    </div>
  );
}