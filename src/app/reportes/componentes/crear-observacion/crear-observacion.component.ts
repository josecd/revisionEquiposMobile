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
  @Input("idReporte") idReporte:any;
  // form : crearObservacionDto;

  criticidad  =[
    {
      "id":'Bajo',
      "nombre":'Bajo'
    },
    {
      "id":'Medio',
      "nombre":'Medio'
    },
    {
      "id":'Alto',
      "nombre":'Alto'
    }
  ]
  criticidadSelect:any;

  ionicForm: FormGroup;

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

    const iduser =  await this.storage.get('user').then(res=>{
      this.ionicForm.get('userId')?.setValue(res['idUsuario'])
     })
  }

  // submitForm = () => {
  //   if (this.ionicForm.valid) {
  //     this.ionicForm.value
  //     console.log(this.ionicForm.value);
  //     return false;
  //   } else {
  //     return console.log('Please provide all the required values!');
  //   }
  // };

  
  async submitForm(){
    const loading = await this.loadingCtrl.create({
      message: 'Subiendo imagenes...',
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



  return() {
    // this.modalCtrl.dismiss(this.imgFile, "return");
    this.modalCtrl.dismiss();
  }

  handleChange(ev:any) {
    this.ionicForm.value['criticidad'] = ev.target.value;
    this.criticidadSelect = ev.target.value;
  }
}
