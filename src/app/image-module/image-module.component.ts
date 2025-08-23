import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AttendanceDetailComponent } from '../attendance-detail/attendance-detail.component';

@Component({
  selector: 'app-image-module',
  templateUrl: './image-module.component.html',
  styleUrls: ['./image-module.component.scss']
})
export class ImageModuleComponent implements OnInit {

  scale: number = 0.5;  // To handle zoom level
  rotation: number = 0;  // To handle rotation
  isDragging = false;
  lastX = 0;
  lastY = 0;
  posX = 0;
  posY = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public dialogRef: MatDialogRef<AttendanceDetailComponent>
  ) { }

  ngOnInit() { }

  close() {
    this.dialogRef.close();
  }

  zoomIn() {
    this.scale += 0.1;
  }

  zoomOut() {
    if (this.scale > 0.1) {
      this.scale -= 0.1;
    }
  }

  rotate() {
    this.rotation += 90;
  }

  startDragging(event: MouseEvent | TouchEvent) {
    this.isDragging = true;
    const clientX = this.getClientX(event);
    const clientY = this.getClientY(event);
    this.lastX = clientX;
    this.lastY = clientY;
  }

  stopDragging() {
    this.isDragging = false;
  }

  onDrag(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    const clientX = this.getClientX(event);
    const clientY = this.getClientY(event);
    this.posX += clientX - this.lastX;
    this.posY += clientY - this.lastY;
    this.lastX = clientX;
    this.lastY = clientY;
  }

  private getClientX(event: MouseEvent | TouchEvent): number {
    return (event instanceof MouseEvent) ? event.clientX : event.touches[0].clientX;
  }

  private getClientY(event: MouseEvent | TouchEvent): number {
    return (event instanceof MouseEvent) ? event.clientY : event.touches[0].clientY;
  }
}
