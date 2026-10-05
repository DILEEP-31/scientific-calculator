/**
 * Calculator Theme Module
 * Manages dark/light theme toggle and persistence
 */

class ThemeManager {
  constructor() {
    this.storageKey = 'calcTheme';
    this.darkClass = 'dark-theme';
    this.themeToggleBtn = document.getElementById('themeToggle');
    this.init();
  }

  /**
   * Initialize theme
   */
  init() {
    this.loadThemePreference();
    this.setupToggleButton();
  }

  /**
   * Setup toggle button listener
   */
  setupToggleButton() {
    this.themeToggleBtn.addEventListener('click', () => {
      this.toggleTheme();
    });
  }

  /**
   * Toggle between dark and light theme
   */
  toggleTheme() {
    const isDark = document.documentElement.classList.toggle(this.darkClass);
    this.saveThemePreference(isDark);
    this.updateToggleButton(isDark);
  }

  /**
   * Load theme preference from storage
   */
  loadThemePreference() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      const isDark = stored ? JSON.parse(stored) : this.prefersDark();

      if (isDark) {
        document.documentElement.classList.add(this.darkClass);
      } else {
        document.documentElement.classList.remove(this.darkClass);
      }

      this.updateToggleButton(isDark);
    } catch (e) {
      console.error('Error loading theme preference:', e);
      if (this.prefersDark()) {
        document.documentElement.classList.add(this.darkClass);
      }
    }
  }

  /**
   * Save theme preference to storage
   */
  saveThemePreference(isDark) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(isDark));
    } catch (e) {
      console.error('Error saving theme preference:', e);
    }
  }

  /**
   * Check if system prefers dark mode
   */
  prefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Update toggle button icon/text
   */
  updateToggleButton(isDark) {
    this.themeToggleBtn.textContent = isDark ? '☀️' : '🌙';
    this.themeToggleBtn.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
  }
}

// Initialize theme manager
window.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
});
