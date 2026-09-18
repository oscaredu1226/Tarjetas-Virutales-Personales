import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideIcons, provideNgIconsConfig } from '@ng-icons/core';
import { appIcons } from './shared/ui/app-icons';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideIcons(appIcons),
    provideNgIconsConfig({ size: '1.15em', strokeWidth: 2 }),
  ]
};
