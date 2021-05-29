import { Component, OnInit } from '@angular/core';
import { UserDetailService } from './core/services/user-detail.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private userDetailService: UserDetailService) {}

  ngOnInit() {
    this.userDetailService.currentUser();
  }
}
