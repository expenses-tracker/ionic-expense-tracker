import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsPage } from './settings.page';

import { SettingsPageRoutingModule } from './settings-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { PhotoService } from '../../shared/services/photo/photo.service';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: SettingsPage }]),
    SettingsPageRoutingModule,
    SharedModule
  ],
  declarations: [SettingsPage],
  providers: [
    PhotoService
  ]
})
export class SettingsPageModule {}
