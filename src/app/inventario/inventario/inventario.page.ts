import { Component, Input, NgZone, OnDestroy, OnInit } from "@angular/core";
import { AlertController, LoadingController, ModalController, Platform, PopoverController } from "@ionic/angular";
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import * as moment from 'moment-timezone';
import { InventarioService } from "../services/inventario.service";
import { DetalleInventarioComponent } from "./componentes/detalle-inventario/detalle-inventario.component";
import { CrearInventarioComponent } from "./componentes/crear-inventario/crear-inventario.component";

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit {
  array: any[] = [];
  loading: boolean = true;

  hoteles:'';
  mes: any;
  anio: any
  constructor(
    public modalCtrl: ModalController,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    /////
    private _inventario: InventarioService
  ) {

  }

  handleRefresh(event: any) {
    this.loading = true 
    this._inventario.getInventario().subscribe({
      next: async (data: any) => {
        this.array = data;
        this.loading = false;
        event.target.complete();
      },
      error(err) { },
    });
  }

  public ngOnInit() {
    this.mes = moment().month()+1;
    this.anio = moment().year();
    this.reportes();
  }

  public ngOnDestroy() {
  }

  //GetReportes
  reportes() {
    this._inventario.getInventario().subscribe({
      next: async (data: any) => {
        this.array = data;
        this.loading = false;
      },
      error(err) { },
    });
  }


  async openReporte(data: any) {

    const modal = await this.modalCtrl.create({
      component: DetalleInventarioComponent,
      componentProps: {
        'data': data
      }
    });
    modal.present();

  }
  async openModalAddInventario() {

    const modal = await this.modalCtrl.create({
      component: CrearInventarioComponent,
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (data) {
      this.reportes()

    } else {
      console.log(data);
    }

  }

  async deleteReporte(item: any) {

    const alert = await this.alertController.create({
      header: "Alerta",
      message: "¿Desea eliminar?",
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          handler: () => {
            console.log("Declined the offer");
          },
        },
        {
          text: "Aceptar",
          handler: async () => {
            const loading = await this.loadingCtrl.create({
              message: 'Borrando imagen...',
            });
            loading.present();

            this._inventario.eliminarInventario(item.idInventario).subscribe({
              next: (data) => {
                loading.dismiss();
                this.reportes();
              },
              error(err) { },
            });
          },
        },
      ],
    });

    await alert.present();
  }




  
  onIonInfinite(ev:any) {
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }


}
