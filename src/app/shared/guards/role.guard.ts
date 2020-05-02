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
    console.log('Role');
    this.auth.getCurrentUserDetails().subscribe( (user) => {
      if (user.role === 'candidate') {
        console.log(user.role);
        this.router.navigateByUrl(route.url[0].path);
      }
    });
    return false;
  }

}
