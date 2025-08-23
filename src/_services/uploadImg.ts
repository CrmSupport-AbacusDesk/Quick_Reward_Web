import { Injectable } from '@angular/core';
import {HttpErrorResponse } from "@angular/common/http";
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class uploadImgService {

  constructor() { }
  processImageFile(file: File, maxSizeMB: number = 2): Promise<{ dataURL: string, cleanedFile: File }> {
    return new Promise((resolve, reject) => {
        const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
        const byte = 1000000; // 1 MB in bytes

        if (!allowedTypes.includes(file.type)) {
            return reject('Only .png, .jpg, .jpeg files are accepted');
        }

        if (file.size > (maxSizeMB * byte)) {
            return reject(`Image file size is too large, maximum file size is ${maxSizeMB} MB.`);
        }

        const reader = new FileReader();
        reader.onload = (e: any) => {
            const img = new Image();
            img.src = e.target.result;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d')!;
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const dataURL = canvas.toDataURL(file.type);
                fetch(dataURL)
                    .then(res => res.blob())
                    .then(blob => {
                        const cleanedFile = new File([blob], file.name, { type: file.type });
                        resolve({ dataURL, cleanedFile });
                    })
                    .catch(err => reject(err));
            };

            img.onerror = () => reject('Error loading image');
        };

        reader.onerror = () => reject('Error reading file');
        reader.readAsDataURL(file);
    });
}

}
