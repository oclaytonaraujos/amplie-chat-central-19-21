
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type ColorScheme = 'blue' | 'green' | 'purple' | 'orange';
type FontSize = 'small' | 'medium' | 'large';
type DensityMode = 'compact' | 'comfortable' | 'spacious';

interface ThemeSettings {
  theme: Theme;
  colorScheme: ColorScheme;
  fontSize: FontSize;
  compactMode: boolean;
  animations: boolean;
}

interface LayoutSettings {
  sidebarCollapsed: boolean;
  showAvatars: boolean;
  showTimestamps: boolean;
  densityMode: DensityMode;
}

interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
}

interface ThemeContextType {
  themeSettings: ThemeSettings;
  layoutSettings: LayoutSettings;
  accessibilitySettings: AccessibilitySettings;
  updateThemeSettings: (settings: Partial<ThemeSettings>) => void;
  updateLayoutSettings: (settings: Partial<LayoutSettings>) => void;
  updateAccessibilitySettings: (settings: Partial<AccessibilitySettings>) => void;
  applyTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const defaultThemeSettings: ThemeSettings = {
  theme: 'light',
  colorScheme: 'blue',
  fontSize: 'medium',
  compactMode: false,
  animations: true
};

const defaultLayoutSettings: LayoutSettings = {
  sidebarCollapsed: false,
  showAvatars: true,
  showTimestamps: true,
  densityMode: 'comfortable'
};

const defaultAccessibilitySettings: AccessibilitySettings = {
  highContrast: false,
  reducedMotion: false,
  screenReader: false,
  keyboardNavigation: true
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(() => {
    const saved = localStorage.getItem('theme-settings');
    return saved ? JSON.parse(saved) : defaultThemeSettings;
  });

  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>(() => {
    const saved = localStorage.getItem('layout-settings');
    return saved ? JSON.parse(saved) : defaultLayoutSettings;
  });

  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('accessibility-settings');
    return saved ? JSON.parse(saved) : defaultAccessibilitySettings;
  });

  const updateThemeSettings = (settings: Partial<ThemeSettings>) => {
    setThemeSettings(prev => {
      const newSettings = { ...prev, ...settings };
      localStorage.setItem('theme-settings', JSON.stringify(newSettings));
      return newSettings;
    });
  };

  const updateLayoutSettings = (settings: Partial<LayoutSettings>) => {
    setLayoutSettings(prev => {
      const newSettings = { ...prev, ...settings };
      localStorage.setItem('layout-settings', JSON.stringify(newSettings));
      return newSettings;
    });
  };

  const updateAccessibilitySettings = (settings: Partial<AccessibilitySettings>) => {
    setAccessibilitySettings(prev => {
      const newSettings = { ...prev, ...settings };
      localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
      return newSettings;
    });
  };

  const applyTheme = () => {
    const root = document.documentElement;
    
    // Apply theme - agora suporta dark mode
    if (themeSettings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply color scheme
    root.setAttribute('data-color-scheme', themeSettings.colorScheme);

    // Apply font size
    root.setAttribute('data-font-size', themeSettings.fontSize);

    // Apply density mode
    root.setAttribute('data-density', layoutSettings.densityMode);

    // Apply compact mode
    root.classList.toggle('compact-mode', themeSettings.compactMode);

    // Apply accessibility settings
    root.classList.toggle('high-contrast', accessibilitySettings.highContrast);
    root.classList.toggle('reduced-motion', accessibilitySettings.reducedMotion);
    root.classList.toggle('no-animations', !themeSettings.animations || accessibilitySettings.reducedMotion);

    console.log('Tema aplicado:', { themeSettings, layoutSettings, accessibilitySettings });
  };

  useEffect(() => {
    applyTheme();
  }, [themeSettings, layoutSettings, accessibilitySettings]);

  return (
    <ThemeContext.Provider value={{
      themeSettings,
      layoutSettings,
      accessibilitySettings,
      updateThemeSettings,
      updateLayoutSettings,
      updateAccessibilitySettings,
      applyTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
