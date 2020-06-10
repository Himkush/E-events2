import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {Promise} from 'q';
import {first} from 'rxjs/operators';
import {AuthService} from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.auth.getUserState().subscribe(user => {
      if (user) {
        this.auth.getCurrentUserDetails().pipe(first()).subscribe( (user1) => {
          user1.role === 'admin' ? this.router.navigate(['/admin']) : this.router.navigate(['/']);
        });
      }
    });
    return true;
  }

}
