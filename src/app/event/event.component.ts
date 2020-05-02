import { FormsModel } from './../shared/model/event-form.model';
import { EventFormService } from './../shared/service/event-form.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
})
export class EventComponent implements OnInit {
  events: FormsModel[];
  upEvents: FormsModel[];
  pEvents: FormsModel[];
  loaded = false;
  @Input() adminPage?: boolean;
  constructor(private eventService: EventFormService) { }
  date = Date.now();
  ngOnInit() {
    if (!this.adminPage) {
      this.adminPage = false;
    }
    this.eventService.getEvents().subscribe(items => {
      this.events = items.map(x => ({ ...x, isAdmin: this.adminPage }));
      this.loaded = true;
      this.upEvents = this.upcomingEvents();
      this.pEvents = this.pastEvents();
      if (typeof (items) === 'undefined' || items.length === 0) {
        // the array is defined and has at least one element
        this.loaded = false;
      }
      // console.log(items);
    });
  }
  upcomingEvents() {
    const upEvents = this.events.filter(event => {
         return event.eventDate.toDate() >= this.date;
    });
    return upEvents;
  }
  pastEvents() {
    const pastEvents = this.events.filter(event => {
      return event.eventDate.toDate() < this.date;
    });
    return pastEvents;
  }
}
