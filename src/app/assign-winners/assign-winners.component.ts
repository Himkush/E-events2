import {Component, OnInit} from '@angular/core';
import {ParticipationListService} from '../shared/service/participation.service';
import {ActivatedRoute} from '@angular/router';
import {CdkDragDrop, transferArrayItem, moveItemInArray} from '@angular/cdk/drag-drop';

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

  constructor(private participationListService: ParticipationListService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.participationId = params.participationId;
      this.eventId = params.eventId;
    });
  }

  ngOnInit() {
    this.participationListService.fetchParticipantList(this.participationId).subscribe(res => {
      this.participants.push(res);
      this.loaded = true;
    }, (err) => {console.log(err); });
  }

  declareResults() {

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
