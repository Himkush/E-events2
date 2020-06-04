import {AuthService} from './../shared/service/auth.service';
import {EventBusService} from './../shared/service/event-bus.service';
import {FormsModel} from './../shared/model/event-form.model';
import {EventFormService} from './../shared/service/event-form.service';
import {Component, OnInit, ChangeDetectorRef, ApplicationRef, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit, OnDestroy {
  event: FormsModel;
  id: string;
  loaded = false;
  isCoordinator = false;
  // access = 'nn';
  access: string;
  date = new Date();

  constructor(private eventFormService: EventFormService,
              private eventBusService: EventBusService,
              private auth: AuthService,
              private router: Router,
              private ref: ApplicationRef,
              private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  ngOnInit() {
    const data = this.eventBusService.data;
    this.eventFormService.getEventDetail(this.id).subscribe(result => {
      this.event = result;
      this.loaded = true;
      if (this.auth.user) {
        this.access = 'admin';
        this.isCoordinator = this.auth.user && this.auth.user.role === 'coordinator' && this.isCreator();
      } else {
        this.eventBusService.listen('Auto_Login').subscribe(() => {
          this.access = 'admin';
          this.isCoordinator = this.auth.user && this.auth.user.role === 'coordinator' && this.isCreator();
        });
      }
    });

  }

  approveEvent() {
    const approval = confirm('Are you sure you want to approve this event!');
    if (approval) {
      this.event.approved = true;
      this.eventFormService.updateEvent(this.event, this.id);
      this.router.navigate(['./approve-events'], {relativeTo: this.route.parent});
    }
  }

  cancelEvent() {
    const cancelled = confirm('****Attention**** You are just one step closer to cancel this event! \n Once Cancelled you will not be able to bring back this event');
    if (cancelled) {
      this.event.cancelled = true;
      this.eventFormService.updateEvent(this.event, this.id);
      this.router.navigate(['./admin/'], {relativeTo: this.route.parent});
    }
  }

  isCreator() {
    return this.event.authUID === this.auth.getCurrentUserUid();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.eventBusService.data = null;
  }
}
