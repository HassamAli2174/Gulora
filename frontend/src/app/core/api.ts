import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { InjectionToken, inject } from '@angular/core';
import { of, throwError } from 'rxjs';

/**
 * Base URL of the Gulora API. Relative by default: the dev server proxies it
 * (see proxy.conf.json) and in production it is served from the same domain.
 * If you host the frontend and API on different domains, set the full URL here.
 */
export const API_BASE = '/api';

/**
 * Answers API GET requests in-process instead of over the network. Provided
 * only on the server (see app.config.server.ts) so pages can be prerendered at
 * build time without a running API. Return `undefined` for "not found".
 */
export type LocalApiHandler = (path: string, params: HttpParams) => unknown;
export const LOCAL_API = new InjectionToken<LocalApiHandler>('LOCAL_API');

export const localApiInterceptor: HttpInterceptorFn = (req, next) => {
  const local = inject(LOCAL_API, { optional: true });
  if (!local || req.method !== 'GET' || !req.url.startsWith(`${API_BASE}/`)) {
    return next(req);
  }
  const body = local(req.url.slice(API_BASE.length), req.params);
  return body === undefined
    ? throwError(() => new HttpErrorResponse({ status: 404, url: req.url }))
    : of(new HttpResponse({ status: 200, body, url: req.url }));
};
