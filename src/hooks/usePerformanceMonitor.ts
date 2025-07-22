/**
 * Hook para monitoramento de performance
 */
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PerformanceMetric {
  endpoint: string;
  duration: number;
  status: number;
  metadata?: any;
}

export function usePerformanceMonitor() {
  const logMetric = useCallback(async (metric: PerformanceMetric) => {
    try {
      await supabase.functions.invoke('performance-monitor', {
        body: {
          ...metric,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.warn('Erro ao registrar métrica:', error);
    }
  }, []);

  const measureAsync = useCallback(async <T>(
    endpoint: string,
    asyncFn: () => Promise<T>
  ): Promise<T> => {
    const startTime = performance.now();
    let status = 200;
    
    try {
      const result = await asyncFn();
      return result;
    } catch (error) {
      status = 500;
      throw error;
    } finally {
      const duration = performance.now() - startTime;
      logMetric({ endpoint, duration, status });
    }
  }, [logMetric]);

  const getPerformanceReport = useCallback(async (period: '1h' | '24h' | '7d' = '24h') => {
    try {
      const { data } = await supabase.functions.invoke('performance-monitor', {
        method: 'GET',
        body: null
      });
      return data;
    } catch (error) {
      console.error('Erro ao obter relatório:', error);
      return null;
    }
  }, []);

  return {
    logMetric,
    measureAsync,
    getPerformanceReport
  };
}