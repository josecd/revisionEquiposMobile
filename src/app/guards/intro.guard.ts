import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
@Injectable({
  providedIn: 'root'
})
export class IntroGuard implements CanLoad {
  constructor(
    private router: Router,
    private storage:Storage
    ) { }

  async canLoad(): Promise<boolean> {
      const hasSeenIntro = await this.storage.get('key');
      
      if (hasSeenIntro) {
        
        return true;
      } else {
        
        this.router.navigateByUrl('/login', { replaceUrl:true });
        return false;
      }
  }
}

