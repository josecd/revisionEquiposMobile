import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HotelesPage } from './hoteles.page';

const routes: Routes = [
  {
    path: '',
    component: HotelesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HotelesPageRoutingModule {}
