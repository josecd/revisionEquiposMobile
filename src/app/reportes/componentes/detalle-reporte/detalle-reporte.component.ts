import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ReportesService } from '../../services/reportes.service';
import { SignatureComponent } from 'src/app/shared/signature/signature/signature.component';
import { UsuarioService } from 'src/app/usuarios/usuario.service';
import { AgregarImagenObservacionComponent } from '../agregar-imagen-observacion/agregar-imagen-observacion.component';

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
    private _usuario: UsuarioService
  ) { }

  ngOnInit() {
    this.getReporte();
    //idreporte
    // this.data['idReporte'].toString()
    
  }

  getReporte(){
    const idRe = this.data['idReporte'].toString()
    console.log('Cargado  reporte');
        
    this._reportes.getReporteID(this.data['idReporte'].toString()).subscribe({
      next: (data:any) => {
        this.reporte = data[0]
        console.log(data);
        console.log(this.reporte['firmas'].length);
        
      },
      error(err) {},
    });
  }

  async agregarFoto(data:any){
    console.log('Informacion de la observacion',data);
    const modal = await this.modalCtrl.create({
      component: AgregarImagenObservacionComponent,
      componentProps:{info:this.data['idReporte'].toString()}
    });
    modal.present();

  }



  async openModalFirma() {
    const modal = await this.modalCtrl.create({
      component: SignatureComponent,
      componentProps:{idReporte:this.data['idReporte'].toString()}
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('Ver data info',data);
    
    if (data) {
      let formData = new FormData();
      formData.append('reporteId',this.data['idReporte'].toString());
      formData.append('file',data.img);
      formData.append('tipo',data.type);  
      formData.append('nombreFirma',data.nombreFirma);  


      this._usuario.enviarFirma(formData).subscribe(res=>{
        console.log(res);  
        this.getReporte()
      })
    }else{
      console.log(data);
    }

  }

  return() {
    // this.modalCtrl.dismiss(this.imgFile, "return");
    this.modalCtrl.dismiss();
  }
}
