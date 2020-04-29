import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {RegisterService} from '../shared/service/register.service';
import {AuthService} from '../shared/service/auth.service';
import {UserModel} from '../shared/model/user.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  selectedImage: any = null;
  editState = false;
  registerForm: FormGroup;
  imageUrl: string;
  formSubmitted = false;
  user: UserModel = null;
  // @ViewChild('')
  constructor(private registerService: RegisterService,
              private auth: AuthService,
              private router: Router) {
    this.resetForm();
  }
  ngOnInit() {
    // if (this.auth.isUser()) {
    //   this.editState = true;
    // }
    this.auth.getUserState().subscribe((user) => {
      if (user) {
        this.editState = true;
        this.auth.getCurrentUserDetails().subscribe(result => {
          this.user = result;
          this.initForm();
        });
      } else {
        this.registerForm = new FormGroup({
          firstName: new FormControl(null, Validators.required),
          lastName: new FormControl(null, Validators.required),
          rollNumber: new FormControl(null, Validators.required),
          year: new FormControl(null, Validators.required),
          mobile: new FormControl(null, Validators.required),
          email: new FormControl(null, Validators.required),
          department: new FormControl(null, Validators.required),
          role: new FormControl(null, Validators.required),
          imageSrc: new FormControl(),
          password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
          cpassword: new FormControl(null, Validators.required)
        });
      }
    });
  }
  initForm() {
    this.registerForm = new FormGroup({
      firstName: new FormControl(this.user.firstName, Validators.required),
      lastName: new FormControl(this.user.lastName, Validators.required),
      rollNumber: new FormControl(this.user.rollNumber, Validators.required),
      year: new FormControl(this.user.year, Validators.required),
      email: new FormControl({value: this.user.email, disabled: true}),
      mobile: new FormControl(this.user.mobile, Validators.required),
      department: new FormControl(this.user.department, Validators.required),
      role: new FormControl(this.user.role),
      password: new FormControl(null),
      imageSrc: new FormControl(this.user.imageSrc),
      cpassword: new FormControl(null)
    });
    this.imageUrl = this.user.imageSrc;
  }
  some = (url) => {
    this.registerForm.controls.imageSrc.setValue(url);
    if (this.editState) {
      this.auth.updateUser(this.registerForm.value);
      // this.registerForm.reset();
    } else {
      this.auth.createUser(this.registerForm.value);
      this.router.navigate(['/login']);
    }
  }
  addUser() {
    if (this.registerForm.valid && (this.registerForm.get('password').value === this.registerForm.get('cpassword').value)) {
      // this.registerService.addUser(this.user);
      if (this.selectedImage) {
        const filePath = `userImages/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
        this.registerService.uploadUserImage(filePath, this.selectedImage, this.some.bind(this));
      } else {
        this.auth.createUser(this.registerForm.value);
        console.log('in');
        this.router.navigate(['/login']);
      }
    } else {
      this.formSubmitted = true;
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
  editUser() {
    if (this.registerForm.valid) {
      if (this.selectedImage) {
        const filePath = `userImages/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
        this.registerService.uploadUserImage(filePath, this.selectedImage, this.some.bind(this));
      } else {
        this.auth.updateUser(this.registerForm.value);
      }
    }
  }
  resetForm() {
    this.imageUrl = '../../assets/img/avatar2.png';
    this.selectedImage = null;
  }
}
