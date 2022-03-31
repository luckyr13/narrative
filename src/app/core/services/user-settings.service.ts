import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
declare const window: any;
declare const document: any;

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {
	private _defaultTheme: string = '';
	private _defaultLang: string = '';
  private _storage = window.localStorage;
  public themes: Record<string, {id: string, label: string, dark: boolean}> = {
    'dark-blue-gray-theme': {
      id: 'dark-blue-gray-theme',
      label: 'Dark Blue',
      dark: true
    },
    'light-blue-theme': {
      id: 'light-blue-theme',
      label: 'Light Blue',
      dark: false
    },
    'dark-theme': {
      id: 'dark-theme',
      label: 'Dark',
      dark: true
    },
    'light-theme': {
      id: 'light-theme',
      label: 'Light',
      dark: false
    },
    'dark-pink-theme': {
      id: 'dark-pink-theme',
      label: 'Dark Pink',
      dark: true
    },
    'light-pink-theme': {
      id: 'light-pink-theme',
      label: 'Light Pink',
      dark: false
    },
    'dark-deep-purple-theme': {
      id: 'dark-deep-purple-theme',
      label: 'Deep Purple',
      dark: true
    },
  };

  private _currentTheme: Subject<string> = new Subject<string>();
  public currentThemeStream = this._currentTheme.asObservable();

  get themeNamesList(): string[] {
    return Object.keys(this.themes);
  }

  constructor() {
  	const dtheme = this._storage.getItem('defaultTheme');
  	const dlang = this._storage.getItem('defaultLang');

  	// Default settings
  	if (dtheme) {
  		this.setTheme(dtheme);
  	} else {
  		this.setTheme('dark-blue-gray-theme');
  	}
  	if (dlang) {
  		this.setDefaultLang(dlang);
  	}
  }

  getDefaultTheme(): string {
  	return this._defaultTheme;
  }

  getThemeObj(theme: string): {id: string, label: string, dark: boolean} {
    return this.themes[theme];
  }

  getDefaultLang(): string {
  	return this._defaultLang;
  }

  setDefaultTheme(_theme: string) {
  	if (_theme) {
    	this._defaultTheme = _theme;
    	this._storage.setItem('defaultTheme', this._defaultTheme);
      this.updateBodyClass(_theme);
      this._currentTheme.next(this._defaultTheme);
  	}
  }

  setDefaultLang(_lang: string) {
  	if (_lang) {
  		this._defaultLang = _lang;
    	this._storage.setItem('defaultLang', this._defaultLang);
  	}
  }

  resetUserSettings() {
  	this._defaultLang = 'EN';
  	this._defaultTheme = 'dark-blue-gray-theme';
  	this._storage.removeItem('defaultTheme');
  	this._storage.removeItem('defaultLang');

  }

  /*
  *  Set default theme (Updates the href property)
  */
  setTheme(theme: string) {
    const themes = this.themeNamesList;
    for (const t of themes) {
      if (theme === t) {
        this.setDefaultTheme(theme);
        return;
      }
    }
    console.error('UserSettings: Theme not found!');
  }

  updateBodyClass(className: string) {
    if (document.body) {
      document.body.className = className;
    }
  }

  isDarkTheme(theme: string) {
    return this.themes[theme].dark;
  }
  
}
