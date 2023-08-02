import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ReportesService } from '../../services/reportes.service';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-crear-observacion',
  templateUrl: './crear-observacion.component.html',
  styleUrls: ['./crear-observacion.component.scss'],
})
export class CrearObservacionComponent  implements OnInit {
  @Input("editM") editM:any;
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
    private storage: Storage
  ) { 

  }

  async ngOnInit() {
    
    this.edit= this.editM;

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
        criticidad:['']
      });
      const data = this.data?.criticidad
      this.ionicForm.get('criticidad')?.setValue(data)
    }else{
      this.ionicForm = this.formBuilder.group({
        equipo: ['',],
        marca: [''],
        modelo: ['',],
        numeroSerie: ['',],
        area: ['',],
        observacion: ['',],
        reporteId:[this.idReporte],
        userId:[''],
        criticidad:['']
      });

    }


    const iduser =  await this.storage.get('user').then(res=>{
      this.ionicForm.get('userId')?.setValue(res['idUsuario'])
     })
  }
  
  async submitForm(){
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
}
