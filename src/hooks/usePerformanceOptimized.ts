/**
 * Hook otimizado para melhorar performance de carregamento
 */
import { useEffect, useState, useCallback } from 'react';

// Cache simples para componentes
const componentCache = new Map();

// Preload crítico de recursos
export const usePerformanceOptimizations = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Preload de recursos críticos
    const preloadCriticalResources = async () => {
      try {
        // Precarregar componentes mais usados
        const criticalImports = [
          import('@/components/ui/button'),
          import('@/components/ui/card'),
          import('@/components/ui/input'),
        ];

        await Promise.allSettled(criticalImports);
        setIsReady(true);
      } catch (error) {
        console.warn('Failed to preload resources:', error);
        setIsReady(true); // Continue mesmo com erro
      }
    };

    preloadCriticalResources();
  }, []);

  return { isReady };
};

// Hook para cache de componentes lazy
export const useLazyComponentCache = () => {
  const getCachedComponent = useCallback((key: string, loader: () => Promise<any>) => {
    if (componentCache.has(key)) {
      return componentCache.get(key);
    }

    const component = loader();
    componentCache.set(key, component);
    return component;
  }, []);

  return { getCachedComponent };
};

// Performance monitoring simplificado
export const usePagePerformance = () => {
  useEffect(() => {
    const measurePageLoad = () => {
      if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const loadTime = perfData.loadEventEnd - perfData.fetchStart;
        
        if (loadTime > 3000) {
          console.warn(`Slow page load detected: ${Math.round(loadTime)}ms`);
        }
      }
    };

    // Medir após o carregamento completo
    window.addEventListener('load', measurePageLoad);
    
    return () => {
      window.removeEventListener('load', measurePageLoad);
    };
  }, []);
};