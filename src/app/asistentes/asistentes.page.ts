import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApicrudeventosService } from '../services/apicrudeventos.service';
import { IEventos } from 'src/interfaces/IEventos';

@Component({
  selector: 'app-asistentes',
  templateUrl: './asistentes.page.html',
  styleUrls: ['./asistentes.page.scss'],
  standalone: false
})
export class AsistentesPage implements OnInit {

  evento: IEventos = {
    id: '', nombre: '', lugar: '', cupos: 0, fecha: '', anfitrion: '', descripcion: '',
    asistentes: [], comentarios: []
  };

  constructor(
    private activated: ActivatedRoute,
    private router: Router,
    private apicrud: ApicrudeventosService
  ) { }

  ngOnInit() {
    const eventId = this.activated.snapshot.queryParamMap.get('eventId');
    if (!eventId) {
      this.router.navigate(['/tabs/tab3']);
      return;
    }

    this.apicrud.getEventoById(eventId).subscribe({
      next: (evento) => this.evento = evento,
      error: () => this.router.navigate(['/tabs/tab3'])
    });
  }
}
