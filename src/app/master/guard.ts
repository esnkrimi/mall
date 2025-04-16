import { Inject, Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../service/localstorage.service';

@Injectable()
export class CanActivateLoginGuard implements CanActivate {
  constructor(
    private _router: Router,
    private localStorageService: LocalStorageService
  ) {}

  canActivate(): boolean {
    let user: any = this.localStorageService?.getItem('user');
    user = JSON.parse(user);
    if (!user?.email) {
      this._router.navigate(['feature/login']);
      return false;
    }
    return true;
  }
}
