import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, ReplaySubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';

const TOKEN_KEY = 'my-token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // Init with null to filter out the first value in a guard!
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null as any);
  private _user: ReplaySubject<any> = new ReplaySubject<any>(1);
  token = '';
  usuario: any;

  constructor(private http: HttpClient,
    private storage: Storage,
  ) {

    this.loadToken();
  }

  async ngOnInit() {
    this.usuario = await this.storage.get('user');
    console.log(this.usuario);

  }

  /**
 * Setter & getter for user
 *
 * @param value
 */

  set user(value: any) {
    // Store the value
    this._user.next(value);
  }

  get user$(): Observable<any> {
    return this._user.asObservable();
  }

  /**
 * Get the current logged in user data
 */
  async get(): Promise<Observable<any>> {
    this.usuario = await this.storage.get('user');
    
    return this.http.get(environment.API_URL + `/users/perfil/${this.usuario?.idUsuario}`)
    .pipe(
      tap((user:any) => {

        this._user.next(user);
      })
    );
  }

  async loadToken() {
    const token = await this.storage.get('key');
    this.user = await this.storage.get('user');

    if (token) {
      this.token = token;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post(environment.API_URL + "/auth/login", credentials).pipe(
      map(async (data: any) => {
        console.log('verificar datos',data['user']);
        await this.storage.set('key', data['access_token']);
        await this.storage.set('user', data['user']);
        this.user = data['user']
      }),
      switchMap(async (token) => {
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

  getAuth() {
    return this.http.get(environment.API_URL + '/auth');
  }

}
// await this.storage.set('key', data['access_token']);
// await this.storage.set('user', data['user']);