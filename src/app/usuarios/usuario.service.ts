import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable, switchMap, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UsuarioService {
  constructor(private _httpClient: HttpClient) { }

  enviarFirma(firma: any) {
    return this._httpClient.post(environment.API_URL + "/reportes/firma", firma);
  }

  enviarFirmaObs(firma: any) {
    return this._httpClient.post(environment.API_URL + "/reportes/obs/firma", firma);
  }

  enviarFirmaPerfil(id: any, firma: any) {
    return this._httpClient.post(environment.API_URL + `/users/${id}/createFirma`, firma);
  }
  getFirmas(id:any) {
    return this._httpClient.get(environment.API_URL + `/users/perfil/${id}`)
  }

  getToBase64URL(img:any){
    this._httpClient.get(img, { responseType: 'blob' })
    .pipe(
      switchMap(blob => this.convertBlobToBase64(blob))
    )
    .subscribe(base64ImageUrl => {
      return base64ImageUrl
    });
  }
  convertBlobToBase64(blob: Blob) {
    return Observable.create((observer:any) => {
      const reader = new FileReader();
      const binaryString = reader.readAsDataURL(blob);
      reader.onload = (event: any) => {
        console.log('Image in Base64: ', event.target.result);
        observer.next(event.target.result);
        observer.complete();
      };

      reader.onerror = (event: any) => {
        console.log("File could not be read: " + event.target.error.code);
        observer.next(event.target.error.code);
        observer.complete();
      };
    });
  }
}
