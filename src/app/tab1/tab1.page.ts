import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UpdateUserProfile, Users } from 'src/interfaces/users';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false
})
export class Tab1Page implements OnInit {

  usuario: Users | null = null;
  updateForm: FormGroup;

  constructor(
    private auth: AuthService,
    private alertcontroller: AlertController,
    private router: Router,
    private fBuilder: FormBuilder
  ) {
    this.updateForm = this.fBuilder.group({
      username: new FormControl('', [Validators.required, Validators.minLength(6)]),
      pnombre: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)]),
      apellido: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)]),
      rut: new FormControl('', [Validators.required, Validators.pattern(/^\d{7,8}$/)]),
      carrera: new FormControl('', [Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]*$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  ngOnInit() {
    this.auth.getCurrentUser().subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.updateForm.patchValue({
          username: usuario.username,
          pnombre: usuario.pnombre,
          apellido: usuario.apellido,
          rut: usuario.rut,
          carrera: usuario.carrera,
          email: usuario.email,
        });
      },
      error: () => this.router.navigate(['/inicio'])
    });
  }

  async updatUsuario() {
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }

    const alert = await this.alertcontroller.create({
      header: 'Actualización',
      mode: 'ios',
      cssClass: 'alertHeader',
      message: '¿Estás seguro que deseas actualizar la información?',
      buttons: [
        {
          text: 'Sí',
          role: 'confirm',
          handler: () => this.editarUsuario(),
        },
        { text: 'No', role: 'cancel' },
      ],
    });
    await alert.present();
  }

  editarUsuario() {
    const data: UpdateUserProfile = {
      username: this.updateForm.value.username,
      pnombre: this.updateForm.value.pnombre,
      apellido: this.updateForm.value.apellido,
      rut: Number(this.updateForm.value.rut),
      carrera: this.updateForm.value.carrera,
      email: this.updateForm.value.email,
    };

    // No enviamos password, isactive, role ni id desde el formulario.
    this.auth.actualizarMiPerfil(data).subscribe({
      next: () => this.msgEdit(),
      error: () => this.msgError(),
    });
  }

  async msgEdit() {
    const alert = await this.alertcontroller.create({
      mode: 'ios',
      message: 'Se ha cambiado la información de tu perfil con éxito.',
      cssClass: 'alertHeader',
      header: 'Modificación de Perfil',
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          handler: () => this.router.navigate(['/tabs/tab2']),
        },
      ],
    });
    await alert.present();
  }

  async msgError() {
    const alert = await this.alertcontroller.create({
      header: 'Error',
      message: 'No fue posible actualizar el perfil.',
      buttons: ['OK']
    });
    await alert.present();
  }
  async cerrarSesion() {
    const alert = await this.alertcontroller.create({
      header: 'Cerrar sesión',
      message: '¿Deseas cerrar tu sesión?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Cerrar sesión',
          role: 'confirm',
          handler: () => {
            this.auth.logout().subscribe({
              next: () => this.router.navigateByUrl('/inicio', { replaceUrl: true }),
              error: () => this.msgLogoutError(),
            });
          },
        },
      ],
    });
    await alert.present();
  }

  async msgLogoutError() {
    const alert = await this.alertcontroller.create({
      header: 'Error',
      message: 'No fue posible cerrar la sesión. Inténtalo nuevamente.',
      buttons: ['OK'],
    });
    await alert.present();
  }

}
