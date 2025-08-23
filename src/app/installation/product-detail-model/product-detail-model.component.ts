import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';

@Component({
  selector: 'app-product-detail-model',
  templateUrl: './product-detail-model.component.html',
  styleUrls: ['./product-detail-model.component.scss']
})
export class ProductDetailModelComponent implements OnInit {

  data2:any={}
  add_list: any = [];
  id;
  savingFlag:boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data,public dialogRef: MatDialogRef<ProductDetailModelComponent>,public service: DatabaseService,public toast: ToastrManager,public alert:DialogComponent,public dialog:MatDialog) { 
    console.log(this.data);

    this.add_list=this.data.row
    console.log(this.add_list);
    
  }

  ngOnInit() {
  }
  close() {
    this.dialogRef.close();
  }
}
