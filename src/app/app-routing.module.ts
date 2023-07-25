import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'reportes',
    loadChildren: () => import('./reportes/reportes.module').then( m => m.ReportesPageModule)
  },
  {
    path: 'trabajadores',
    loadChildren: () => import('./trabajadores/trabajadores.module').then( m => m.TrabajadoresPageModule)
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./usuarios/usuarios.module').then( m => m.UsuariosPageModule)
  },
  {
    path: 'hoteles',
    loadChildren: () => import('./hoteles/hoteles.module').then( m => m.HotelesPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
