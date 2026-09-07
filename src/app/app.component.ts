import { ToastController, AlertController, MenuController } from '@ionic/angular';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

interface Menu {
  icon: string;
  redirecTo: string;
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false
})
export class AppComponent {

  menu: Menu[] = [
    { icon: 'planet-outline', redirecTo: '/tabs/tab2', name: 'Proximos eventos' },
    { icon: 'calendar-number-outline', redirecTo: '/tabs/tab3', name: 'Mis eventos' },
    { icon: 'walk-outline', redirecTo: '/tabs/tab1', name: 'Mi perfil' },
    { icon: 'create-outline', redirecTo: '/tabs/tab4', name: 'Crear un evento' },
    { icon: 'paw-outline', redirecTo: '/tabs/tab2', name: 'Acerca de Duoc' },
    { icon: 'settings-outline', redirecTo: '/tabs/tab2', name: 'Configuracion' },
  ];

  constructor(
    private router: Router,
    private alertcontroller: AlertController,
    private toast: ToastController,
    private menuC: MenuController,
    private authService: AuthService
  ) { }

  logOut() {
    this.authService.logout().subscribe({
      next: () => this.finalizarLogout(),
      error: () => this.finalizarLogout()
    });
  }

  private finalizarLogout() {
    this.menuC.close();
    this.router.navigateByUrl('/inicio');
    this.showToast('Hasta pronto...');
  }

  async showToast(msg: string) {
    const toast = await this.toast.create({
      message: msg,
      duration: 3000
    });
    await toast.present();
  }
}
