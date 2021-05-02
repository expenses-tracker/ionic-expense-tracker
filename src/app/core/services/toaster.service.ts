import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

export enum ToastType {
  primary = 'primary',
  success = 'success',
  warning = 'warning',
  danger = 'danger',
}

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(private toaster: ToastController) { }

  async showToast(type: ToastType, title: string, content: string) {
    const titleContent = title ? `${title}` : '';

    const toast = await this.toaster.create({
      animated: true,
      color: type,
      header: titleContent,
      message: content,
      position: 'top',
      duration: 2000,
      buttons: []
    });
    await toast.present();
  }
}
