import { UserList } from './../../shared/service/user-list.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  modalRef: BsModalRef;
  @ViewChild('smModal', { static: false }) childModal: ModalDirective;
  data = [];
  displayedColumns = ['index', 'name', 'email', 'year', 'role', 'disable'];
  coordinatorDisplayColumns = ['index', 'name', 'email', 'signupDate', 'activate'];
  dataSource = this.data;
  coordinatorDataSource = [];
  tableLoading = false;
  constructor(private userListService: UserList) {
  }

  ngOnInit() {
    this.everyUpdate();
  }
  everyUpdate() {
    this.tableLoading = true;
    this.userListService.fetchUsers().subscribe(d => {
      this.data = d.map(item => ({name: item.firstName + ' ' + item.lastName, loading: false, ...item}));
      this.tableLoading = false;
      this.dataSource = [...this.data];
      console.log(this.dataSource);
      const cData = this.data.filter(el => el.role === 'coordinator');
      this.coordinatorDataSource = [...cData];
      console.log(this.coordinatorDataSource)
    });

    console.log()
  }
  activateDeactivateAccount(el) {
    if (!el.disabled && confirm('Do you really want to Suspend ' + el.name + ' account!')) {
      el.loading = true;
      this.userListService.updateUserData(el.id, {disabled: true}).
        then(data => {
          el.disabled = true;
          el.loading = false;
        }).catch(error => {
          console.log(error);
          alert('Some Error Occurred');
        });
    } else {
      if (confirm('Do you really want to Suspend ' + el.name + ' account!')) {
        el.loading = true;
        this.userListService.updateUserData(el.id, {disabled: false})
        .then(data => {
          el.disabled = false;
          el.loading = false;
        }).catch(error => {
          console.log(error);
          alert('Some Error Occurred');
        });
      } else {
        el.loading = false;
      }
    }
  }
  activateCoordinatorAccount(el) {
    if (el.activate && confirm('Are you sure you want to deactivate ' + el.name + ' account!')) {
      el.loading = true;
      this.userListService.updateUserData(el.id, { activate: false }).
        then(data => {
          el.activate = false;
          el.loading = false;
        }).catch(error => {
          console.log(error);
          alert('Some Error Occurred');
        });
      } else {
        if (!el.activate && confirm('Are you sure to make ' + el.name + ' coordinator')){
          el.loading = true;
          this.userListService.updateUserData(el.id, { activate: true })
            .then(data => {
              el.activate = true;
              el.loading = false;
            }).catch(error => {
              console.log(error);
              alert('Some Error Occurred');
            });
        } else {
          el.loading = false;
        }
        }
  }

}
interface UserListModal {
  name: string;
  email: string;
  year: string;
  department: string;
  signupDate: string;
}
