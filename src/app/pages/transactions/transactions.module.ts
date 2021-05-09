import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionsPage } from './transactions.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { TransactionsPageRoutingModule } from './transactions-routing.module';
import { HeaderComponent } from '../../shared/components/header/header.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    TransactionsPageRoutingModule
  ],
  declarations: [TransactionsPage, HeaderComponent]
})
export class TransactionsPageModule {}
