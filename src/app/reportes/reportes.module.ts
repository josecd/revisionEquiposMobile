import { DirectivesModule } from './../directives/directives.module';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ReportesPageRoutingModule } from "./reportes-routing.module";

import { ReportesPage } from "./reportes.page";
import { HttpClientModule } from "@angular/common/http";
import { DetalleReporteComponent } from "./componentes/detalle-reporte/detalle-reporte.component";
import { AgregarImagenObservacionComponent } from "./componentes/agregar-imagen-observacion/agregar-imagen-observacion.component";
import { CrearObservacionComponent } from "./componentes/crear-observacion/crear-observacion.component";
import { CrearReporteComponent } from "./componentes/crear-reporte/crear-reporte.component";
import { DetalleObservacionComponent } from "./componentes/detalle-observacion/detalle-observacion.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportesPageRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    DirectivesModule
  ],
  declarations: [
    ReportesPage,
    DetalleReporteComponent,
    AgregarImagenObservacionComponent,
    CrearObservacionComponent,
    CrearReporteComponent,
    DetalleObservacionComponent
  ],
})
export class ReportesPageModule {}
