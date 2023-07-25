import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private _httpClient: HttpClient,
    ) {}

  ngOnInit() {
    
 
  }

  getAuth(){
    return this._httpClient.get(environment.API_URL+'/auth');
  }

  login(data:any){
    return this._httpClient.post(
      environment.API_URL + "/auth/login",
      data
    );
  }
}
