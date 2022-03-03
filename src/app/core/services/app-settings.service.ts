import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {
	appName = 'Narrative';
	version = '0.1';

  constructor() { }
}
