import { Component, Input, NgZone, OnDestroy, OnInit } from "@angular/core";
import { PluginListenerHandle } from "@capacitor/core";
import { ScreenOrientation } from "@capawesome/capacitor-screen-orientation";
import { ModalController, Platform } from "@ionic/angular";
import { ReportesService } from "./services/reportes.service";
import { BehaviorSubject } from "rxjs";
import { SignatureComponent } from "../shared/signature/signature/signature.component";
import { DetalleReporteComponent } from "./componentes/detalle-reporte/detalle-reporte.component";

@Component({
  selector: "app-reportes",
  templateUrl: "./reportes.page.html",
  styleUrls: ["./reportes.page.scss"],
})
export class ReportesPage implements OnInit {
  public currentOrientation = "";

  reportesList:any;
  constructor(
    private readonly platform: Platform,
    private readonly ngZone: NgZone,
    private _reporte: ReportesService,
    public modalCtrl:ModalController
  ) {

  }

  public ngOnInit() {
    this.reportes();
  }

  public ngOnDestroy() {
  }

  //GetReportes
  reportes() {
    console.log('Estoy entrando');
    
    this._reporte.getReportes().subscribe({
      next: (data) => {
        this.reportesList = data
        console.log(data);
      },
      error(err) {},
    });
  }

  async openReporte(data:any){
    console.log('Reporte', data);
    
    const modal = await this.modalCtrl.create({
      component: DetalleReporteComponent,
      componentProps: {
        'data': data
      }
    });
    modal.present();

  }

  
}
