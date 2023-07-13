import { Component, OnInit } from '@angular/core';
import { AgregarImagenObservacionComponent } from '../reportes/componentes/agregar-imagen-observacion/agregar-imagen-observacion.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-hoteles',
  templateUrl: './hoteles.page.html',
  styleUrls: ['./hoteles.page.scss'],
})
export class HotelesPage implements OnInit {

  constructor(
    public modalCtrl:ModalController
  ) { }

  ngOnInit() {
    console.log("PAso por aqui");
    
  }
  async openModal() {


    const modal = await this.modalCtrl.create({
      component: AgregarImagenObservacionComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

 
    
  }


}
