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
    this.auth.getUserState().subscribe(user => {
      if (user) {
        this.auth.getCurrentUserDetails().pipe(first()).subscribe( (user1) => {
          if (user1.role === 'candidate' || user1.role === 'admin') {
            this.router.navigateByUrl('/');
            alert('You are NOT REGISTERD AS COORDINATOR and CANNOT ADD EVENTS!!');
          } else if(user1.role === 'coordinator' && !user1.activate){
            this.router.navigateByUrl('/').then(()=>{
              alert('You are not activated or suspended as a COORDINATOR and CANNOT ADD EVENTS!!');
            });
          }
        });
      }
    });
    return true;
  }

}
