import { first } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Promise } from 'q';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.auth.getUserState().subscribe(user => {
      if (user) {
        this.auth.getCurrentUserDetails().pipe(first()).subscribe((user1) => {
          if (user1 && user1.role !== 'admin') {
            this.router.navigateByUrl('/admin/login');
          }
        });
      } else {
        this.router.navigateByUrl('/admin/login');
      }
    });
    return true;
  }
}
