import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { LoginService } from './pages/login.service';
import { Router } from '@angular/router';
import { Optional } from '@angular/core';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Reportes', url: 'reportes', icon: 'mail' },
    { title: 'Inventario', url: 'inventario', icon: 'document' },
    { title: 'Perfil', url: 'usuarios', icon: 'paper-plane' },

    // { title: 'Hoteles', url: 'hoteles', icon: 'heart' },
    // { title: 'Trabajadores', url: 'trabajadores', icon: 'archive' },
  ];

  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(
    private storage: Storage,
    private _login: LoginService,
    private router: Router,
    private platform: Platform,
    @Optional() private routerOutlet?: IonRouterOutlet
  ) {
    this.init();
    this.platform.backButton.subscribeWithPriority(3, () => {
      if (!this.routerOutlet?.canGoBack()) {
        App.exitApp();
      }
    });
  }

  async init() {
    const storage = await this.storage.create();
    this.storage = storage;
  }

}
