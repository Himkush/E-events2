import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../shared/service/auth.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  resetForm: FormGroup;
  loading = false;
  @Input() isAdmin?: boolean;
  formSubmitted = false;
  constructor(private auth: AuthService) {
  }

  ngOnInit() {

    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required)
    });
    this.resetForm = new FormGroup({
      resetEmail: new FormControl(null, [Validators.required, Validators.email])
    });
  }
  login() {
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value.email, this.loginForm.value.password, this.isAdmin);
    } else {
      this.formSubmitted = true;
    }
    this.loginForm.reset();
  }
  resetPassword() {
    if (this.resetForm.valid) {
      this.auth.resetPassword(this.resetForm.get('resetEmail').value);
    } else {
      alert('enter valid email id');
    }
  }
}
