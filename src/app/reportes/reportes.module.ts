import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ReportesPageRoutingModule } from "./reportes-routing.module";

import { ReportesPage } from "./reportes.page";
import { HttpClientModule } from "@angular/common/http";
import { DetalleReporteComponent } from "./componentes/detalle-reporte/detalle-reporte.component";
import { AgregarImagenObservacionComponent } from "./componentes/agregar-imagen-observacion/agregar-imagen-observacion.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportesPageRoutingModule,
    HttpClientModule,
  ],
  declarations: [
    ReportesPage,
    DetalleReporteComponent,
    AgregarImagenObservacionComponent
  ],
})
export class ReportesPageModule {}
