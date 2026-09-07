import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NewUser } from 'src/interfaces/users';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {

  registroForm: FormGroup;

  constructor(
    private authservice: AuthService,
    private alertcontroller: AlertController,
    private router: Router,
    private fBuilder: FormBuilder
  ) {
    this.registroForm = this.fBuilder.group({
      username: new FormControl('', [Validators.required, Validators.minLength(6)]),
      pnombre: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)]),
      apellido: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)]),
      rut: new FormControl('', [Validators.required, Validators.pattern(/^\d{7,8}$/)]),
      carrera: new FormControl('', [Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]*$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
      ]),
    });
  }

  ngOnInit() { }

  crearUsuario() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    const nuevoUsuario: NewUser = {
      username: this.registroForm.value.username,
      password: this.registroForm.value.password,
      email: this.registroForm.value.email,
      pnombre: this.registroForm.value.pnombre,
      apellido: this.registroForm.value.apellido,
      carrera: this.registroForm.value.carrera,
      rut: Number(this.registroForm.value.rut),
    };

    // isactive/role NO se envían: son decisión exclusiva del backend.
    this.authservice.postUsuario(nuevoUsuario).subscribe({
      next: () => {
        this.registroForm.reset();
        this.mostrarMensaje(nuevoUsuario.username);
        this.router.navigateByUrl('/inicio');
      },
      error: (err) => {
        if (err.status === 409) {
          this.errorDuplicidad();
          return;
        }
        this.errorRegistro();
      }
    });
  }

  async mostrarMensaje(username: string) {
    const alerta = await this.alertcontroller.create({
      header: 'Usuario creado',
      message: 'Bienvenid@! ' + username,
      buttons: ['OK']
    });
    await alerta.present();
  }

  async errorDuplicidad() {
    const alerta = await this.alertcontroller.create({
      header: 'Error',
      message: 'El usuario, correo o RUT ya está registrado.',
      buttons: ['OK']
    });
    await alerta.present();
  }

  async errorRegistro() {
    const alerta = await this.alertcontroller.create({
      header: 'Error',
      message: 'No fue posible crear la cuenta.',
      buttons: ['OK']
    });
    await alerta.present();
  }
}
