// Utility functions for theme management

export const clearInvalidThemeCache = () => {
  const validThemes = [
    'default',
    'darkArts', 
    'hogwartsSnow',
    'greatHall',
    'diagonAlley',
    'triwizard',
    'greenhouse'
  ];
  
  const savedTheme = localStorage.getItem('selected_ui_theme');
  
  console.log('🧹 Checking cached theme:', savedTheme);
  
  if (savedTheme && !validThemes.includes(savedTheme)) {
    console.log('❌ Invalid cached theme found:', savedTheme, '- clearing...');
    localStorage.removeItem('selected_ui_theme');
    localStorage.setItem('selected_ui_theme', 'default');
    
    // Force page reload to apply default theme
    window.location.reload();
    return true;
  }
  
  console.log('✅ Theme cache is valid');
  return false;
};

export const forceThemeRefresh = () => {
  console.log('🔄 Forcing theme refresh...');
  
  // Remove all theme-related CSS custom properties
  const root = document.documentElement;
  const themeProps = [
    '--theme-primary',
    '--theme-secondary', 
    '--theme-accent',
    '--theme-background',
    '--theme-card-bg',
    '--theme-text-primary',
    '--theme-text-secondary',
    '--theme-background-image'
  ];
  
  themeProps.forEach(prop => {
    root.style.removeProperty(prop);
  });
  
  // Force repaint
  document.body.style.display = 'none';
  // eslint-disable-next-line no-unused-expressions
  document.body.offsetHeight;
  document.body.style.display = '';
  
  console.log('✅ Theme refresh completed');
}; 