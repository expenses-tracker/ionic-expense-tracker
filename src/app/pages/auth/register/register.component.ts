import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastType } from '../../../core/models/toaster-input.model';
import { UserDetails } from '../../../core/models/userdetails.model';

import { AuthService } from '../../../core/services/auth.service';
import { ToasterService } from '../../../core/services/toaster.service';
import { LoggerService } from '../../../core/services/logger.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  apiInProgress = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toaster: ToasterService,
    private logger: LoggerService
  ) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9.%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(4)]],
      agreeTerms: [false]
    });
  }

  get repeatPassword() { return this.registerForm.get('repeatPassword'); }

  get password() { return this.registerForm.get('password'); }

  doesPasswordsMatch() {
    return this.password.value !== this.repeatPassword.value;
  }

  onRegister() {
    const userDetail = new UserDetails();
    userDetail.fullName = this.registerForm.get('fullName').value;
    userDetail.email = this.registerForm.get('email').value;
    userDetail.password = this.password.value;
    userDetail.agreeTerms = this.registerForm.get('agreeTerms').value;
    this.apiInProgress = true;
    this.authService.register(userDetail).subscribe({
      next: (resp) => {
        this.toaster.showToast({
          type: ToastType.success,
          content: `Registration Successful.`
        });
        this.router.navigateByUrl(`/auth/login`);
      },
      complete: () => {
        this.apiInProgress = false;
      }
    });
  }

}
