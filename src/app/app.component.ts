import { EventBusService } from './shared/service/event-bus.service';
import { AuthService } from './shared/service/auth.service';
import {Router, NavigationEnd} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {setTheme} from 'ngx-bootstrap';
import {filter} from 'rxjs/operators';
import {LoaderService} from './shared/service/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'E-events';
  isAdmin = false;
  user: any;

  constructor(private router: Router, private auth: AuthService, private eventBusService: EventBusService) {
    setTheme('bs4');
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.url.includes('admin')) {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
      // console.log(this.isAdmin);
    });
    if (this.auth.user) {
      this.user = this.auth.user;
    } else {
      this.eventBusService.listen('Auto_Login').subscribe(() => {
        this.user =  this.auth.user;
      });
    }
  }
}
