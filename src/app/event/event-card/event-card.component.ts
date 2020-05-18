import { ParticipantService } from './../../shared/service/participants.service';
import { ParticipationListService } from './../../shared/service/participation.service';
import { AuthService } from '../../shared/service/auth.service';
import { EventFormService } from './../../shared/service/event-form.service';
import { Component, OnInit, Input, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { FormsModel } from 'src/app/shared/model/event-form.model';
import { EventBusService } from './../../shared/service/event-bus.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit, OnDestroy {
  @Input() event: FormsModel;
  @Input() page?: string;
  @Input() admin?: string;
  date = new Date();
  user: any;
  isCoordinator = false;
  participated = false;
  userData: any[];
  constructor(private eventFormService: EventFormService,
              private eventBusService: EventBusService,
              private participationListService: ParticipationListService,
              private participantService: ParticipantService,
              private router: Router,
              private r: ActivatedRoute,
              private auth: AuthService) { }

  ngOnInit() {
    const date = new Date();
    if (this.auth.user) {
      this.tempFunc();
    } else {
    this.eventBusService.listen('Auto_Login').subscribe(() =>{
      this.tempFunc();
    });
  }
  }
  tempFunc() {
    this.user = this.auth.user;
    if (this.auth.user && this.auth.user.role === 'admin') {
      this.admin = 'adminPage';
    }
    this.isCoordinator = this.auth.user && this.auth.user.role === 'coordinator' && this.isCreator();
    console.log(this.event.authUID,this.auth.getCurrentUserUid());
    if (this.auth.user && this.auth.user.role !== 'admin') {
      this.userData = this.auth.user.participation || this.auth.user.data.eventForm;
      this.participated = this.userData.includes(this.event.id) || this.event.authUID === this.auth.getCurrentUserUid();
    }
  }
  editEvent() {
    // this.eventFormService.setEventToEdit(this.event);
    // this.eventBusService.announce('EVENT_TO_EDIT', this.event);
    this.router.navigate(['./edit-event'], {relativeTo: this.r.parent});
    setTimeout(er => this.eventBusService.announce('EVENT_TO_EDIT', this.event));
  }
  participate() {
    if (this.user) {
      alert('Are you sure you want to participate ?');
      this.participantService.createNewParticipant(this.user.uid)
        .then(data => this.participationListService.addNewParticipant(this.event.participation, data.id)
        .then(() => {this.auth.addEventForm(this.event.id); }
        ));
    } else {
      this.router.navigate(['login']);
    }
  }
  approve() {
    this.router.navigate([`./event/${this.event.id}`], { relativeTo: this.r.parent });
  }
  isCreator() {
    return this.event.authUID === this.auth.getCurrentUserUid();
  }
  ngOnDestroy() {
    if (this.auth.user && this.auth.user.role === 'admin') {
      this.eventBusService.data = 'admin';
    }
  }
}
