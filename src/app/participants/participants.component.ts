import { ParticipantsList } from './../shared/model/participants-list.model';
import { ParticipationListService } from './../shared/service/participation.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap';
import { ParticipantService } from '../shared/service/participants.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.css']
})
export class ParticipantsComponent implements OnInit {
  modalRef: BsModalRef;
  selectedId: number;
  loading = false;
  id: string;
  tableLoading = true;
  verifiedModal = false;
  @ViewChild('smModal', { static: false }) childModal: ModalDirective;
   data = [];
  displayedColumns = ['index', 'name', 'email', 'payment'];
  verifiedDisplayedColumns = ['index', 'name', 'email', 'payment', 'attended'];

  dataSource = this.data;
  verifiedTable = this.data;
  constructor(private modalService: BsModalService,
              private participantService: ParticipantService,
              private participationListService: ParticipationListService,
              private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
   }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  hideChildModal(): void {
    this.childModal.hide();
  }
  decline(): void {
    this.modalRef.hide();
  }
  everyUpdate() {
    this.data = [];
    this.tableLoading = true;
    this.participationListService.fetchParticipantList(this.id).subscribe(r => {
      this.data.push(r);
      this.tableLoading = false;
      this.dataSource = [...this.data];
      this.verifiedTable = [...this.data.filter(i => i.payment === true)];
    }, err => {
      this.tableLoading = false;
    });

  }
  ngOnInit() {
    this.everyUpdate();
  }
  verifyPayment() {
    this.loading = true;
    const id = this.data[this.selectedId].id;
    this.participantService.setPayment(id, {payment: true}).then(data => {
        this.data[this.selectedId].payment = true;
        this.verifiedTable = [...this.data.filter(i => i.payment === true)];
        this.loading = false;
    }).catch(er => {
      this.loading = false;
      console.log('Not updated');
    });
    this.hideChildModal();
  }
  modalShow(id: number) {
    console.log(id);
    this.selectedId = id;
    this.selectedId -= 1;
    this.childModal.show();
  }
  attendanceModal(id: number) {
    this.selectedId = id;
    this.selectedId -= 1;
    this.verifiedModal = true;
    this.childModal.show();
  }
  verifyAttendance() {
    this.loading = true;
    const id = this.data[this.selectedId].id;
    this.participantService.setPayment(id, { attended: true }).then(data => {
      this.data[this.selectedId].attended = true;
      this.verifiedTable = [...this.data.filter(i => i.payment === true)];
      this.loading = false;
    }).catch(er => {
      this.loading = false;
      console.log('Not updated');
    });
    this.hideChildModal();
  }
}
