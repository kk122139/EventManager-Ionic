import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ApicrudeventosService } from '../services/apicrudeventos.service';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { IEvento, IEventos } from 'src/interfaces/IEventos';

@Component({
  selector: 'app-editevent',
  templateUrl: './editevent.page.html',
  styleUrls: ['./editevent.page.scss'],
  standalone: false
})
export class EditeventPage implements OnInit {

  evento: IEventos = {
    id: '', nombre: '', lugar: '', cupos: 0, fecha: '', anfitrion: '', portada: '', descripcion: '',
    asistentes: [], comentarios: []
  };
  updateForm: FormGroup;
  procesandoImagen = false;

  constructor(
    private alertcontroller: AlertController,
    private activated: ActivatedRoute,
    private apicrud: ApicrudeventosService,
    private router: Router,
    private fBuilder: FormBuilder
  ) {
    this.updateForm = this.fBuilder.group({
      nombre: new FormControl('', [Validators.required]),
      lugar: new FormControl('', [Validators.required]),
      cupos: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
      fecha: new FormControl('', [Validators.required]),
      anfitrion: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required, Validators.minLength(20)]),
    });
  }

  ngOnInit() {
    const eventId = this.activated.snapshot.queryParamMap.get('eventId');
    if (!eventId) {
      this.router.navigate(['/tabs/tab3']);
      return;
    }

    this.apicrud.getEventoById(eventId).subscribe({
      next: (evento) => {
        this.evento = evento;
        this.updateForm.patchValue({
          nombre: evento.nombre,
          lugar: evento.lugar,
          cupos: evento.cupos,
          fecha: evento.fecha,
          anfitrion: evento.anfitrion,
          descripcion: evento.descripcion,
        });
      },
      error: () => this.router.navigate(['/tabs/tab3'])
    });
  }

  async updatEvento() {
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
        { text: 'Sí', role: 'confirm', handler: () => this.modificarEvento() },
        { text: 'No', role: 'cancel' },
      ],
    });
    await alert.present();
  }

  async deleteEvent() {
    const alert = await this.alertcontroller.create({
      header: 'Eliminación',
      mode: 'ios',
      cssClass: 'alertHeader',
      message: '¿Estás segur@ que deseas cancelar el evento?',
      buttons: [
        { text: 'Sí', role: 'confirm', handler: () => this.eliminaEvento() },
        { text: 'No', role: 'cancel' },
      ],
    });
    await alert.present();
  }

  eliminaEvento() {
    this.apicrud.deleteEventos(this.evento.id).subscribe({
      next: () => this.msgDelete(),
      error: () => this.msgError('No fue posible eliminar el evento.')
    });
  }

  modificarEvento() {
    const data: Partial<IEvento> = {
      nombre: this.updateForm.value.nombre,
      lugar: this.updateForm.value.lugar,
      cupos: Number(this.updateForm.value.cupos),
      fecha: this.updateForm.value.fecha,
      anfitrion: this.updateForm.value.anfitrion,
      descripcion: this.updateForm.value.descripcion,
      portada: this.evento.portada || '',
    };

    this.apicrud.putEventos(this.evento.id, data).subscribe({
      next: () => {
        this.updateForm.reset();
        this.msgEdit();
      },
      error: () => this.msgError('No fue posible actualizar el evento.')
    });
  }

  async msgDelete() {
    const alert = await this.alertcontroller.create({
      header: 'Eliminación',
      mode: 'ios',
      cssClass: 'alertHeader',
      message: 'El evento ha sido eliminado',
      buttons: [{ text: 'Ok', role: 'confirm', handler: () => this.router.navigate(['/tabs/tab3']) }],
    });
    await alert.present();
  }

  async msgEdit() {
    const alert = await this.alertcontroller.create({
      mode: 'ios',
      message: 'Has editado el evento con éxito.',
      cssClass: 'alertHeader',
      header: 'Evento Editado',
      buttons: [{ text: 'OK', role: 'confirm', handler: () => this.router.navigate(['/tabs/tab3']) }],
    });
    await alert.present();
  }

  async msgError(message: string) {
    const alert = await this.alertcontroller.create({
      header: 'Error',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
  async seleccionarPortada(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      input.value = '';
      await this.msgError('Selecciona una imagen JPG, PNG o WebP de máximo 5 MB.');
      return;
    }

    this.procesandoImagen = true;
    try {
      const portada = await this.comprimirImagen(file);
      if (portada.length > 900000) throw new Error('Imagen demasiado grande');
      this.evento.portada = portada;
    } catch {
      input.value = '';
      await this.msgError('No fue posible procesar la portada. Prueba con una imagen más pequeña.');
    } finally {
      this.procesandoImagen = false;
    }
  }

  quitarPortada() {
    this.evento.portada = '';
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
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Canvas no disponible'));
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.78));
        };
        img.src = String(reader.result);
      };
      reader.readAsDataURL(file);
    });
  }

}
