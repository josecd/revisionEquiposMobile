import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HotelesPageRoutingModule } from './hoteles-routing.module';

import { HotelesPage } from './hoteles.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HotelesPageRoutingModule
  ],
  declarations: [HotelesPage]
})
export class HotelesPageModule {}
