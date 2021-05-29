import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastType } from '../../../core/models/toaster-input.model';

import { AuthService } from '../../../core/services/auth.service';
import { ToasterService } from '../../../core/services/toaster.service';
import { LoggerService } from '../../../core/services/logger.service';
import { UserDetailService } from '../../../core/services/user-detail.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  apiInProgress = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toaster: ToasterService,
    private logger: LoggerService,
    private userDetails: UserDetailService) { }

  get emailValue(): string {
    return this.loginForm.get('email').value;
  }

  ngOnInit() {
    this.authService.clearAuthData();
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9.%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      rememberMe: [false]
    });
  }

  onLogin() {
    this.apiInProgress = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (resp) => {
        if (this.authService.isAuthenticated()) {
          this.toaster.showToast({
            type: ToastType.success,
            content: 'Login Successful'
          });
          this.userDetails.getUserData(this.emailValue).subscribe();
          this.router.navigateByUrl('/tabs/dashboard');
        } else {
          this.handleLoginError(`Unable to authenticate. No token found.`);
        }
      },
      error: (err) => this.handleLoginError(err)
    });
  }

  handleLoginError(err: any) {
    this.apiInProgress = false;
    this.toaster.showToast({
      type: ToastType.danger,
      content: 'Login Failed. Please try again.'
    });
    this.logger.error(err);
  }

}
