import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';

import { LoggerService } from '../../../core/services/logger.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() title: string;
  @Input() hideSettingsNavIcon?: boolean;

  constructor(
    private actionSheet: ActionSheetController,
    private router: Router,
    private logger: LoggerService) { }

  ngOnInit() {}

  onAdd() {
    this.presentActionSheet();
  }

  onSettings() {
    this.navigateToRoute('/tabs/settings');
  }

  onHome() {
    this.navigateToRoute('/tabs/dashboard');
  }

  navigateToRoute(route: string) {
    this.router.navigateByUrl(route);
  }

  private async presentActionSheet() {
    const actionSheet = await this.actionSheet.create({
      header: 'Add',
      buttons: [{
        text: 'Expense',
        handler: () => {
          this.logger.debug('Expense clicked');
        }
      }, {
        text: 'Income',
        handler: () => {
          this.logger.debug('Income clicked');
        }
      }, {
        text: 'Category',
        handler: () => {
          this.logger.debug('Category clicked');
        }
      }, {
        text: 'Payment Type',
        handler: () => {
          this.logger.debug('Payment Type clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          this.logger.debug('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    this.logger.debug('onDidDismiss resolved with role', role);
  }
}
