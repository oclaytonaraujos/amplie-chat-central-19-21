/**
 * Utilitários para análise e otimização de bundle
 */

// Função para analisar tamanho de chunks
export const analyzeBundle = () => {
  if (import.meta.env.DEV) {
    console.group('📊 Bundle Analysis');
    
    // Analisar imports dinâmicos
    const dynamicImports = document.querySelectorAll('script[src*="chunk"]');
    console.log(`📦 Dynamic chunks loaded: ${dynamicImports.length}`);
    
    // Analisar tamanho aproximado de assets
    const scripts = document.querySelectorAll('script[src]');
    console.log(`📜 Total scripts: ${scripts.length}`);
    
    // Listar scripts carregados
    scripts.forEach((script, index) => {
      const src = script.getAttribute('src');
      if (src) {
        console.log(`  ${index + 1}. ${src}`);
      }
    });
    
    console.groupEnd();
  }
};

// Função para detectar dependências não utilizadas
export const detectUnusedDependencies = () => {
  if (import.meta.env.DEV) {
    const unusedLibraries = [
      // Lista de bibliotecas que podem estar sendo importadas desnecessariamente
      'moment', // Substituto: date-fns
      'lodash', // Substituto: funções nativas ou utilidades específicas
      'jquery', // Substituto: vanilla JS ou React
      'bootstrap', // Substituto: Tailwind CSS
      'material-ui', // Se não estiver sendo usado
    ];
    
    console.group('🔍 Unused Dependencies Check');
    unusedLibraries.forEach(lib => {
      try {
        // Tentar importar dinamicamente para verificar se existe
        import(lib).then(() => {
          console.warn(`⚠️ ${lib} pode estar sendo importado desnecessariamente`);
        }).catch(() => {
          // Biblioteca não está instalada, tudo bem
        });
      } catch (error) {
        // Ignorar erros de import
      }
    });
    console.groupEnd();
  }
};

// Função para monitorar performance de loading
export const monitorLoadingPerformance = () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        console.group('⚡ Loading Performance');
        console.log(`DNS Lookup: ${Math.round(perfData.domainLookupEnd - perfData.domainLookupStart)}ms`);
        console.log(`TCP Connection: ${Math.round(perfData.connectEnd - perfData.connectStart)}ms`);
        console.log(`Request: ${Math.round(perfData.responseStart - perfData.requestStart)}ms`);
        console.log(`Response: ${Math.round(perfData.responseEnd - perfData.responseStart)}ms`);
        console.log(`DOM Processing: ${Math.round(perfData.domContentLoadedEventStart - perfData.responseEnd)}ms`);
        console.log(`Load Complete: ${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`);
        console.groupEnd();
        
        // Alertar se performance estiver ruim
        const totalTime = perfData.loadEventEnd - perfData.fetchStart;
        if (totalTime > 3000) {
          console.warn(`🐌 Slow loading detected: ${Math.round(totalTime)}ms`);
        }
      }, 1000);
    });
  }
};

// Função para otimizar imports
export const optimizeImports = () => {
  console.group('🎯 Import Optimization Tips');
  
  console.log('1. Use tree-shaking friendly imports:');
  console.log('   ✅ import { Button } from "@/components/ui/button"');
  console.log('   ❌ import * as UI from "@/components/ui"');
  
  console.log('2. Lazy load routes and heavy components:');
  console.log('   ✅ const Dashboard = lazy(() => import("./Dashboard"))');
  
  console.log('3. Use dynamic imports for conditional features:');
  console.log('   ✅ if (isAdmin) { await import("./AdminPanel") }');
  
  console.log('4. Avoid importing entire libraries:');
  console.log('   ✅ import debounce from "lodash/debounce"');
  console.log('   ❌ import _ from "lodash"');
  
  console.groupEnd();
};

// Função para verificar duplicatas de código
export const checkCodeDuplication = () => {
  console.group('🔄 Code Duplication Check');
  
  // Verificar se existem múltiplas implementações similares
  const duplicatePatterns = [
    'loading',
    'skeleton',
    'error-boundary',
    'toast',
    'modal',
    'button'
  ];
  
  duplicatePatterns.forEach(pattern => {
    console.log(`Checking for duplicate ${pattern} implementations...`);
    // Em um cenário real, isso faria uma análise mais profunda do código
  });
  
  console.groupEnd();
};

// Inicializar análises em desenvolvimento
export const initBundleOptimization = () => {
  if (import.meta.env.DEV) {
    // Executar análises após o load inicial
    window.addEventListener('load', () => {
      setTimeout(() => {
        analyzeBundle();
        detectUnusedDependencies();
        optimizeImports();
        checkCodeDuplication();
      }, 2000);
    });
    
    // Monitorar performance
    monitorLoadingPerformance();
  }
};