import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ReportesService {
  constructor(private _httpClient: HttpClient) {}

  enviarFirma(firma: any) {
    return this._httpClient.post(
      environment.API_URL + "/reportes/firma",
      firma
    );
  }

  getReportes(){
    return this._httpClient.get(environment.API_URL+'/reportes');
  }

  getReporteID(id:number){
    return this._httpClient.get(environment.API_URL+`/reportes/${id}`);
  }

  getFirmas(){
    return this._httpClient.get(environment.API_URL+``)
  }

  agregarFotosObservacion(datos:any){
    return this._httpClient.post(
      environment.API_URL + "/observaciones/imgObservacion",
      datos
    );
  }

  eliminarImgObsevacion(datos:any){
    return this._httpClient.post(
      environment.API_URL + "/observaciones/eliminarImgObservacion",
      datos
    );
  }

  eliminarFirma(datos:any){
    return this._httpClient.post(
      environment.API_URL + "/reportes/firmaEliminar",
      datos
    );
  }

  crearObservacionReporte(data:any){
    return this._httpClient.post(
      environment.API_URL + "/observaciones/crear",
      data
    );
  }

  getHoteles(){
    return this._httpClient.get(environment.API_URL+'/hoteles');
  }


  crearReporte(data:any){
    return this._httpClient.post(
      environment.API_URL + "/reportes",
      data
    );
  }

  getObservacion(id:any){
    return this._httpClient.get(environment.API_URL+'/observaciones/'+id);
  }

  crearComentario(data:any){
    return this._httpClient.post(
      environment.API_URL + "/observaciones/agregarComentario",
      data
    );
  }

  exportPDF(id:any){
    return this._httpClient.get(environment.API_URL+'/reportes/'+id+'/pdf2');
  }
}
