import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ReportesService } from '../../services/reportes.service';
import { AlertController, IonModal, LoadingController, ModalController } from '@ionic/angular';
import { AgregarImagenObservacionComponent } from '../agregar-imagen-observacion/agregar-imagen-observacion.component';
import { OverlayEventDetail } from '@ionic/core/components';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-detalle-observacion',
  templateUrl: './detalle-observacion.component.html',
  styleUrls: ['./detalle-observacion.component.scss'],
})
export class DetalleObservacionComponent implements OnInit {
  @Input('idObservacion') idObservacion: any;
  @ViewChild(IonModal) modal: IonModal;
  idObs: any;
  informacionObs: any;
  comentario: any;
  userId: any;
  constructor(
    private _reporte: ReportesService,
    public modalCtrl: ModalController,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private storage: Storage,

  ) { }

  async ngOnInit() {
    console.log(this.idObservacion);
    const iduser = await this.storage.get('user').then(res => {
      this.userId = res['idUsuario']
    })

    this.load()
  }


  load() {
    this.informacionObs = null;
    this._reporte.getObservacion(this.idObservacion).subscribe(
      {
        next: (res) => {
          console.log(res);
          this.informacionObs = res;
        },
        error: (err) => {

        }
      }
    )
  }

  agregarComentario() {

  }

  async agregarImagen() {
    const modal = await this.modalCtrl.create({
      component: AgregarImagenObservacionComponent,
      componentProps: { idObservacion: this.idObservacion }
    })
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log(data);

    if (data) {
      console.log('si entro');
      this.load()
      // this.handleRefresh(true)
    }
  }

  handleRefresh(event: any) {
    this.informacionObs = null;
    this._reporte.getObservacion(this.idObservacion).subscribe(
      {
        next: (res) => {
          console.log(res);
          this.informacionObs = res;
        },
        error: (err) => {

        }
      }
    )
  }

  cancel() {
    this.comentario = ''
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.comentario, 'confirm');
  }

  async onWillDismiss(event: Event) {
    const loading = await this.loadingCtrl.create({
      message: 'Subiendo información...',
    });
    loading.present();



    const ev = event as CustomEvent<OverlayEventDetail<string>>;

    if (ev.detail.role === 'confirm') {
      const data = {
        "comentario": ev.detail.data,
        "userId": this.userId,
        "observacionId": this.idObservacion
      }
      console.log(data);
      this._reporte.crearComentario(data).subscribe({
        next:(value)=> {
          loading.dismiss();
          this.load()
          console.log(value);

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
      this.comentario = `${ev.detail.data}`;
    }
  }

  return() {
    // this.modalCtrl.dismiss(this.imgFile, "return");
    this.modalCtrl.dismiss();
  }
}
