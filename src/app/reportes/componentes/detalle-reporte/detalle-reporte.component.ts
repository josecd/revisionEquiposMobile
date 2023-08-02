import { OverlayEventDetail } from '@ionic/core/components';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonModal, LoadingController, ModalController } from '@ionic/angular';
import { ReportesService } from '../../services/reportes.service';
import { SignatureComponent } from 'src/app/shared/signature/signature/signature.component';
import { UsuarioService } from 'src/app/usuarios/usuario.service';
import { AgregarImagenObservacionComponent } from '../agregar-imagen-observacion/agregar-imagen-observacion.component';
import { CrearObservacionComponent } from '../crear-observacion/crear-observacion.component';
import { DetalleObservacionComponent } from '../detalle-observacion/detalle-observacion.component';
import { Browser } from '@capacitor/browser';
import { ImageModalPage } from 'src/app/shared/image-modal/image-modal.page';
import { IonicSlides } from '@ionic/angular';
import Swiper from 'swiper';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-detalle-reporte',
  templateUrl: './detalle-reporte.component.html',
  styleUrls: ['./detalle-reporte.component.scss'],
})
export class DetalleReporteComponent implements OnInit {
  @Input() data: any;
  reporte: any;
  @ViewChild(IonModal) modal: IonModal;

  //zoom img
  zoomActive = false;
  zoomScale = 1;

  @ViewChild('swipper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper

  editable: boolean = true;
  loading: boolean = true;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  recomendacion:any;

  usuario:any;
  constructor(
    public modalCtrl: ModalController,
    private _reportes: ReportesService,
    private _usuario: UsuarioService,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private changeDetectorRef: ChangeDetectorRef,
    private _auth: AuthenticationService
  ) { }

  ngOnInit() {
    this.getReporte();
    //idreporte
    // this.data['idReporte'].toString()
   this._auth.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user) => {
        this.usuario = user;
      });
  }

  handleRefresh(event: any) {
    this.reporte = null;
    this._reportes.getReporteID(this.data['idReporte'].toString()).subscribe({
      next: (data: any) => {
        this.reporte = data[0]
        this.loading = false;
        if (this.reporte['firmas'].length >= 3) {
          this.editable = false;
        }
      },
      error(err) { },
    });
  }


  getReporte() {
    this.reporte = null
    this._reportes.getReporteID(this.data['idReporte'].toString()).subscribe({
      next: (data: any) => {
        this.reporte = data[0]
        this.loading = false;
        if (this.reporte['firmas'].length >= 3) {
          this.editable = false;
        }
        if (this.reporte.recomendaciones) {
          this.recomendacion = this.reporte.recomendaciones
        }
      },
      error(err) { },
    });
  }

  async agregarFoto(dataInfo: any) {
    const modal = await this.modalCtrl.create({
      component: DetalleObservacionComponent,
      componentProps: { idObservacion: dataInfo['idObservacion'] ,editable:this.editable}
    })
    modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (data) {
      this.handleRefresh(true)
    }
  }



  async openModalFirma() {
    const modal = await this.modalCtrl.create({
      component: SignatureComponent,
      componentProps: { idReporte: this.data['idReporte'].toString() }
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (data) {
      let formData = new FormData();
      formData.append('reporteId', this.data['idReporte'].toString());
      formData.append('file', data.img);
      formData.append('tipo', data.type);
      formData.append('nombreFirma', data.nombreFirma);
      this._usuario.enviarFirma(formData).subscribe(res => {
        this.getReporte()
      })
    } else {
    }

  }


  async openModalObservacion() {

    const modal = await this.modalCtrl.create({
      component: CrearObservacionComponent,
      componentProps: { idReporte: this.data['idReporte'].toString(), editM:false }
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (data) {
      this.getReporte()

    } else {
    }

  }


  async deleteImg(item: any) {
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

            this._reportes.eliminarImgObsevacion(item).subscribe({
              next: (data) => {
                loading.dismiss();
                this.getReporte();
              },
              error(err) { },
            });
          },
        },
      ],
    });

    await alert.present();
  }


  async deleteFirma(item: any) {
    const alert = await this.alertController.create({
      header: "Alerta",
      message: "¿Desea eliminar firma?",
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
              message: 'Borrando firma...',
            });
            loading.present();

            this._reportes.eliminarFirma(item).subscribe({
              next: (data) => {
                loading.dismiss();
                this.getReporte();
              },
              error(err) { },
            });
          },
        },
      ],
    });

    await alert.present();
  }



  return() {
    // this.modalCtrl.dismiss(this.imgFile, "return");
    this.modalCtrl.dismiss();
  }

  async exportPDf() {
    await Browser.open({ url: environment.API_URL +'/reportes/pdf/view/' + this.data['idReporte'].toString() });
  }

  async exportPDf2() {
    await Browser.open({ url: environment.API_URL +`/reportes/${this.data['idReporte'].toString()}/pdfReporte`});
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

  async touchEnd(zoomslides: any, card: any) {
    // Zoom back to normal
    const slider = await zoomslides.getSwiper();
    const zoom = slider.zoom;
    zoom.out();

    // Card back to normal
    card.el.style['z-index'] = 9;

    this.zoomActive = false;
    this.changeDetectorRef.detectChanges();
  }

  touchStart(card: any) {
    // Make card appear above backdrop
    card.el.style['z-index'] = 11;
  }


  chage(event: any) {
    console.log(event);

  }

  swiperReady() {
    this.swiper = this.swiperRef?.nativeElement.Swiper;
  }

  goNext() {
    this.swiper?.slideNext();
  }

  openmodal(){

  }

  cancel() {
    this.recomendacion = ''
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.recomendacion, 'confirm');
  }
  async onWillDismiss(event: Event) {


    const ev = event as CustomEvent<OverlayEventDetail<string>>;

    if (ev.detail.role === 'confirm') {
      const loading = await this.loadingCtrl.create({
        message: 'Guardando información...',
      });
      loading.present();
  
      const data = {
        "recomendaciones": ev.detail.data,
      }
      this._reportes.editarRecomendacion(this.data['idReporte'].toString(),data).subscribe({
        next:(value)=> {
          loading.dismiss();
          this.getReporte()
        },
         error:async (err)=> {
          loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Alerta',
            subHeader: 'Intente más tarde',
            message: 'Ha ocurrido un error',
            buttons: ['OK'],
          });
          await alert.present();

        },
      })
      this.recomendacion = `${ev.detail.data}`;
    }
  }

}
