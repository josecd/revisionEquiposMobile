import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { InventarioService } from 'src/app/inventario/services/inventario.service';
import { CrearParteComponent } from '../crear-parte/crear-parte.component';
import { ImageModalPage } from 'src/app/shared/image-modal/image-modal.page';

@Component({
  selector: 'app-detalle-inventario',
  templateUrl: './detalle-inventario.component.html',
  styleUrls: ['./detalle-inventario.component.scss'],
})
export class DetalleInventarioComponent implements OnInit {
  @Input() data: any;

  inveDetalle: any;

  constructor(
    private _inventario: InventarioService,
    public modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    console.log(this.data);

    this.getInventario()
  }

  getInventario() {
    this._inventario.getInventarioID(this.data['idInventario']).subscribe({
      next: async (data: any) => {

        this.inveDetalle = data;
        console.log(data);
      },
      error(err) {
        console.log(err);

      },
    })
  }

  handleRefresh(event: any) {
    this.inveDetalle = null;
    this._inventario.getInventarioID(this.data['idInventario']).subscribe({
      next: async (data: any) => {
        this.inveDetalle = data;
        console.log(data);
      },
      error(err) {
        console.log(err);

      },
    })
  }


  async openImg() {
    const modal = await this.modalCtrl.create({
      component: CrearParteComponent,
      componentProps: {
        'idInventario': this.data['idInventario']
      }
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (data) {
      this.getInventario()

    } else {
      console.log(data);
    }
  }


  return() {
    this.modalCtrl.dismiss();
  }

  async openPreview(img: any) {
    const modal = await this.modalCtrl.create({
      component: ImageModalPage,
      cssClass: 'transparent-modal',
      componentProps: {
        img
      }
    });
    modal.present();
  }

}
