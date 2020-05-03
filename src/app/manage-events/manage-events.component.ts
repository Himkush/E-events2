import { Component, OnInit } from '@angular/core';
import {AuthService} from '../shared/service/auth.service';
import {EventFormService} from '../shared/service/event-form.service';
import {UserModel} from '../shared/model/user.model';
import {FormsModel} from '../shared/model/event-form.model';

@Component({
  selector: 'app-manage-events',
  templateUrl: './manage-events.component.html',
  styleUrls: ['./manage-events.component.css']
})
export class ManageEventsComponent implements OnInit {
  currentUser: UserModel;
  participatedEvents: any[];
  postedEvents: any[];
  loaded = false;
  date = Date.now();
  events: FormsModel[];
  constructor(private authService: AuthService,
              private eventService: EventFormService) { }

  ngOnInit() {
    this.eventService.getEvents().subscribe(events => {
      this.events = events;
      this.authService.getCurrentUserDetails().subscribe(user => {
        this.participatedEvents = this.getRequiredEvents(user.participation);
        this.postedEvents = this.getRequiredEvents(user.postedEvents);
        this.loaded = true;
      });
    });
  }

  getRequiredEvents(eventIds: any[]) {
    if (eventIds && eventIds.length > 0) {
      const requiredEvents = this.events.filter(event => eventIds.includes(event.id));
      return requiredEvents;
    } else {
      return null;
    }
  }
}
