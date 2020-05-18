import { EventBusService } from './../shared/service/event-bus.service';
import { FormsModel } from './../shared/model/event-form.model';
import { EventFormService } from './../shared/service/event-form.service';
import { Component, OnInit, ChangeDetectorRef, ApplicationRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit, OnDestroy {
  event: FormsModel;
  id: string;
  loaded = false;
  // access = 'nn';
  access: string;
  date = new Date();

  constructor(private eventFormService: EventFormService,
              private eventBusService: EventBusService,
              private router: Router,
              private ref: ApplicationRef,
              private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  ngOnInit() {
    const data = this.eventBusService.data;
    this.access = data;
    this.eventFormService.getEventDetail(this.id).subscribe(result => {
      this.event = result;
      this.loaded = true;
    });
  }
  approveEvent() {
    alert('Are you sure you want to approve this event!');
    this.event.approved = true;
    this.eventFormService.updateEvent(this.event, this.id);
    this.router.navigate(['./approve-events'], {relativeTo: this.route.parent});
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.eventBusService.data = null;
  }
}
