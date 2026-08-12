export const COLORS = {
    MAINCOLOR: '#ff7e19',
    BLUEHIGHTLIGHTCOLOR: '#05aeff',
    BLACKCOLOR: '#131313',
    primary: '#1E88E5',
    secondary: '#43A047',
    text: '#333',
    danger: '#FF5252',
    muted: '#999',
    background: '#F9FAFB',
};

export const SOOMGO = {
    primary: '#00C7AE',
    primaryDark: '#00B493',
    primaryLight: '#E6FAF7',
    bgWhite: '#FFFFFF',
    bgGray: '#F7F8FA',
    textPrimary: '#1A1A1A',
    textSecondary: '#666666',
    textTertiary: '#999999',
    border: '#F0F0F0',
};
  
export const withAlpha = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  };