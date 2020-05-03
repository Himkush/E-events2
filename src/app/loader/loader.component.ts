import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {BsModalService, ModalDirective} from 'ngx-bootstrap';
import {LoaderService} from '../shared/service/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  constructor(private modalService: BsModalService, private loaderService: LoaderService) { }

  @ViewChild('loaderModal', { static: false }) loaderModal: ModalDirective;
  showLoader = false;
  ngOnInit() {
    if (this.showLoader) {
      this.loaderModal.show();
    } else {
      this.loaderModal.hide();
    }
  }

}
