import { FormsModel } from './../shared/model/event-form.model';
import { EventFormService } from './../shared/service/event-form.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  event: FormsModel;
  id: string;
  loaded = false;
  date = new Date();

  constructor(private eventFormService: EventFormService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  ngOnInit() {
    this.eventFormService.getEventDetail(this.id).subscribe(result => {
      this.event = result;
      this.loaded = true;
    });
  }

}
