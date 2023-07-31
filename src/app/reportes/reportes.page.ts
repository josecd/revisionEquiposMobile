import { Component, Input, NgZone, OnDestroy, OnInit } from "@angular/core";
import { PluginListenerHandle } from "@capacitor/core";
import { ScreenOrientation } from "@capawesome/capacitor-screen-orientation";
import { AlertController, LoadingController, ModalController, Platform } from "@ionic/angular";
import { ReportesService } from "./services/reportes.service";
import { BehaviorSubject } from "rxjs";
import { SignatureComponent } from "../shared/signature/signature/signature.component";
import { DetalleReporteComponent } from "./componentes/detalle-reporte/detalle-reporte.component";
import { CrearReporteComponent } from "./componentes/crear-reporte/crear-reporte.component";
import { Browser } from '@capacitor/browser';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

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

  constructor(
    private readonly platform: Platform,
    private readonly ngZone: NgZone,
    private _reporte: ReportesService,
    public modalCtrl: ModalController,
    private alertController: AlertController,
    private loadingCtrl: LoadingController

  ) {

  }

  handleRefresh(event: any) {

    this.lists = []
    this.array = []
    this.page = 0
    this.perPage = 10;
    this._reporte.getReportes().subscribe({
      next: async (data: any) => {
        console.log(data);
        
        this.array = data;
        this.lists = this.paginateArray();
        this.loading = false;
        event.target.complete();
      },
      error(err) { },
    });
  }

  public ngOnInit() {
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
    this._reporte.getReportes().subscribe({
      next: async (data: any) => {
        console.log(data);

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


}
