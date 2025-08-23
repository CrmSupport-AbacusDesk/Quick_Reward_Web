import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private downloadProgress = new BehaviorSubject<number>(0);
  private downloaderActive = new BehaviorSubject<boolean>(false);
  private cancelReq = new BehaviorSubject<boolean>(false);
  private totalCount = new BehaviorSubject<number>(0);
  private remainingCount = new BehaviorSubject<number>(0);
  private UploadProgress = new BehaviorSubject<number>(0);
  private uploadFile = new BehaviorSubject<string>('');
  private UploaderActive = new BehaviorSubject<boolean>(false);
  constructor() { }

  getDownloadProgress() {
    return this.downloadProgress.asObservable();
  }

  setDownloadProgress(progress: number) {
    this.downloadProgress.next(progress);
  }

  getDownloaderActive() {
    return this.downloaderActive.asObservable();
  }

  setDownloaderActive(active: boolean) {
    this.downloaderActive.next(active);
  }
  
  getUploadProgress() {
    return this.UploadProgress.asObservable();
  }

  setUploadProgress(progress: number) {
    this.UploadProgress.next(progress);
  }

  getCancelReq() {
    return this.cancelReq.asObservable();
  }

  setCancelReq(active: boolean) {
    this.cancelReq.next(active);
  }

  getUploaderActive() {
    return this.UploaderActive.asObservable();
  }

  setUploaderActive(active: boolean) {
    this.UploaderActive.next(active);
  }
  setTotalCount(totalCount: number){
    this.totalCount.next(totalCount);
  }
  getTotalCount(){
    return this.totalCount.asObservable();
  }
  setRemainingCount(remainingCount: number){
    this.remainingCount.next(remainingCount);
  }
  getRemainingCount(){
    return this.remainingCount.asObservable();
  }
  setUploaderDownloadUrl(fileName){
    this.uploadFile.next(fileName);

  }
 getUploaderDownloadUrl(){
    return this.uploadFile.asObservable();
  }
}
