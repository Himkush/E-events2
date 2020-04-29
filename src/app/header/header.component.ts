import { Component, OnInit } from '@angular/core';
import {AuthService} from '../shared/service/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  navbarOpen = false;
  user: any;
  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.auth.getUserState()
      .subscribe( user => {
        console.log(user);
        this.user = user;
      });
  }
  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
  logout() {
    this.auth.logout();
    this.user = null;
    this.router.navigate(['login']);
  }
}
