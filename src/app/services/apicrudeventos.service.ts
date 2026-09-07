import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEvento, IEventos } from 'src/interfaces/IEventos';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApicrudeventosService {

  constructor(private httpclient: HttpClient) { }

  getEventos(): Observable<IEventos[]> {
    return this.httpclient.get<IEventos[]>(
      `${environment.apiUrl}/eventos`,
      { withCredentials: true }
    );
  }

  getEventoById(eventoId: string): Observable<IEventos> {
    return this.httpclient.get<IEventos>(
      `${environment.apiUrl}/eventos/${encodeURIComponent(eventoId)}`,
      { withCredentials: true }
    );
  }

  postEventos(newEvento: IEvento): Observable<IEvento> {
    return this.httpclient.post<IEvento>(
      `${environment.apiUrl}/eventos`,
      newEvento,
      { withCredentials: true }
    );
  }

  putEventos(eventoId: string, data: Partial<IEvento>): Observable<IEventos> {
    return this.httpclient.put<IEventos>(
      `${environment.apiUrl}/eventos/${encodeURIComponent(eventoId)}`,
      data,
      { withCredentials: true }
    );
  }

  deleteEventos(eventoId: string): Observable<void> {
    return this.httpclient.delete<void>(
      `${environment.apiUrl}/eventos/${encodeURIComponent(eventoId)}`,
      { withCredentials: true }
    );
  }

  /**
   * El QR debe contener solo un token opaco/firmado.
   * El servidor valida token, evento, usuario, expiración y si ya fue usado.
   */
  registrarQrToken(token: string): Observable<any> {
    return this.httpclient.post<any>(
      `${environment.apiUrl}/QR/validate`,
      { token },
      { withCredentials: true }
    );
  }

  getAsistentes(eventoId: string): Observable<any> {
    return this.httpclient.get(
      `${environment.apiUrl}/${encodeURIComponent(eventoId)}/asistentes`,
      { withCredentials: true }
    );
  }
}
