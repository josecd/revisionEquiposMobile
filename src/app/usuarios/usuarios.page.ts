import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SignatureComponent } from '../shared/signature/signature/signature.component';
import { UsuarioService } from './usuario.service';
import { ScreenOrientation, OrientationType } from '@capawesome/capacitor-screen-orientation';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {

  usuario:any;
  constructor(
    public modalCtrl:ModalController,
    private _usuario:UsuarioService,
    private storage: Storage,
    private router: Router,
    private _auth:AuthenticationService

  ) { }

  async ngOnInit() {

    this.usuario = await this.storage.get('user');

    console.log(this.usuario);
    
    
  }

 async  onClick(){
    const modal = await this.modalCtrl.create({
      component:SignatureComponent,
      // componentProps:{Signature:this.}
    });
     modal.present()

    const { data, role } = await modal.onWillDismiss();

    if (role === 'img') {
      console.log(data);
      
    }
  }

  async ngOnDestroy() {
    this.usuario = null
  }


  async openModal() {
    ScreenOrientation.lock({ type: OrientationType.LANDSCAPE });


    const modal = await this.modalCtrl.create({
      component: SignatureComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log(data);
    }

    if (role === 'img') {
      console.log(data);
      let formData = new FormData();
      formData.append('reporteId','1');
      formData.append('file',data);
      formData.append('tipo','FirmaGerente');

      this._usuario.enviarFirma(formData).subscribe(res=>{
        console.log(res);
        
      })
    }
  }

  async logout(){
    // await this.storage.clear().then(res=>{
    //   this.router.navigate(['/login'])
    // })
		await this._auth.logout();
		this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
