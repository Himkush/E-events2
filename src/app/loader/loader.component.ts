import {AfterViewInit, Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService, ModalDirective} from 'ngx-bootstrap';
import {LoaderService} from '../shared/service/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit, AfterViewInit {
  constructor(private loaderService: LoaderService) {
  }
  showLoader = 'hide';
  ngOnInit() {
  }
  ngAfterViewInit() {
    this.loaderService.getState().subscribe((state) => {
      this.showLoader = state;
      console.log(state);
    });
  }

}
