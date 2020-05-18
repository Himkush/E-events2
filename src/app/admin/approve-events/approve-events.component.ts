import { Component, OnInit } from '@angular/core';
import { FormsModel } from 'src/app/shared/model/event-form.model';
import { EventFormService } from 'src/app/shared/service/event-form.service';

@Component({
  selector: 'app-approve-events',
  templateUrl: './approve-events.component.html',
  styleUrls: ['./approve-events.component.css']
})
export class ApproveEventsComponent implements OnInit {
  events: FormsModel[];
  apEvents: FormsModel[];
  napEvents: FormsModel[];
  loaded = false;
  adminPage = true;
  date = Date.now();
  constructor(private eventService: EventFormService) { }


  ngOnInit() {
    this.eventService.getEvents().subscribe(items => {
      this.events = items.map(x => ({ ...x, isAdmin: this.adminPage }));
      this.loaded = true;
      this.apEvents = this.approvedEvents();
      this.napEvents = this.unapprovedEvents();
      if (typeof (items) === 'undefined' || items.length === 0) {
        // the array is defined and has at least one element
        this.loaded = false;
      }
      // console.log(items);
    });
  }
  approvedEvents() {
    const upEvents = this.events.filter(event => event.approved);
    return upEvents;
  }
  unapprovedEvents() {
    const pastEvents = this.events.filter(event => {
      return !event.approved;
    });
    return pastEvents;
  }
}
