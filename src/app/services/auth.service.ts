import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { LoginRequest, LoginResponse, NewUser, UpdateUserProfile, Users } from 'src/interfaces/users';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpclient: HttpClient) { }

  /**
   * La contraseña se valida exclusivamente en el backend.
   * El backend debe crear una cookie de sesión HttpOnly + Secure + SameSite.
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.httpclient.post<LoginResponse>(
      `${environment.apiUrl}/auth/login`,
      credentials,
      { withCredentials: true }
    );
  }

  /** Obtiene al usuario de la sesión actual, nunca por password. */
  getCurrentUser(): Observable<Users> {
    return this.httpclient.get<Users>(
      `${environment.apiUrl}/auth/me`,
      { withCredentials: true }
    );
  }

  /**
   * El guard usa al backend como fuente de verdad.
   * sessionStorage/localStorage NO determinan si existe una sesión válida.
   */
  isLoggedIn(): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  logout(): Observable<void> {
    return this.httpclient.post<void>(
      `${environment.apiUrl}/auth/logout`,
      {},
      { withCredentials: true }
    );
  }

  /** Debe estar autorizado como ADMIN en el backend. */
  getAllUsers(): Observable<Users[]> {
    return this.httpclient.get<Users[]>(
      `${environment.apiUrl}/usuarios`,
      { withCredentials: true }
    );
  }

  /** El backend debe rechazar usernames/emails/ruts duplicados (409). */
  postUsuario(newUsuario: NewUser): Observable<Users> {
    return this.httpclient.post<Users>(
      `${environment.apiUrl}/usuarios`,
      newUsuario,
      { withCredentials: true }
    );
  }

  /** Actualiza únicamente campos editables del perfil autenticado. */
  actualizarMiPerfil(data: UpdateUserProfile): Observable<Users> {
    return this.httpclient.put<Users>(
      `${environment.apiUrl}/usuarios/me`,
      data,
      { withCredentials: true }
    );
  }

  recoverPassword(email: string): Observable<any> {
    return this.httpclient.post(
      `${environment.apiUrl}/recover-password`,
      { email },
      { withCredentials: true }
    );
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.httpclient.post(
      `${environment.apiUrl}/reset-password`,
      { token, newPassword },
      { withCredentials: true }
    );
  }
}
