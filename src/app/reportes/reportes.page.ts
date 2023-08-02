import { Component, Input, NgZone, OnDestroy, OnInit } from "@angular/core";
import { PluginListenerHandle } from "@capacitor/core";
import { ScreenOrientation } from "@capawesome/capacitor-screen-orientation";
import { AlertController, LoadingController, ModalController, Platform, PopoverController } from "@ionic/angular";
import { ReportesService } from "./services/reportes.service";
import { BehaviorSubject } from "rxjs";
import { SignatureComponent } from "../shared/signature/signature/signature.component";
import { DetalleReporteComponent } from "./componentes/detalle-reporte/detalle-reporte.component";
import { CrearReporteComponent } from "./componentes/crear-reporte/crear-reporte.component";
import { Browser } from '@capacitor/browser';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { FiltrosReportesComponent } from "../shared/filtros-reportes/filtros-reportes.component";
import * as moment from 'moment-timezone';

@Component({
  selector: "app-reportes",
  templateUrl: "./reportes.page.html",
  styleUrls: ["./reportes.page.scss"],
})
export class ReportesPage implements OnInit {
  public currentOrientation = "";
  reportesList: any = [];
  loading: boolean = true;
  lists: any[] = [];
  page = 0;
  perPage = 10;
  array: any[] = [];
  dattemp = []
  items = [];
  count: number = 0;

  hoteles:'';
  mes: any;
  anio: any
  constructor(
    private readonly platform: Platform,
    private readonly ngZone: NgZone,
    private _reporte: ReportesService,
    public modalCtrl: ModalController,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private popCtrl: PopoverController
  ) {

  }

  handleRefresh(event: any) {
    this.lists = []
    this.array = []
    this.page = 0
    this.perPage = 10;
    const filtros: any = {
      mes: this.mes,
      anio: this.anio,
      hotel: this.hoteles
    }
    this._reporte.getReportesMobile(filtros).subscribe({
      next: async (data: any) => {
        
        this.array = data;
        this.lists = this.paginateArray();
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
    this.lists = []
    this.array = []
    this.page = 0
    this.perPage = 10;
    const filtros: any = {
      mes: this.mes,
      anio: this.anio,
      hotel: this.hoteles
    }
    this._reporte.getReportesMobile(filtros).subscribe({
      next: async (data: any) => {

        this.array = data;
        this.lists = this.paginateArray();
        this.loading = false;
        this.dattemp = data
        for (let i = 0; i < 8; i++) {
          this.items.push(this.dattemp[this.count]);
          this.count++
        }

        // if (data.length > 20) {
        //   this.items = []
        //   this.dattemp = []
        //   this.count = 0
        //   this.dattemp =data
        //   for (let i = 0; i < 5; i++) {
        //     this.items.push(this.dattemp[this.count]);
        //     this.count++
        //   }

        //   this.loading = false

        // } else {
        //   console.log("Son menos de 100");
        //   this.items = []
        //   this.dattemp = []
        //   this.count = 0

        //   this.items = data
        //   this.loading = false

        // }

      },
      error(err) { },
    });
  }

  ge(){

    for (let i = 0; i < 8; i++) {
      this.items.push(this.dattemp[this.count]);
      this.count++
    }
  }
  async openReporte(data: any) {

    const modal = await this.modalCtrl.create({
      component: DetalleReporteComponent,
      componentProps: {
        'data': data
      }
    });
    modal.present();

  }
  async openModalReportes() {

    const modal = await this.modalCtrl.create({
      component: CrearReporteComponent,
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
      message: "¿Desea eliminar imagen?",
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

            this._reporte.eliminarReporte(item.idReporte).subscribe({
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


  async exportPDf() {
    await Browser.open({ url: 'https://revisionequiposapi-production.up.railway.app/reportes/pdf/view' });
  }


  onPress(event: any) {
    console.log('press: ', event);
  }


  // onIonInfinite(ev: any) {
  //   this.reportes();
  //   setTimeout(() => {
  //     (ev as InfiniteScrollCustomEvent).target.complete();
  //   }, 500);
  // }

  loadMore(event: any) {
    setTimeout(() => {
      const array = this.paginateArray();
      this.lists = this.lists.concat(array);
      event.target.complete();
      if (array?.length < this.perPage) {
        event.target.disabled = true;
      };
    }, 1000);
  }

  paginateArray() {
    this.page++;
    return this.array.filter(
      x => x.idReporte > (this.page * this.perPage - this.perPage) && x.idReporte <= (this.page * this.perPage)
    );
  }
  onIonInfinite(ev:any) {
    this.ge();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  async _popOver(ev: any) {
    const popOver = await this.popCtrl.create({
      component: FiltrosReportesComponent,
      cssClass: 'my-popover-class',
      event: ev,
    })
    popOver.onDidDismiss().then(data=> {
      this.mes = data.data['fromPop']['mes']
      this.anio = data.data['fromPop']['anio']
      this.hoteles = data.data['fromPop']['hotel']
      this.reportes()
    })
    return await popOver.present()
  }

}
