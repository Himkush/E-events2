import { Component, OnInit } from '@angular/core';
import {AuthService} from '../shared/service/auth.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import {LoaderService} from '../shared/service/loader.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  navbarOpen = false;
  user: any;
  userName: string;
  isAdmin = false;
  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      (event.url.includes('admin')) ? this.isAdmin = true : this.isAdmin = false;
      });
    this.auth.getUserState()
      .subscribe( user => {
        if (user) {
          this.auth.getCurrentUserDetails().subscribe(currentUser => {
            this.user = currentUser;
            this.userName = currentUser.role === 'admin' ? 'Admin' : user.displayName;
          });
        } else {
          this.user = null;
        }
      });
  }
  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
  logout() {
    this.auth.logout();
    this.user = null;
    this.isAdmin ? this.router.navigate(['admin/login']) : this.router.navigate(['login']);
  }
}
