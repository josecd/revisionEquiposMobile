import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { LoginService } from './pages/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Reportes', url: 'reportes', icon: 'mail' },
    { title: 'Perfil', url: 'usuarios', icon: 'paper-plane' },
    // { title: 'Hoteles', url: 'hoteles', icon: 'heart' },
    // { title: 'Trabajadores', url: 'trabajadores', icon: 'archive' },
  ];

  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(
    private storage: Storage,
    private _login :LoginService,
    private router: Router
  ) {
    this.init();
    this._login.getAuth().subscribe({
      next:(data:any)=>{
        this.router.navigate(['/reportes'])
      },
      error:(err:any)=>{
        this.router.navigate(['/login'])
      }
    })
  }

  async init() {
    const storage = await this.storage.create();
    this.storage = storage;
  }

}
