import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  constructor(private _httpClient: HttpClient) { }


  getInventario() {
    return this._httpClient.get(environment.API_URL + '/inventario');
  }
  getInventarioID(id: any) {
    return this._httpClient.get(environment.API_URL + `/inventario/${id}`)
  }
  crearInventario(data: any) {
    return this._httpClient.post(environment.API_URL + `/inventario`, data)
  }
  crearParte(data: any) {
    return this._httpClient.post(environment.API_URL + `/parte`, data)
  }
  eliminarInventario(id: number) {
    return this._httpClient.delete(environment.API_URL + '/inventario/' + id);
  }

  //Imagen 
  agregarImg(data:any){
    return this._httpClient.post(environment.API_URL + `/parte/imgParte`,data)
  }


  //Parte
  getParteID(id: any) {
    return this._httpClient.get(environment.API_URL + `/parte/${id}`)
  }

  patchParte(data:any,id:any){
    return this._httpClient.patch(environment.API_URL + `/parte/${id}`, data)
  }
}
