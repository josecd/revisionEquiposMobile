import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';

const TOKEN_KEY = 'my-token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // Init with null to filter out the first value in a guard!
	isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null as any);
  token = '';

  constructor(private http: HttpClient,
    private storage: Storage
  ) {
    this.loadToken();
  }

  async loadToken() {
    const token = await this.storage.get('key');
    console.log(token);
    
    if (token) {
      console.log('set token: ', token);
      this.token = token;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post(environment.API_URL + "/auth/login", credentials).pipe(
      map(async (data: any) => {
        await this.storage.set('key', data['access_token']);
        await this.storage.set('user', data['user']);
      }),
      switchMap(async (token) => {
        console.log(token);
      }),
      tap((_) => {
        this.isAuthenticated.next(true);
      })
    );
  }

  async logout(): Promise<void> {
    this.isAuthenticated.next(false);
    await this.storage.remove('key')
    await this.storage.clear();
    return await this.storage.remove('user')
  }

  getAuth(){
    return this.http.get(environment.API_URL+'/auth');
  }

}
// await this.storage.set('key', data['access_token']);
// await this.storage.set('user', data['user']);