import {AuthService} from './../shared/service/auth.service';
import {EventBusService} from './../shared/service/event-bus.service';
import {FormsModel} from './../shared/model/event-form.model';
import {EventFormService} from './../shared/service/event-form.service';
import {Component, OnInit, ChangeDetectorRef, ApplicationRef, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { ParticipantService } from '../shared/service/participants.service';
import { ParticipationListService } from '../shared/service/participation.service';

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
  imageModal: FormsModel;
  // access = 'nn';
  access: string;
  date = new Date();
  user: any;
  participated = false;
  userData: any[] = [];

  constructor(private eventFormService: EventFormService,
              private eventBusService: EventBusService,
              private auth: AuthService,
              private router: Router,
              private ref: ApplicationRef,
              private participationListService: ParticipationListService,
              private participantService: ParticipantService,
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
        this.tempFunction();
      } else {
        this.eventBusService.listen('Auto_Login').subscribe(() => {
          this.tempFunction();
        });
      }
    }, err => {this.router.navigate(['./']);} );


  }
  tempFunction() {
    this.user = this.auth.user;
    this.access = this.auth.user.role === 'admin' ? 'admin' : null;
    this.isCoordinator = this.auth.user && this.auth.user.role === 'coordinator' && this.isCreator();
    this.userData = this.auth.user.participation || [];
    this.participated = this.userData.includes(this.id) || this.event.authUID === this.auth.getCurrentUserUid();
  }

  approveEvent() {
    if (confirm('Are you sure you want to approve this event!')) {
      this.event.approved = true;
      this.eventFormService.updateEvent(this.event, this.id);
      this.router.navigate(['./approve-events'], {relativeTo: this.route.parent});
    }
  }
  participate() {
    if (this.user) {
      if (confirm('Are you sure you want to participate ?')) {
        this.participantService.createNewParticipant(this.user.uid)
          .then(data => this.participationListService.addNewParticipant(this.event.participation, data.id)
            .then(() => {
              this.auth.addEventForm(this.id);
              this.participated = true;
            }
            ));
      }
    } else {
      this.router.navigate(['login']);
    }
  }

  cancelEvent() {
    if (confirm('****Attention**** You are just one step closer to cancel this event! \n Once Cancelled you will not be able to bring back this event')) {
      this.event.cancelled = true;
      this.eventFormService.updateEvent(this.event, this.id);
      this.router.navigate(['./'], {relativeTo: this.route.parent});
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
  imageClicked(x) {
    this.imageModal = x;
  }
}
