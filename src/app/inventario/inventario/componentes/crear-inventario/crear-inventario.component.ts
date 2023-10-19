import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ReportesService } from 'src/app/reportes/services/reportes.service';
import { Storage } from '@ionic/storage';
import { InventarioService } from 'src/app/inventario/services/inventario.service';

@Component({
  selector: 'app-crear-inventario',
  templateUrl: './crear-inventario.component.html',
  styleUrls: ['./crear-inventario.component.scss'],
})
export class CrearInventarioComponent  implements OnInit {

  ionicForm: FormGroup;
  hoteles:any;
  hotelSelect:any;
  constructor(
    public modalCtrl: ModalController,
    public formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private _reporte:ReportesService,
    private storage: Storage,
    private _inventario: InventarioService
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
      marca: ['',[Validators.required, ]],
      equipo: ['',[Validators.required ]],
      hotelId: ['',[Validators.required ]],
      userId:['',],
    });

     const iduser=  await this.storage.get('user').then(res=>{
      this.ionicForm.get('userId')?.setValue(res['idUsuario'])
     })



  }

  
  async submitForm(){
    const loading = await this.loadingCtrl.create({
      message: 'Subiendo información...',
    });
    loading.present();

    
    this._inventario.crearInventario(this.ionicForm.value).subscribe({
      next: (data:any) => {
        loading.dismiss();
        this.modalCtrl.dismiss(true, "msg");
      },
      error: async (err)=>{
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
