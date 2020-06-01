import {Component, OnInit} from '@angular/core';
import {WinnersModel} from '../shared/model/winners.model';
import {WinnersService} from '../shared/service/winners.service';
import {EventFormService} from '../shared/service/event-form.service';
import {UserModel} from '../shared/model/user.model';
import {AuthService} from '../shared/service/auth.service';

@Component({
  selector: 'app-winners',
  templateUrl: './winners.component.html',
  styleUrls: ['./winners.component.css']
})
export class WinnersComponent implements OnInit {

  eventsList = [];
  winnersList: UserModel[];
  eventIds = [];
  declareDates = [];
  getWinnersClicked = false;
  id = '';
  loaded = false;
  searchInput = '';

  constructor(private winnersService: WinnersService,
              private eventService: EventFormService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.winnersService.getAllEventsWinners().subscribe(data => {
      data.forEach(ele => {
        this.eventIds.push(ele.eventId);
        this.declareDates.push(ele.declareDate);
        this.eventService.getEventDetail(ele.eventId).subscribe(eventData => {
          this.eventsList.push(eventData);
          this.loaded = true;
        });
      });
    });
  }

  getWinnerDetails(e, users: string[], id: string) {
    if (this.id !== id) {
      this.id = id;
      this.winnersList = [];
      users.forEach(userId => {
        this.authService.fetchUserDocument(userId).subscribe(user => {
          this.winnersList.push(user);
        });
      });
      setTimeout(() => {
        this.getWinnersClicked = !this.getWinnersClicked;
      }, 500);
    }
  }
}
