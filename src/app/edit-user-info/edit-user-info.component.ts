import { RegisterService } from './../services/register.service';
import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {UserModel} from '../models/user.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-edit-user-info',
  templateUrl: './edit-user-info.component.html',
  styleUrls: ['./edit-user-info.component.css']
})
export class EditUserInfoComponent implements OnInit {
  user: UserModel;
  selectedImage: any = null;
  editForm: FormGroup;
  imageUrl: string;
  editMode = false;

  constructor(private auth: AuthService, private registerService: RegisterService) {
    // this.resetForm();
  }

  ngOnInit() {
    this.auth.getCurrentUserDetails().subscribe(result => {
      console.log(result);
      this.editMode = true;
      this.user = result;
      this.initForm();
    });
    this.initForm();
  }
  initForm() {
    let firstName = '';
    let lastName = '';
    let rollNumber = '';
    let year = 1;
    let mobile = '';
    let role = '';
    let department = '';
    if (this.editMode) {
      firstName = this.user.firstName;
      lastName = this.user.lastName;
      rollNumber = this.user.rollNumber;
      year = this.user.year;
      mobile = this.user.mobile;
      role = this.user.role,
      department = this.user.department;
      this.imageUrl = this.user.imageSrc;
    }
    this.editForm = new FormGroup({
      firstName: new FormControl(firstName, Validators.required),
      lastName: new FormControl(lastName, Validators.required),
      rollNumber: new FormControl(rollNumber, Validators.required),
      year: new FormControl(year, Validators.required),
      mobile: new FormControl(mobile, Validators.required),
      department: new FormControl(department, Validators.required),
      imageSrc: new FormControl(),
    });
  }
  editUser() {
    if (this.editForm.valid) {
      if (this.imageUrl === this.user.imageSrc) {
        this.editForm.controls.imageSrc.setValue(this.imageUrl);
        this.auth.updateUser({...this.editForm.value});
      } else {
        const url = this.user.imageSrc;
        this.registerService.deleteUserImage(url).then(res => {
        const filePath = `userImages/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
        this.registerService.uploadUserImage(filePath, this.selectedImage)
            .then(result => {
              this.registerService.fileRef.getDownloadURL().subscribe( url => {
              this.editForm.controls.imageSrc.setValue(url);
              this.auth.updateUser({...this.editForm.value});
              this.editForm.reset();
              });
            });
        });
      }
    }
  }

  showPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => this.imageUrl = e.target.result;
      this.selectedImage = event.target.files[0];
    } else {
      this.imageUrl = '../../assets/img/avatar2.png';
      this.selectedImage = null;
    }
  }
  resetForm() {
    this.imageUrl = '../../assets/img/avatar2.png';
    this.selectedImage = null;
  }
}
