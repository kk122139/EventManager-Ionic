import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false
})
export class ForgotPasswordPage {
  recoverForm: FormGroup;
  enviando = false;
  estado: 'idle' | 'success' | 'error' = 'idle';
  mensaje = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.recoverForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.recoverForm.invalid || this.enviando) {
      this.recoverForm.markAllAsTouched();
      return;
    }

    const email = String(this.recoverForm.value.email ?? '').trim();
    this.enviando = true;
    this.estado = 'idle';
    this.mensaje = '';

    this.authService.recoverPassword(email).subscribe({
      next: () => {
        // Respuesta deliberadamente genérica: no revela si el correo existe.
        this.estado = 'success';
        this.mensaje = 'Solicitud enviada. Si el correo está registrado, recibirás un mensaje con un token para restablecer tu contraseña. Revisa también Spam.';
        this.recoverForm.reset();
        this.enviando = false;
      },
      error: (err: HttpErrorResponse) => {
        this.estado = 'error';
        this.enviando = false;

        if (err.status === 429) {
          this.mensaje = 'Has realizado demasiados intentos. Espera unos minutos antes de volver a solicitar el correo.';
          return;
        }

        if (err.status === 503) {
          this.mensaje = 'El servicio de correo no está configurado o no está disponible en este momento.';
          return;
        }

        this.mensaje = err.error?.message || 'No se pudo enviar la solicitud de recuperación. Inténtalo nuevamente.';
      },
    });
  }
}
