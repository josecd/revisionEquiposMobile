import { Component, ContentChild, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertController, IonInput, LoadingController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  correo: string;
  clave: string;
  ionicForm: FormGroup;
  pwdIcon = "eye-outline";
  showPwd = false;
  @ContentChild(IonInput) input: IonInput;
  constructor(
    private _login: LoginService,
    public formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private alertController: AlertController,
    private router: Router,
    private storage: Storage
  ) {
    this.ionicForm = this.formBuilder.group({
      correo: ['',],
      clave: [''],
    });

  }

  async ngOnInit() {
    this.load()
    
  }


  load() {
    this._login.getAuth().subscribe({
      next:(data:any)=>{
        console.log(data);
        this.router.navigate(['/reportes'])
      },
      error:(err:any)=>{
        console.error(err);
      }
    })
  }

  async login() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando información...',
    });
    loading.present();

    if (this.correo && this.clave) {
      return;
    }
    this._login.login(this.ionicForm.value).subscribe({
      next: async (data:any) => {
        loading.dismiss();          
        await this.storage.set('key', data['access_token']);
        await this.storage.set('user', data['user']);
        this.router.navigate(['/reportes'])
      },
      error: async (err) => {
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

  togglePwd() {
    this.showPwd = !this.showPwd;
    this.pwdIcon = this.showPwd ? "eye-off-outline" : "eye-outline";
  }



}
