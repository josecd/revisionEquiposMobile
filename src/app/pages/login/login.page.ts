import { Component, ContentChild, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonInput, LoadingController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from 'src/app/services/authentication.service';

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

  /////
  credentials: FormGroup;
  @ContentChild(IonInput) input: IonInput;
  constructor(
    private _login: LoginService,
    public formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private alertController: AlertController,
    private router: Router,
    private storage: Storage,
    private _auth:AuthenticationService,


    private fb: FormBuilder,
		private authService: AuthenticationService,
		private loadingController: LoadingController
  ) {
    this.ionicForm = this.formBuilder.group({
      correo: ['',],
      clave: [''],
    });

  }

  async ngOnInit() {
    this.load()
    this.credentials = this.fb.group({
			correo: [''],
			clave: []
		});
  }


  load() {
    // this._login.getAuth().subscribe({
    //   next:(data:any)=>{
    //     console.log(data);
    //     this.router.navigate(['/reportes'])
    //   },
    //   error:(err:any)=>{
    //     console.error(err);
    //   }
    // })
  }

  async login() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando información...',
    });
    loading.present();

    if (this.correo && this.clave) {
      return;
    }
    this._auth.login(this.ionicForm.value).subscribe({
      next: async (data:any) => {
        loading.dismiss();          
        console.log('verificar datos',data['user']);
        
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

  async login2() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando información...',
    });
    loading.present();
		await loading.present();

		this._auth.login(this.ionicForm.value).subscribe(
			async (res) => {
				await loading.dismiss();
				this.router.navigateByUrl('/reportes', { replaceUrl: true });
			},
			async (res) => {
				await loading.dismiss();
				const alert = await this.alertController.create({
					header: 'Intente más tarde',
					message: 'Ha ocurrido un error',
					buttons: ['OK']
				});

				await alert.present();
			}
		);
	}


  togglePwd() {
    this.showPwd = !this.showPwd;
    this.pwdIcon = this.showPwd ? "eye-off-outline" : "eye-outline";
  }
  /////////

	async login1() {
		const loading = await this.loadingController.create();
		await loading.present();

		this.authService.login(this.credentials.value).subscribe(
			async (res) => {
				await loading.dismiss();
				this.router.navigateByUrl('/tabs', { replaceUrl: true });
			},
			async (res) => {
				await loading.dismiss();
				const alert = await this.alertController.create({
					header: 'Login failed',
					message: res.error.error,
					buttons: ['OK']
				});

				await alert.present();
			}
		);
	}

	// Easy access for form fields
	get email() {
		return this.credentials.get('email');
	}

	get password() {
		return this.credentials.get('password');
	}

}
