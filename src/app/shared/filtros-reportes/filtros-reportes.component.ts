import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ReportesService } from 'src/app/reportes/services/reportes.service';
import * as moment from 'moment-timezone';
@Component({
  selector: 'app-filtros-reportes',
  templateUrl: './filtros-reportes.component.html',
  styleUrls: ['./filtros-reportes.component.scss'],
})
export class FiltrosReportesComponent implements OnInit {
  hoteles: any = []
  hotelSelect: any;
  mes: any
  anio: any
  date: any
  datevalue: any = new Date().toISOString();
  constructor(
    private popCtrl: PopoverController,
    private _reporte: ReportesService
  ) { }

  ngOnInit() {
    this.mes = moment().month()+1;
    this.anio = moment().year();
    this._reporte.getHoteles().subscribe({
      next: (data) => {
        this.hoteles = data
      },
      error(err) { },
    });
  }

  handleChange(ev: any) {
    this.hotelSelect = ev.target.value;
    console.log(this.hotelSelect.toString());
  }



  dismissPopover() {
    const hoteles= this.hotelSelect? this.hotelSelect.toString() : ''
    const filtros: any = {
      mes: this.mes,
      anio: this.anio,
      hotel: hoteles
    }
    this.popCtrl.dismiss({
      'fromPop': filtros
    });
  }
  updateMyDate($event: any) {
    this.mes = moment($event.detail.value).month() + 1;
    this.anio = moment($event.detail.value).year();
  }
}
