import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { SignatureComponent } from "./shared/signature/signature/signature.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicStorageModule } from '@ionic/storage-angular';
import { InterceptorService } from "./services/interceptor.service";
import { register } from 'swiper/element/bundle';
register();

@NgModule({
  declarations: [AppComponent, SignatureComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    IonicStorageModule.forRoot()

  ],
  providers: [
    { 
    provide: HTTP_INTERCEPTORS, 
    useClass: InterceptorService,
    multi:true 
   },{  provide: RouteReuseStrategy, 
    useClass: IonicRouteStrategy}],
  bootstrap: [AppComponent],
})
export class AppModule { }
