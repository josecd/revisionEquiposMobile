import { Component, OnInit, Input } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { ReportesService } from '../../services/reportes.service';

@Component({
  selector: 'app-ediar-comentario',
  templateUrl: './ediar-comentario.component.html',
  styleUrls: ['./ediar-comentario.component.css']
})
export class EdiarComentarioComponent implements OnInit {
  @Input('dataInfo')dataInfo: any;

  comentario:any;
  constructor(
    private loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private _reporte: ReportesService,
    private alertController: AlertController,

  ) { }

  ngOnInit() {
    console.log(this.dataInfo);
    
    this.comentario = this.dataInfo.comentario
  }


  async editar() {
      const loading = await this.loadingCtrl.create({
        message: 'Subiendo información...',
      });
      loading.present();
      const data = {
        "comentario": this.comentario,
        "observacionId": this.dataInfo.idObservacion
      }
      this._reporte.editarComentario(this.dataInfo.idObservacionComentario ,data).subscribe({
        next:(value)=> {
          loading.dismiss();
          this.return() 
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
  }

  return() {
    this.modalCtrl.dismiss()
  }
}
