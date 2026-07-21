import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '~env/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpBaseService {
  private httpClient = inject(HttpClient);

  private static createUrl(path: string): string {
    return `${environment.BACKEND_URL}${path}`;
  }

  public get<T>(path: string): Observable<T> {
    return this.httpClient.get<T>(HttpBaseService.createUrl(path));
  }

  public post<T>(path: string, body: unknown): Observable<T> {
    return this.httpClient.post<T>(HttpBaseService.createUrl(path), body);
  }

  public put<T>(path: string, body: unknown): Observable<T> {
    return this.httpClient.put<T>(HttpBaseService.createUrl(path), body);
  }

  public delete<T>(path: string): Observable<T> {
    return this.httpClient.delete<T>(HttpBaseService.createUrl(path));
  }
}
