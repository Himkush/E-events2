import { first } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {Promise} from 'q';
import {AuthService} from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService,
              private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.auth.getCurrentUserDetails().pipe(first()).subscribe( (user) => {
      if (user.role === 'candidate' || user.role === 'admin') {
        this.router.navigateByUrl('/');
        alert('You are NOT REGISTERD AS COORDINATOR and CANNOT ADD EVENTS!!');
      }
    });
    return true;
  }

}
