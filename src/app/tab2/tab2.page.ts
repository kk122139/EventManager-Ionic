import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ApicrudeventosService } from '../services/apicrudeventos.service';
import { IEventos } from 'src/interfaces/IEventos';
import { Router } from '@angular/router';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss'],
    standalone: false
})
export class Tab2Page implements OnInit{

  eventos: IEventos[]=[];

  constructor(private menucontroller: MenuController, private apicrud: ApicrudeventosService, private router:Router) {}

  mostrarMenu(){
    this.menucontroller.open('first');
  }

  ngOnInit() {
    this.apicrud.getEventos().subscribe(data=>{
      this.eventos=data;
    })
  }

  buscarEvento(Observable:any){
    this.router.navigate(['/detalle'], 
      {queryParams:{evento: JSON.stringify(Observable)}})
  }

}
