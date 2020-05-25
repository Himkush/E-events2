import { Component, OnInit } from '@angular/core';
import {AuthService} from '../shared/service/auth.service';
import {EventFormService} from '../shared/service/event-form.service';
import {UserModel} from '../shared/model/user.model';
import {FormsModel} from '../shared/model/event-form.model';
import {EventBusService} from '../shared/service/event-bus.service';
import {Router} from '@angular/router';

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
  approveFilterValue = '';
  constructor(private authService: AuthService,
              private eventService: EventFormService,
              private eventBusService: EventBusService,
              private router: Router) { }

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

  editEvent(editEvent) {
    // this.eventFormService.setEventToEdit(this.event);
    // this.eventBusService.announce('EVENT_TO_EDIT', this.event);
    editEvent.isAdmin ? this.router.navigate(['/admin/edit-event']) : this.router.navigate(['edit-event']);
    setTimeout(er => this.eventBusService.announce('EVENT_TO_EDIT', editEvent));
  }
}
