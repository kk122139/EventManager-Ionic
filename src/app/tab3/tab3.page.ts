import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController } from '@ionic/angular';
import { ApicrudeventosService } from '../services/apicrudeventos.service';
import { IEventos } from 'src/interfaces/IEventos';
import { Router } from '@angular/router';
import {
  CapacitorBarcodeScanner,
  CapacitorBarcodeScannerTypeHint,
} from '@capacitor/barcode-scanner';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false
})
export class Tab3Page implements OnInit {

  eventos: IEventos[] = [];
  scanning = false;

  constructor(
    private menucontroller: MenuController,
    private apicrud: ApicrudeventosService,
    private router: Router,
    private alert: AlertController
  ) { }

  ngOnInit() {
    this.cargarEventos();
  }

  cargarEventos() {
    this.apicrud.getEventos().subscribe({
      next: (data) => this.eventos = data,
      error: () => this.showAlert('Error', 'No fue posible cargar los eventos.')
    });
  }

  editarEvento(evento: IEventos) {
    this.router.navigate(['/editevent'], {
      queryParams: { eventId: evento.id },
    });
  }

  listaAsistentes(evento: IEventos) {
    this.router.navigate(['/asistentes'], {
      queryParams: { eventId: evento.id },
    });
  }

  comentarios(evento: IEventos) {
    this.router.navigate(['/comentarios'], {
      queryParams: { eventId: evento.id },
    });
  }

  async scanearQR() {
    if (this.scanning) return;
    this.scanning = true;

    try {
      const resultado = await CapacitorBarcodeScanner.scanBarcode({
        hint: CapacitorBarcodeScannerTypeHint.QR_CODE,
        scanInstructions: 'Alinea el código QR dentro del marco',
        scanButton: false,
        web: {
          showCameraSelection: true,
        },
      });

      const token = resultado.ScanResult?.trim();

      if (!token) {
        await this.showAlert('QR inválido', 'No se encontró contenido en el código escaneado.');
        return;
      }

      if (token.length < 20 || token.length > 2048) {
        await this.showAlert('QR inválido', 'El código escaneado no tiene un formato válido.');
        return;
      }

      const confirmacion = await this.alert.create({
        header: 'Código escaneado',
        message: '¿Deseas validar y registrar este código?',
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Registrar',
            handler: () => {
              this.apicrud.registrarQrToken(token).subscribe({
                next: (response) => {
                  const detalle = response?.message || 'El QR fue registrado correctamente.';
                  this.showAlert('Éxito', detalle);
                },
                error: () => {
                  this.showAlert('Error', 'El QR no es válido, expiró o ya fue utilizado.');
                }
              });
            },
          }
        ]
      });

      await confirmacion.present();
    } catch (error) {
      await this.showAlert(
        'Escaneo cancelado',
        'No se pudo completar el escaneo. Comprueba el permiso de cámara e inténtalo nuevamente.'
      );
    } finally {
      this.scanning = false;
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alert.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
