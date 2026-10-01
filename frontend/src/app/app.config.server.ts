import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { LOCAL_API } from './core/api';
import { SITE_URL } from './core/services/seo.service';
import { localApi, siteUrl } from './server/local-api';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    { provide: LOCAL_API, useValue: localApi },
    { provide: SITE_URL, useValue: siteUrl },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
