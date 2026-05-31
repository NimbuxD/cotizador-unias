import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CatalogItem, CreateCatalogItemDto } from './catalog-item.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private apiUrl = `${environment.apiUrl}/api/catalog`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<CatalogItem[]> {
    return this.http.get<CatalogItem[]>(this.apiUrl);
  }

  getById(id: number): Observable<CatalogItem> {
    return this.http.get<CatalogItem>(`${this.apiUrl}/${id}`);
  }

  create(item: CreateCatalogItemDto): Observable<CatalogItem> {
    return this.http.post<CatalogItem>(this.apiUrl, item);
  }

  update(id: number, item: Partial<CreateCatalogItemDto>): Observable<CatalogItem> {
    return this.http.put<CatalogItem>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addPhoto(id: number, photo: string): Observable<CatalogItem> {
    return this.http.post<CatalogItem>(`${this.apiUrl}/${id}/photos`, { photo });
  }

  removePhoto(id: number, index: number): Observable<CatalogItem> {
    return this.http.delete<CatalogItem>(`${this.apiUrl}/${id}/photos/${index}`);
  }
}
