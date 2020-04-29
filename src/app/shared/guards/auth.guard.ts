import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {Promise} from 'q';
import {AuthService} from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService,
              private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.auth.getUserState().subscribe( (user) => {
      if (user) {
        return true;
      } else {
        this.router.navigate(['/login']);
      }
    });
    return true;
  }
}
