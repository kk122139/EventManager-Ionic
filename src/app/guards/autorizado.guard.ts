import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AutorizadoGuard {

  constructor(
    private authservice: AuthService,
    private toast: ToastController,
    private router: Router
  ) { }

  canActivate(): Observable<boolean | UrlTree> {
    return this.authservice.isLoggedIn().pipe(
      map((loggedIn) => {
        if (loggedIn) {
          return true;
        }

        this.showToast('Debe iniciar sesión.');
        return this.router.createUrlTree(['/inicio']);
      })
    );
  }

  private async showToast(msg: string) {
    const toast = await this.toast.create({
      message: msg,
      duration: 3000
    });
    await toast.present();
  }
}
