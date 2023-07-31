import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SignatureComponent } from '../shared/signature/signature/signature.component';
import { UsuarioService } from './usuario.service';
import { ScreenOrientation, OrientationType } from '@capawesome/capacitor-screen-orientation';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { SignatureUsuarioComponent } from '../shared/signature-usuario/signature-usuario.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {

  usuario: any;
  usuario2: any;

  firma: any = [];
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    public modalCtrl: ModalController,
    private _usuario: UsuarioService,
    private storage: Storage,
    private router: Router,
    private _auth: AuthenticationService

  ) {
    // this._auth.user$
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((user) => {
    //     console.log(user);
    //     this.usuario2 = user;
    //   });
  }

  async ngOnInit() {
    this.usuario = await this.storage.get('user');
    console.log(this.usuario);
    
    this.firma = this.usuario['perfil']
  }

   getFirma() {
    this.firma = []
    this._usuario.getFirmas(this.usuario.idUsuario).subscribe({
      next: async (value: any) => {
        console.log(value);
        await this.storage.set('user', value);
        this._auth.user = value;
        this.firma = value['perfil']
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }
  async onClick() {
    const modal = await this.modalCtrl.create({
      component: SignatureComponent,
      // componentProps:{Signature:this.}
    });
    modal.present()

    const { data, role } = await modal.onWillDismiss();

    if (role === 'img') {

    }
  }

  async ngOnDestroy() {
    this.usuario = null
  }


  async openModal() {
    // ScreenOrientation.lock({ type: OrientationType.LANDSCAPE });


    const modal = await this.modalCtrl.create({
      component: SignatureComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
    }

    if (role === 'img') {
      let formData = new FormData();
      formData.append('reporteId', '1');
      formData.append('file', data);
      formData.append('tipo', 'FirmaGerente');

      this._usuario.enviarFirma(formData).subscribe(res => {
        this.getFirma();
      })
    }
  }

  async logout() {
    // await this.storage.clear().then(res=>{
    //   this.router.navigate(['/login'])
    // })
    await this._auth.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }


  async agregarFirma() {
    ScreenOrientation.lock({ type: OrientationType.LANDSCAPE });

    const modal = await this.modalCtrl.create({
      component: SignatureUsuarioComponent,
      // componentProps: { idReporte: this.data['idReporte'].toString() }
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (data) {
      console.log(data);
      let formData = new FormData();
      formData.append('file', data.img)
      formData.append('nombre', this.usuario['nombre'])

      this._usuario.enviarFirmaPerfil(this.usuario.idUsuario, formData).subscribe(res => {
        this.getFirma()
      })
    } else {
    }

  }
}
