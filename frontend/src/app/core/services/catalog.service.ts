import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { API_BASE } from '../api';
import { Category, Product, Review } from '../models/catalog.model';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);

  private readonly categories$ = this.http
    .get<Category[]>(`${API_BASE}/categories`)
    .pipe(shareReplay({ bufferSize: 1, refCount: false }));

  getCategories(): Observable<Category[]> {
    return this.categories$;
  }

  getProducts(filter: { category?: string | null; featured?: boolean } = {}): Observable<Product[]> {
    let params = new HttpParams();
    if (filter.category) params = params.set('category', filter.category);
    if (filter.featured !== undefined) params = params.set('featured', String(filter.featured));
    return this.http.get<Product[]>(`${API_BASE}/products`, { params });
  }

  getProduct(slug: string): Observable<Product> {
    return this.http.get<Product>(`${API_BASE}/products/${encodeURIComponent(slug)}`);
  }

  getReviews(filter: { productId?: string; featured?: boolean } = {}): Observable<Review[]> {
    let params = new HttpParams();
    if (filter.productId) params = params.set('product', filter.productId);
    if (filter.featured !== undefined) params = params.set('featured', String(filter.featured));
    return this.http.get<Review[]>(`${API_BASE}/reviews`, { params });
  }
}
