import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { throwError } from 'rxjs';
import { LoggerService } from 'src/app/core/services/logger.service';
import { IPhoto } from '../../models/photo.model';

@Injectable()
export class PhotoService {

  public photo: IPhoto;

  constructor(private sanitizer: DomSanitizer, private logger: LoggerService) { }

  public async addNewToGallery() {
    try {
      // Take a photo
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri, // file-based data; provides best performance
        source: CameraSource.Camera, // automatically take a new photo with the camera
        quality: 100 // highest quality (0 to 100)
      });

      // Save the picture and add it to photo collection
      const savedImageFile = await this.savePicture(capturedPhoto);
      this.photo = savedImageFile;
    } catch (error) {
      this.logger.error(error);
    }
  }

  private async savePicture(cameraPhoto: Photo) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(cameraPhoto);

    // Write the file to the data directory
    const fileName = `${new Date().getTime()}.${cameraPhoto.format}`;

    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory
    return {
      // webviewPath: this.sanitizer.bypassSecurityTrustUrl(cameraPhoto.webPath),
      path: fileName,
      data: base64Data
    };
  }

  private async readAsBase64(cameraPhoto: Photo) {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(cameraPhoto.webPath);
    const blob = await response.blob();

    return await this.convertBlobToBase64(blob) as string;
  }

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}
