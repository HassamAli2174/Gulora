import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { SeoService } from './services/seo.service';

/**
 * Applies SEO tags for every route that declares a `title` (and optional
 * `data.description`). Routes without a title, like product pages, set their
 * own tags once their data has loaded.
 */
@Injectable()
export class SeoTitleStrategy extends TitleStrategy {
  private readonly seo = inject(SeoService);

  override updateTitle(snapshot: RouterStateSnapshot) {
    const title = this.buildTitle(snapshot);
    if (!title) return;

    let route: ActivatedRouteSnapshot = snapshot.root;
    while (route.firstChild) route = route.firstChild;

    this.seo.update({ title, description: route.data['description'], path: snapshot.url });
    this.seo.setJsonLd('ld-page', route.data['jsonLd'] ?? null);
  }
}
