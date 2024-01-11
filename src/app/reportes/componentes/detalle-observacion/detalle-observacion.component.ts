import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ReportesService } from '../../services/reportes.service';
import { AlertController, IonModal, LoadingController, ModalController } from '@ionic/angular';
import { AgregarImagenObservacionComponent } from '../agregar-imagen-observacion/agregar-imagen-observacion.component';
import { OverlayEventDetail } from '@ionic/core/components';
import { Storage } from '@ionic/storage';
import Swiper from 'swiper';
import { ImageModalPage } from 'src/app/shared/image-modal/image-modal.page';
import { CrearObservacionComponent } from '../crear-observacion/crear-observacion.component';
import * as moment from 'moment-timezone';
import { SignatureObsComponent } from 'src/app/shared/signature/signatureObs/signature.component';
import { UsuarioService } from 'src/app/usuarios/usuario.service';

@Component({
  selector: 'app-detalle-observacion',
  templateUrl: './detalle-observacion.component.html',
  styleUrls: ['./detalle-observacion.component.scss'],
})
export class DetalleObservacionComponent implements OnInit {
  @Input('idObservacion') idObservacion: any;
  @Input('editable') editable: any= true;
  
  @ViewChild(IonModal) modal: IonModal;
  idObs: any;
  informacionObs: any;
  comentario: any;
  userId: any;

  ///iamgenes
  @ViewChild('swipper')
  swiperRef:ElementRef | undefined;
  swiper?:Swiper

  //Editable
  constructor(
    private _reporte: ReportesService,
    public modalCtrl: ModalController,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private _usuario: UsuarioService,
  ) { }

  async ngOnInit() {
    const iduser = await this.storage.get('user').then(res => {
      this.userId = res['idUsuario']
    })

    this.load()
  }


  async updateForm(){
    const loading = await this.loadingCtrl.create({
      message: 'Subiendo información...',
    });
    loading.present();
    const format1 = "YYYY-MM-DD HH:mm"
    var date1 = new Date();
    this._reporte.updateObservacionReporte({fechaFinaliza:moment(date1).format(format1)},this.idObservacion).subscribe({
      next: (data:any) => {
        console.log(data);
        
        loading.dismiss();
        this.modalCtrl.dismiss(true, "msg");
      },
      error: async (err)=>{
        loading.dismiss();

        const alert = await this.alertController.create({
          header: 'Alerta',
          subHeader: 'Intente más tarde',
          message: 'Ha ocurrido un error',
          buttons: ['OK'],
        });
        await alert.present();
      },
    });
  }

  load() {
    this.informacionObs = null;
    this._reporte.getObservacion(this.idObservacion).subscribe(
      {
        next: (res) => {
          this.informacionObs = res;
          console.log(res);
          
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

    if (data) {
      this.load()
      // this.handleRefresh(true)
    }
  }

  handleRefresh(event: any) {
    this.informacionObs = null;
    this._reporte.getObservacion(this.idObservacion).subscribe(
      {
        next: (res) => {
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


    const ev = event as CustomEvent<OverlayEventDetail<string>>;

    if (ev.detail.role === 'confirm') {
      const loading = await this.loadingCtrl.create({
        message: 'Subiendo información...',
      });
      loading.present();
  

      
      const data = {
        "comentario": ev.detail.data,
        "userId": this.userId,
        "observacionId": this.idObservacion
      }
      this._reporte.crearComentario(data).subscribe({
        next:(value)=> {
          loading.dismiss();
          this.load()
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

  async  deleteImg(item:any){
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
  
              this._reporte.eliminarImgObsevacion(item).subscribe({
                next: (data) => {
                  loading.dismiss();  
                  this.load();
                },
                error(err) {},
              });
            },
          },
        ],
      });
    
      await alert.present();
    }

    swiperReady(){
      console.log('if');
      this.swiper = this.swiperRef?.nativeElement.Swiper;
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

    async openEdit(){
      const modal = await this.modalCtrl.create({
        component: CrearObservacionComponent,
        componentProps: { idReporte:  this.informacionObs.reporteId , editM:true , data:this.informacionObs,tipoReporte:this.informacionObs['tipoReporte']}
      });
      modal.present();
      const { data, role } = await modal.onWillDismiss();
      if (data) {
        this.load()
  
      } else {
      }
    }

    async verificarTexto(){
      const loading2 = await this.loadingCtrl.create({
        message: 'Consultando información...',
      });
      loading2.present();
        const datos={
          "text":this.comentario
        }
      this._reporte.textoCorreccionIA(datos).subscribe(async (res:any)=>{
        loading2.dismiss();          
        
        const alert = await this.alertController.create({
          header: "Texto Modificado",
          message: res['response'],
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
                // const loading = await this.loadingCtrl.create({
                //   message: 'Borrando imagen...',
                // });
                // loading.present();
                this.comentario = res['response']
              },
            },
          ],
        });
    
        await alert.present();
        
      })

  }
 async firmaInicioObservacion(){
  const modal = await this.modalCtrl.create({
      component: SignatureObsComponent,
      componentProps: { idObs: this.idObservacion.toString() }
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (data) {
      let formData = new FormData();
      formData.append('obsId', this.idObservacion.toString());
      formData.append('file', data.img);
      formData.append('tipo', data.type);
      formData.append('nombreFirma', data.nombreFirma);
      this._usuario.enviarFirmaObs(formData).subscribe(res => {
        this.load()
      })
    } else {
    }

  }
}
