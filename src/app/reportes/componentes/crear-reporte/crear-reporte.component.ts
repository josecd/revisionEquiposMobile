import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ReportesService } from '../../services/reportes.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-crear-reporte',
  templateUrl: './crear-reporte.component.html',
  styleUrls: ['./crear-reporte.component.scss'],
})
export class CrearReporteComponent  implements OnInit {

  @Input("idReporte") idReporte:any;
  // form : crearObservacionDto;


  ionicForm: FormGroup;
  hoteles:any;
  hotelSelect:any;
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
    this._reporte.getHoteles().subscribe({
      next: (data) => {
        this.hoteles = data
        console.log(data);
      },
      error(err) {},
    });
    this.ionicForm = this.formBuilder.group({
      descripcion: ['',[Validators.required, ]],
      hotelId: ['',[Validators.required ]],
      userId:[''],
    });

     const iduser=  await this.storage.get('user').then(res=>{
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
      message: 'Subiendo información...',
    });
    loading.present();

    console.log(this.ionicForm.value);
    
    this._reporte.crearReporte(this.ionicForm.value).subscribe({
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


  handleChange(ev:any) {
    this.ionicForm.value['hotelId'] = ev.target.value;
    this.hotelSelect = ev.target.value;
  }

  return() {
    // this.modalCtrl.dismiss(this.imgFile, "return");
    this.modalCtrl.dismiss();
  }
}
