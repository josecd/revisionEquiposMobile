import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventarioPageRoutingModule } from './inventario-routing.module';

import { InventarioPage } from './inventario.page';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { DetalleInventarioComponent } from './componentes/detalle-inventario/detalle-inventario.component';
import { CrearInventarioComponent } from './componentes/crear-inventario/crear-inventario.component';
import { CrearParteComponent } from './componentes/crear-parte/crear-parte.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventarioPageRoutingModule,
    ReactiveFormsModule,
    DirectivesModule
  ],
  declarations: [
    InventarioPage,
    DetalleInventarioComponent,
    CrearInventarioComponent,
    CrearParteComponent
  ]
})
export class InventarioPageModule {}
