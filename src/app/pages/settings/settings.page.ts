import { AfterViewInit, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { UserDetails } from '../../core/models/userdetails.model';

import { UserDetailService } from '../../core/services/user-detail.service';
import { PhotoService } from '../../shared/services/photo/photo.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage implements AfterViewInit {

  user$: Observable<UserDetails>;
  photo: string;

  constructor(
    private userDetails: UserDetailService,
    private authService: AuthService,
    private photoService: PhotoService,
    private router: Router
  ) { }

  ngAfterViewInit() {
    this.getProfile();
  }

  getProfile() {
    this.user$ = this.userDetails.currentUser$().pipe(
      tap(() => this.getProfilePhoto())
    );
  }

  getProfilePhoto() {
    this.photo = this.photoService.photo?.data || (this.userDetails.currentUser()?.photo?.data || null);
  }

  onCameraSelect() {
    this.photoService.addNewToGallery().then(() => {
      this.getProfilePhoto();
      if (this.photo !== null) {
        this.userDetails.updatePhoto(this.photoService.photo).subscribe();
      }
    });
  }

  onLogOut() {
    return this.authService.logout({
      email: this.userDetails.currentUser().email
    }).pipe(
      tap(() => {
        this.router.navigateByUrl('/auth/login');
      })
    ).subscribe();
  }
}
