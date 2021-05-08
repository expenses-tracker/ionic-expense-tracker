import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ToasterInput } from '../models/toaster-input.model';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(private toaster: ToastController) { }

  async showToast(input: ToasterInput) {
    const toast = await this.toaster.create({
      animated: true,
      color: input.type,
      header: input.title || '',
      message: input.content,
      position: input.position || 'bottom',
      duration: 2000,
      buttons: []
    });
    await toast.present();
  }
}
