import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ReportesService } from '../../services/reportes.service';

import { Storage } from '@ionic/storage';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-crear-observacion',
  templateUrl: './crear-observacion.component.html',
  styleUrls: ['./crear-observacion.component.scss'],
})
export class CrearObservacionComponent  implements OnInit {
  @Input("editM") editM:any;
  @Input("tipoReporte") tipoReporte:any;

  @Input("idReporte") idReporte:any;
  @Input("data") data:any;

  // form : crearObservacionDto;

  criticidad  =[
    {
      "id":'Bajo',
      "nombre":'Bajo'
    },
    {
      "id":'Alto',
      "nombre":'Alto'
    }
  ]
  criticidadSelect:any;

  ionicForm: FormGroup ;
  edit:boolean=false;

  public dialCode: string = '+1'; 
  constructor(
    public modalCtrl: ModalController,
    public formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private _reporte:ReportesService,
    private alertController: AlertController,
    private storage: Storage,
  
  ) { 

  }

  async ngOnInit() {
    this.edit= this.editM;
    console.log(this.data);
  
    if (this.editM) {
    

      this.ionicForm = this.formBuilder.group({
        equipo: [this.data?.equipo],
        marca: [this.data?.marca],
        modelo: [this.data?.modelo],
        numeroSerie: [this.data?.numeroSerie],
        area: [this.data?.area],
        observacion: [this.data?.observacion],
        reporteId:[this.idReporte],
        userId:[this.data?.userId],
        criticidad:[''],
        //Baja
        adquisicionEquipo:[this.data?.adquisicionEquipo],
        ubicacion:[this.data?.ubicacion], //igual sirve para MP&MC
        oc:[this.data?.oc],
        sapID:[this.data?.sapID],
        diagnosticoTecnico:[this.data?.diagnosticoTecnico],//igual sirve para MP&MC
        motivoDanio:[this.data?.motivoDanio],
        //matenimiento P&C
        tecEsp:[this.data?.tecEsp],
        fechaFinaliza:[this.data?.fechaFinaliza],
        fallaDetectadaDuraSer:[this.data?.fallaDetectadaDuraSer],
        comentariosEntregaEquip:[this.data?.comentariosEntregaEquip]
      });
      const data = this.data?.criticidad
      this.ionicForm.get('criticidad')?.setValue(data)
    }else{
      const format1 = "YYYY-MM-DD HH:mm"
      var date1 = new Date();
      this.ionicForm = this.formBuilder.group({
        equipo: ['',],
        marca: [''],
        modelo: ['',],
        numeroSerie: ['',],
        area: ['',],
        observacion: ['',],
        reporteId:[this.idReporte],
        userId:[''],
        criticidad:[''],
        //Baja
        adquisicionEquipo:[''],
        ubicacion:[''], //igual sirve para MP&MC
        oc:[''],
        sapID:[''],
        diagnosticoTecnico:[''],//igual sirve para MP&MC
        motivoDanio:[''],
        //matenimiento P&C
        tecEsp:[''],
        fechaInicio:this.tipoReporte == 'Mantenimiento Correctivo' || this.tipoReporte == 'Mantenimiento Preventivo'? [ moment(date1).format(format1)]:[ ''],
        fechaFinaliza:[''],
        fallaDetectadaDuraSer:[''],
        comentariosEntregaEquip:['']
      });

    }


    const iduser =  await this.storage.get('user').then(res=>{
      this.ionicForm.get('userId')?.setValue(res['idUsuario'])
     })
  }
  
  async submitForm(){
    
    if (!this.ionicForm.value['criticidad'] && this.tipoReporte == 'Recorrido') {
      const alert = await this.alertController.create({
        header: 'Alerta',
        subHeader: 'Tiene que agregar criticidad para poder guardar',
        message: 'Ha ocurrido un error',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
    const loading = await this.loadingCtrl.create({
      message: 'Subiendo información...',
    });
    loading.present();

    this._reporte.crearObservacionReporte(this.ionicForm.value).subscribe({
      next: (data:any) => {
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

  async updateForm(){
    const loading = await this.loadingCtrl.create({
      message: 'Subiendo información...',
    });
    loading.present();
    console.log(this.ionicForm.value);
    
    this._reporte.updateObservacionReporte(this.ionicForm.value,this.data.idObservacion).subscribe({
      next: (data:any) => {
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


  return() {
    // this.modalCtrl.dismiss(this.imgFile, "return");
    this.modalCtrl.dismiss();
  }

  handleChange(ev:any) {
    this.ionicForm.value['criticidad'] = ev.target.value;
    this.criticidadSelect = ev.target.value;
  }

  compareWith(o1:any, o2:any) {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  async verificarTexto(){
    const loading2 = await this.loadingCtrl.create({
      message: 'Consultando información...',
    });
    loading2.present();
      const datos={
        "text":this.ionicForm.value['observacion']
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
              this.ionicForm.get('observacion')?.setValue(res['response'])
            },
          },
        ],
      });
  
      await alert.present();
      
    })

}
}
