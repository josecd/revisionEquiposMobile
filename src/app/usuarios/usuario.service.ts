import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UsuarioService {
  constructor(private _httpClient: HttpClient) {}

  enviarFirma(firma:any) {
    return this._httpClient.post(environment.API_URL + "/reportes/firma", firma);
  }
}
