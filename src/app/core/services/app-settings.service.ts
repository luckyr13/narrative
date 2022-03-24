import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {
	appName = 'Narrative';
	appVersion = '0.0.3';
	protocolVersion = '0.0-dev';

  constructor() { }
}
