import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AutoLoginGuard } from './guards/auto-login.guard';
import { IntroGuard } from './guards/intro.guard';
import { InitialDataResolver } from './app.resolvers';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
    resolve    : {
      initialData: InitialDataResolver,
  },
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canLoad: [AutoLoginGuard],
  //   resolve    : {
  //     initialData: InitialDataResolver,
  // },
  },
   {
    path: 'reportes',
    loadChildren: () => import('./reportes/reportes.module').then( m => m.ReportesPageModule),
    canLoad: [AuthGuard],
  //   resolve    : {
  //     initialData: InitialDataResolver,
  // },
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
 
  {
    path: 'trabajadores',
    loadChildren: () => import('./trabajadores/trabajadores.module').then( m => m.TrabajadoresPageModule)
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./usuarios/usuarios.module').then( m => m.UsuariosPageModule),
  //   resolve    : {
  //     initialData: InitialDataResolver,
  // },
  },
  {
    path: 'hoteles',
    loadChildren: () => import('./hoteles/hoteles.module').then( m => m.HotelesPageModule)
  },
  {
    path: 'image-modal',
    loadChildren: () => import('./shared/image-modal/image-modal.module').then( m => m.ImageModalPageModule)
  },  {
    path: 'inventario',
    loadChildren: () => import('./inventario/inventario/inventario.module').then( m => m.InventarioPageModule)
  },




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
