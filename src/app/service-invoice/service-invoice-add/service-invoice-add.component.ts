import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { Location } from '@angular/common';


@Component({
  selector: 'app-service-invoice-add',
  templateUrl: './service-invoice-add.component.html',
  styleUrls: ['./service-invoice-add.component.scss']
})
export class ServiceInvoiceAddComponent implements OnInit {

  technicianData:any={}
  row: any = {}
  formData:any={}
  data2:any={}
  loader: boolean = false;
  engineerList: any = [];
  complaintList: any = [];
  add_list: any = [];
  spareList: any = [];
  savingFlag:boolean = false;
  filter: any = {};
  complain_id:any={}
  addToListButton: boolean = true;


  constructor(@Inject(MAT_DIALOG_DATA) public data,public service: DatabaseService,public rout: Router,public toast: ToastrManager,private route: ActivatedRoute,public dialog: DialogComponent,public dialog2: MatDialog,public location: Location,public dialogRef: MatDialogRef<ServiceInvoiceAddComponent>) {
    this.technicianData.sub_total=0;
    this.data2=data.data


    this.technicianData.technician_id=data.data.carpenter_id
    this.technicianData.technician_name=data.data.carpenter_name
    this.technicianData.complaint_id=data.data.id
    this.technicianData.complain_no=data.data.complain_no
    this.technicianData.customer_id=data.data.customer_id
    this.technicianData.customer_name=data.data.customer_name
    this.technicianData.customer_mobile=data.data.customer_mobile

    console.log(this.data2);

    this.spareList=data.data.spare_list
    console.log(this.spareList);

    this.technicianData.total=0
  }

  ngOnInit() {
  }

  back(): void {
    this.location.back();
  }

  addInvoice() {
    this.technicianData = this.technicianData
    this.savingFlag = true;
    this.service.post_rqst({ "add_list": this.spareList,"data":this.technicianData }, "ServiceInvoice/serviceInvoiceAdd").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.dialogRef.close(true);
        this.toast.successToastr(result['statusMsg']);
        setTimeout(() => {
          this.savingFlag = false;
        }, 700);
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }))
  }

  calculation(i){
    if (this.spareList[i].discount=='') {
      this.spareList[i].discount=0;
    }
    this.spareList[i].amount = (parseFloat(this.spareList[i].mrp)*parseInt(this.spareList[i].qty));

    this.spareList[i].total = (parseFloat(this.spareList[i].mrp)*parseInt(this.spareList[i].qty))-(((parseFloat(this.spareList[i].mrp)*parseInt(this.spareList[i].qty))/100)*this.spareList[i].discount);

      this.spareList[i].discount_amount = (parseFloat(this.spareList[i].mrp)*parseInt(this.spareList[i].qty))* (parseFloat(this.spareList[i].discount) / 100);

      this.spareList[i].final_amount = (parseFloat(this.spareList[i].mrp)*parseInt(this.spareList[i].qty)) - (parseFloat(this.spareList[i].discount_amount));

    console.log(this.spareList[i]);
    console.log(this.spareList);

    this.technicianData.sub_total=0
    this.technicianData.discount=0

    this.technicianData.gst_amount=0


    for (let index = 0; index < this.spareList.length; index++) {
      this.technicianData.sub_total += (parseFloat(this.spareList[index].mrp)*parseFloat(this.spareList[index].qty));

      this.technicianData.discount += (parseFloat(this.spareList[index].qty) * parseFloat(this.spareList[index].mrp)) * (parseFloat(this.spareList[index].discount) / 100);

      this.technicianData.gst_amount = (parseFloat(this.technicianData.sub_total) - parseFloat(this.technicianData.discount)) * (parseFloat('18') / 100);

      this.technicianData.total = (parseFloat(this.technicianData.sub_total) - parseFloat(this.technicianData.discount)) + (parseFloat(this.technicianData.gst_amount));
    }

  }
  calculateServiceCharge(){
    console.log(this.technicianData.total);
    this.technicianData.total = (parseFloat(this.technicianData.service_charge))+(parseFloat(this.technicianData.total));
    console.log(this.technicianData.service_charge);
    console.log(this.technicianData.total);
  }

}
