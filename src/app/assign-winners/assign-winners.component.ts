import {Component, OnInit} from '@angular/core';
import {ParticipationListService} from '../shared/service/participation.service';
import {ActivatedRoute} from '@angular/router';
import {CdkDragDrop, transferArrayItem, moveItemInArray} from '@angular/cdk/drag-drop';
import {EventFormService} from '../shared/service/event-form.service';
import {ParticipantService} from '../shared/service/participants.service';
import {FormsModel} from '../shared/model/event-form.model';
import {WinnersService} from '../shared/service/winners.service';

@Component({
  selector: 'app-assign-winners',
  templateUrl: './assign-winners.component.html',
  styleUrls: ['./assign-winners.component.css']
})
export class AssignWinnersComponent implements OnInit {
  participationId: string;
  eventId: string;
  participants = [];
  winners = [];
  loaded = false;
  currentEvent: FormsModel;

  constructor(private participationListService: ParticipationListService,
              private participantService: ParticipantService,
              private route: ActivatedRoute,
              private eventFormService: EventFormService,
              private winnersService: WinnersService) {
    this.route.params.subscribe(params => {
      this.participationId = params.participationId;
      this.eventId = params.eventId;
    });
  }

  ngOnInit() {
    this.participationListService.fetchParticipantList(this.participationId).subscribe(res => {
      this.participants.push(res);
      // console.log(this.participants);
      this.loaded = true;
    }, (err) => {
      console.log(err);
    });
    this.eventFormService.getEventDetail(this.eventId).subscribe(data => {
      this.currentEvent = data;
    });
  }

  declareResults() {
    if (this.winners.length === 0) {
      alert('Please Drag the Winners in the Winners Box!!');
    } else {
      confirm('Are you sure to upload Winners') ?
        this.postWinnersIds() :
        alert('You can update the Winners');
    }
  }

  postWinnersIds() {
    const winnerIds = [];
    this.winners.forEach(winner => {
      this.participantService.fetchParticipant(winner.id).subscribe(data => {
        winnerIds.push(data.userId);
      });
    });
    setTimeout(() => {
      if (winnerIds.length > 0) {
        this.eventFormService.updateEventWinners(winnerIds, this.eventId);
        this.winnersService.addWinnerDocument(this.eventId, winnerIds);
      } else {
        alert('Some Problem Occured!! Please declare again!!');
      }}, 600);
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

}
