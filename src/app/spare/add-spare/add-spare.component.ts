import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { DialogComponent } from 'src/app/dialog.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'app-add-spare',
  templateUrl: './add-spare.component.html',
  styleUrls: ['./add-spare.component.scss']
})
export class AddSpareComponent implements OnInit {

  formData:any={}
  dealerList: any = [];
  warrantyBase64: boolean = false;
  part_img_id: any;
  uploadurl: any;
  image = new FormData();
  savingFlag: boolean = false;
  id:any;
  type:any;
  addData:any={}
  url:any;
  params_network:any;



  constructor(@Inject(MAT_DIALOG_DATA) public data,public service: DatabaseService,public rout: Router,public toast: ToastrManager,private route: ActivatedRoute,public dialog: DialogComponent,public dialog2: MatDialog,public dialogRef: MatDialogRef<AddSpareComponent>) {

    this.route.params.subscribe(params => {
      this.id =  params.id;
      console.log(this.id);
      
      
    });
    console.log(data);
    
    this.uploadurl = this.service.uploadUrl + 'service_task/'
    this.url = this.service.uploadUrl + 'service_task/'


      this.route.params.subscribe(params => {
        this.type=data.type
        this.id = data.id;
        this.part_img_id = data.id;
        this.formData.part_name=data.detail.part_name
        this.formData.part_no=data.detail.part_no
        this.formData.mrp=data.detail.mrp
        this.formData.min_stock=data.detail.min_stock
        this.formData.current_stock=data.detail.current_stock
        this.formData.image=data.detail.image
      });
   }

  ngOnInit() {
  }


  part_image_Upload(data: any) {
    for (let i = 0; i < data.target.files.length; i++) {

      let files = data.target.files[i];
      if (files) {
        this.part_img_id = '';
        this.warrantyBase64 = true;
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.formData.image = e.target.result
        }
        reader.readAsDataURL(files);
      }
      else {
        this.warrantyBase64 = false;
      }
      this.image.append("" + i, data.target.files[i], data.target.files[i].name);
    }
  }

  submit() {
    this.formData.id=this.id
    this.savingFlag = true;
    let header
    if (this.id) {
      header = this.service.post_rqst({ "data": this.formData, 'type': 'Edit', 'id': this.id }, "ServiceSparePart/sparePartAdd")
    }
    else {
      header = this.service.post_rqst({ "data": this.formData, 'type': 'Add', }, "ServiceSparePart/sparePartAdd")
    }
    header.subscribe((result => {
      if (result['statusCode'] == 200) {
        this.dialogRef.close(true);
        this.toast.successToastr(result['statusMsg']);
        this.savingFlag = false;
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
        this.savingFlag = false;
      }

    }));
  }

}
