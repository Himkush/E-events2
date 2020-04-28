import { ParticipantService } from './../../shared/service/participants.service';
import { ParticipationListService } from './../../shared/service/participation.service';
import { AuthService } from './../../services/auth.service';
import { EventFormService } from './../../shared/service/event-form.service';
import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { FormsModel } from 'src/app/shared/model/event-form.model';
import { EventBusService } from './../../shared/service/event-bus.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit {
  @Input() event: FormsModel;
  date = new Date();
  user: any;
  participated = false;
  userData: any[];
  constructor(private eventFormService: EventFormService,
              private eventBusService: EventBusService,
              private participationListService: ParticipationListService,
              private participantService: ParticipantService,
              private router: Router,
              private auth: AuthService) { }

  ngOnInit() {
    const date = new Date();
    if (!this.event.isAdmin) {
      this.auth.getUserState().subscribe(user => {
        this.user = user;
        if (this.user) {
        this.auth.getCurrentUserDetails().subscribe(data => {
          this.userData = data.participation || data.eventForm;
          this.participated = this.userData.includes(this.event.id);
        });
      }
    }
      );
  }
}
  editEvent() {
    // this.eventFormService.setEventToEdit(this.event);
    // this.eventBusService.announce('EVENT_TO_EDIT', this.event);
    this.event.isAdmin ? this.router.navigate(['/admin/edit-event']) : this.router.navigate(['edit-event']);
    setTimeout(er => this.eventBusService.announce('EVENT_TO_EDIT', this.event));
  }
  participate() {
    if (this.user) {
      alert('Are you sure you want to participate ?');
      this.participantService.createNewParticipant(this.user.uid).
                  then(data => this.participationListService.addNewParticipant(this.event.participation, data.id).then(
                    data => {this.auth.addEventForm(this.event.id); }
                  ));
    } else {
      this.router.navigate(['login']);
    }
  }
}
