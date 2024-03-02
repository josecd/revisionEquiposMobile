import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ReportesService {
  constructor(private _httpClient: HttpClient) { }

  enviarFirma(firma: any) {
    return this._httpClient.post(
      environment.API_URL + "/reportes/firma",
      firma
    );
  }

  getReportes() {
    return this._httpClient.get(environment.API_URL + '/reportes');
  }

  getReportesMobile(data:any) {
    return this._httpClient.post(environment.API_URL + '/reportes/filtermobile',data);
  }


  getReporteID(id: number) {
    return this._httpClient.get(environment.API_URL + `/reportes/${id}`);
  }

  getFirmas() {
    return this._httpClient.get(environment.API_URL + ``)
  }

  agregarFotosObservacion(datos: any) {
    return this._httpClient.post(
      environment.API_URL + "/observaciones/imgObservacion",
      datos
    );
  }
  eliminarReporte(id: any) {
    return this._httpClient.delete(
      environment.API_URL + "/reportes/" + id,
    );
  }

  eliminarImgObsevacion(datos: any) {
    return this._httpClient.post(
      environment.API_URL + "/observaciones/eliminarImgObservacion",
      datos
    );
  }

  eliminarFirma(datos: any) {
    return this._httpClient.post(
      environment.API_URL + "/reportes/firmaEliminar",
      datos
    );
  }

  crearObservacionReporte(data: any) {
    return this._httpClient.post(
      environment.API_URL + "/observaciones/crear",
      data
    );
  }

  
  updateObservacionReporte(data: any,id:any) {
    return this._httpClient.patch(
      environment.API_URL + `/observaciones/${id}`,
      data
    );
  }

  getHoteles() {
    return this._httpClient.get(environment.API_URL + '/hoteles');
  }


  crearReporte(data: any) {
    return this._httpClient.post(
      environment.API_URL + "/reportes",
      data
    );
  }

  getObservacion(id: any) {
    return this._httpClient.get(environment.API_URL + '/observaciones/' + id);
  }

  deleteObservacion(id: any) {
    return this._httpClient.delete(environment.API_URL + '/observaciones/' + id);
  }

  crearComentario(data: any) {
    return this._httpClient.post(
      environment.API_URL + "/observaciones/agregarComentario",
      data
    );
  }

  exportPDF(id: any) {
    return this._httpClient.get(environment.API_URL + '/reportes/' + id + '/pdf2');
  }

  editarRecomendacion(id:any,data:any){
    return this._httpClient.patch(
      environment.API_URL + `/reportes/${id}`,
      data
    );
  }

  textoCorreccionIA(data:any){ 
    console.log(data);
    
    return this._httpClient.post(
      environment.API_URL + `/users/correccion`,
      data
    );
  }
}
