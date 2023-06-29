import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Reportes', url: 'reportes', icon: 'mail' },
    { title: 'Usuarios', url: 'usuarios', icon: 'paper-plane' },
    { title: 'Hoteles', url: 'hoteles', icon: 'heart' },
    { title: 'Trabajadores', url: 'trabajadores', icon: 'archive' },
  ];

  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {}
}
