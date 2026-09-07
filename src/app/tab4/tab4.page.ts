import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApicrudeventosService } from '../services/apicrudeventos.service';
import { IEvento } from 'src/interfaces/IEventos';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: false
})
export class Tab4Page implements OnInit {

  newEventForm: FormGroup;
  portadaBase64 = '';
  procesandoImagen = false;

  evento: IEvento = {
    nombre: '',
    lugar: '',
    cupos: 0,
    fecha: '',
    anfitrion: '',
    descripcion: '',
    asistentes: [],
    comentarios: []
  };

  constructor(
    private alertcontroller: AlertController,
    private apicrud: ApicrudeventosService,
    private router: Router,
    private fbuilder: FormBuilder
  ) {
    this.newEventForm = this.fbuilder.group({
      nombre: new FormControl('', [Validators.required]),
      lugar: new FormControl('', [Validators.required]),
      cupos: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
      fecha: new FormControl('', [Validators.required]),
      anfitrion: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required, Validators.minLength(20)]),
    });
  }

  ngOnInit() { }

  crearEvento() {
    if (this.newEventForm.invalid) {
      this.newEventForm.markAllAsTouched();
      return;
    }

    const nuevoEvento: IEvento = {
      nombre: this.newEventForm.value.nombre,
      lugar: this.newEventForm.value.lugar,
      cupos: Number(this.newEventForm.value.cupos),
      fecha: this.newEventForm.value.fecha,
      anfitrion: this.newEventForm.value.anfitrion,
      descripcion: this.newEventForm.value.descripcion,
      portada: this.portadaBase64 || undefined,
      asistentes: [],
      comentarios: []
    };

    this.apicrud.postEventos(nuevoEvento).subscribe({
      next: () => {
        this.evento = nuevoEvento;
        this.newEventForm.reset();
        this.portadaBase64 = '';
        this.mensajeEvent();
      },
      error: () => this.mensajeError()
    });
  }

  async mensajeEvent() {
    const alert = await this.alertcontroller.create({
      mode: 'ios',
      message: 'El evento ' + this.evento.nombre + ' se ha creado con éxito.',
      cssClass: 'alertHeader',
      header: 'Evento creado',
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          handler: () => this.router.navigate(['/tabs/tab3']),
        },
      ],
    });
    await alert.present();
  }

  async mensajeError() {
    const alert = await this.alertcontroller.create({
      header: 'Error',
      message: 'No fue posible crear el evento.',
      buttons: ['OK']
    });
    await alert.present();
  }
  async seleccionarPortada(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      input.value = '';
      await this.mostrarErrorImagen('Usa una imagen JPG, PNG o WebP.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      input.value = '';
      await this.mostrarErrorImagen('La imagen original no puede superar 5 MB.');
      return;
    }

    this.procesandoImagen = true;
    try {
      const dataUrl = await this.comprimirImagen(file);
      if (dataUrl.length > 900000) {
        throw new Error('Imagen demasiado grande');
      }
      this.portadaBase64 = dataUrl;
    } catch {
      input.value = '';
      this.portadaBase64 = '';
      await this.mostrarErrorImagen('No fue posible procesar la imagen. Prueba con una imagen más pequeña.');
    } finally {
      this.procesandoImagen = false;
    }
  }

  quitarPortada() {
    this.portadaBase64 = '';
  }

  private comprimirImagen(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('No se pudo leer la imagen'));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('Imagen inválida'));
        img.onload = () => {
          const maxDimension = 1280;
          const scale = Math.min(1, maxDimension / img.width, maxDimension / img.height);
          const width = Math.max(1, Math.round(img.width * scale));
          const height = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas no disponible'));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.78));
        };
        img.src = String(reader.result);
      };
      reader.readAsDataURL(file);
    });
  }

  private async mostrarErrorImagen(message: string) {
    const alert = await this.alertcontroller.create({
      header: 'Portada inválida',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

}
