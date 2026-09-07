import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  constructor(
    private authservice: AuthService,
    private router: Router,
    private toast: ToastController,
    private alertcontroller: AlertController,
    private builder: FormBuilder
  ) {
    this.loginForm = this.builder.group({
      username: new FormControl('', [Validators.required, Validators.minLength(6)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
  }

  ngOnInit() { }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
    };

    this.authservice.login(credentials).subscribe({
      next: (resp) => {
        this.loginForm.reset();
        this.showToast(`Sesión iniciada ${resp.user.username}`);
        this.router.navigate(['/tabs/tab2']);
      },
      error: (err) => {
        // No revelamos si el username existe o si falló solo la contraseña.
        if (err.status === 403) {
          this.usuarioInactivo();
          return;
        }
        this.errorCredenciales();
      }
    });
  }

  async showToast(msg: string) {
    const toast = await this.toast.create({
      message: msg,
      duration: 3000
    });
    await toast.present();
  }

  async usuarioInactivo() {
    const alerta = await this.alertcontroller.create({
      header: 'Usuario inactivo',
      message: 'Contactar a admin@admin.cl',
      buttons: ['OK']
    });
    await alerta.present();
  }

  async errorCredenciales() {
    const alerta = await this.alertcontroller.create({
      header: 'No se pudo iniciar sesión',
      message: 'Usuario o contraseña incorrectos.',
      buttons: ['OK']
    });
    await alerta.present();
  }

  Registrar() {
    this.router.navigate(['/register']);
  }
}
