import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ReportesService } from '../../services/reportes.service';
import { SignatureComponent } from 'src/app/shared/signature/signature/signature.component';
import { UsuarioService } from 'src/app/usuarios/usuario.service';
import { AgregarImagenObservacionComponent } from '../agregar-imagen-observacion/agregar-imagen-observacion.component';
import { CrearObservacionComponent } from '../crear-observacion/crear-observacion.component';

@Component({
  selector: 'app-detalle-reporte',
  templateUrl: './detalle-reporte.component.html',
  styleUrls: ['./detalle-reporte.component.scss'],
})
export class DetalleReporteComponent  implements OnInit {
  @Input() data:any;
  reporte:any;
  constructor(
    public modalCtrl: ModalController,
    private _reportes: ReportesService,
    private _usuario: UsuarioService,
    private alertController: AlertController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.getReporte();
    //idreporte
    // this.data['idReporte'].toString()
    
  }

  handleRefresh(event:any) {
    this.reporte = null;
    this._reportes.getReporteID(this.data['idReporte'].toString()).subscribe({
      next: (data:any) => {
        this.reporte = data[0]
      },
      error(err) {},
    });
  }


  getReporte(){
    console.log('Si hago busqueda');
    
    this.reporte = null
    this._reportes.getReporteID(this.data['idReporte'].toString()).subscribe({
      next: (data:any) => {
        this.reporte = data[0]
      },
      error(err) {},
    });
  }

  async agregarFoto(dataInfo:any){
    const modal = await this.modalCtrl.create({
      component: AgregarImagenObservacionComponent,
      componentProps:{idObservacion:dataInfo['idObservacion']}
    })
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log(data);
    
    if (data) {
      console.log('si entro');
      this.handleRefresh(true)
    }
  }



  async openModalFirma() {
    const modal = await this.modalCtrl.create({
      component: SignatureComponent,
      componentProps:{idReporte:this.data['idReporte'].toString()}
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (data) {
      let formData = new FormData();
      formData.append('reporteId',this.data['idReporte'].toString());
      formData.append('file',data.img);
      formData.append('tipo',data.type);  
      formData.append('nombreFirma',data.nombreFirma);  


      this._usuario.enviarFirma(formData).subscribe(res=>{
        this.getReporte()
      })
    }else{
      console.log(data);
    }

  }


  async openModalObservacion() {
    console.log(this.data['idReporte'].toString());
    
    const modal = await this.modalCtrl.create({
      component: CrearObservacionComponent,
      componentProps:{idReporte:this.data['idReporte'].toString()}
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (data) {
      this.getReporte()

    }else{
      console.log(data);
    }

  }


 async  deleteImg(item:any){
  console.log(item);
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
              error(err) {},
            });
          },
        },
      ],
    });
  
    await alert.present();
  }

  
 async  deleteFirma(item:any){
  console.log(item);
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
              error(err) {},
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
}
