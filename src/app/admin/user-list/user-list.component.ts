import { UserList } from './../../shared/service/user-list.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, BsModalRef } from 'ngx-bootstrap';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  modalRef: BsModalRef;
  @ViewChild('smModal', { static: false }) childModal: ModalDirective;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  data = [];
  displayedColumns = ['index', 'name', 'email', 'year', 'role', 'disable', 'activate'];
  coordinatorDisplayColumns = ['index', 'name', 'email', 'signupDate', 'activate'];
  dataSource: MatTableDataSource<any[]> = new MatTableDataSource([]);
  coordinatorDataSource: MatTableDataSource<any[]> = new MatTableDataSource([]);
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
      this.data = this.data.filter(el => el.role !== 'admin');
      this.dataSource = new MatTableDataSource([...this.data]);
      this.dataSource.sort = this.sort;
      const cData = this.data.filter(el => el.role === 'coordinator' && !el.activate);
      this.coordinatorDataSource = new MatTableDataSource([...cData]);
      this.coordinatorDataSource.sort = this.sort;
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  activateDeactivateAccount(el) {
    if (!el.disabled && confirm('Do you really want to Suspend ' + el.name + ' account!')) {
      el.loading = true;
      this.userListService.updateUserData(el.id, {disabled: true}).
        then(data => {
          el.disabled = true;
          el.loading = false;
        }).catch(error => {
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
          this.everyUpdate();
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
              this.everyUpdate();
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
