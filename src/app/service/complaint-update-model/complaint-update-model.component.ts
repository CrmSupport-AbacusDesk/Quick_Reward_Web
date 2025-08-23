import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-complaint-update-model',
  templateUrl: './complaint-update-model.component.html',
  styleUrls: ['./complaint-update-model.component.scss']
})
export class ComplaintUpdateModelComponent implements OnInit {

  formData: any = {}
  savingFlag: boolean = false;
  currentDate: Date;
  warranty_period: any;
  date_of_purchase: any;
  url: any;
  image = new FormData();
  image_id: any;
  delaerId: any;

  errorMsg: boolean = false;
  selected_image: any = [];
  dealerList: any = [];
  encryptedData: any;
  decryptedData:any;


  constructor(@Inject(MAT_DIALOG_DATA) public data, public cryptoService:CryptoService, public dialog: MatDialog, public service: DatabaseService, public session: sessionStorage, public toast: ToastrManager, public dialogRef: MatDialogRef<ComplaintUpdateModelComponent>) {

    this.url = this.service.uploadUrl + 'product_image/';
    console.log(data);
  }

  ngOnInit() {
    this.currentDate = new Date();
    this.getDealerList('');
  }


  getDealerList(search) {
    this.encryptedData = this.service.payLoad ? { 'search': search }: this.cryptoService.encryptData({ 'search': search });
    this.service.post_rqst(this.encryptedData, "ServiceTask/dealerList").subscribe((result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
    if (this.decryptedData['statusCode'] == 200) {
        this.dealerList = this.decryptedData['dealer'];
      }
    }))


  }
  get_dealer_detail(id){
    if (id) {
      let index = this.dealerList.findIndex(d => d.id == id);
      if (index != -1) {
        this.formData.dealer_name = this.dealerList[index].name;
        this.formData.dealer_company_name = this.dealerList[index].company_name;
        this.formData.dealer_mobile = this.dealerList[index].mobile;
      }
    }
  }


  deleteProductImage(arrayIndex, id, name) {

    if (id) {
      this.encryptedData = this.service.payLoad ? { 'image_id': id, 'image': name }: this.cryptoService.encryptData({ 'image_id': id, 'image': name });
      this.service.post_rqst(this.encryptedData, "Master/productImageDeleted").subscribe((result => {
          this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
       
        if (this.decryptedData['statusCode'] == '200') {
          this.toast.successToastr(this.decryptedData['statusMsg']);
          this.selected_image.splice(arrayIndex, 1);

        } else {
          this.toast.errorToastr(this.decryptedData['statusMsg']);
        }
      }
      ))
    }
    else {
      this.selected_image.splice(arrayIndex, 1);
    }
    // this.selected_image.splice(arrayIndex, 1);


  }

  // add image
  onUploadChange(data: any) {
    this.errorMsg = false;
    this.image_id = '';
    for (let i = 0; i < data.target.files.length; i++) {
      let files = data.target.files[i];
      if (files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.selected_image.push({ "image": e.target.result });
        }
        reader.readAsDataURL(files);
      }
      this.image.append("" + i, data.target.files[i], data.target.files[i].name);
    }
  }


  update() {
    this.formData.image = this.selected_image ? this.selected_image : [];

    this.formData.complaint_id = this.data.id
    this.savingFlag = true;
    this.encryptedData = this.service.payLoad ? { 'data': this.formData }: this.cryptoService.encryptData({ 'data': this.formData });

    this.service.post_rqst(this.encryptedData, "ServiceTask/complaintStatus").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      
      if (this.decryptedData['statusCode'] == 200) {
        this.dialogRef.close(true);
        this.toast.successToastr(this.decryptedData['statusMsg']);
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg'])
        this.savingFlag = false;
      }
    }))
  }

  // engineerList: any = [];
  // filter: any = {};
  // assign_engineerget(searcValue) {
  //   this.filter.technician_detail = searcValue;
  //   this.filter.state = this.data.state;
  //   this.service.post_rqst({ 'filter': this.filter, }, 'ServiceTask/plumberList').subscribe((resp) => {
  //     if (resp['statusCode'] == 200) {
  //       this.engineerList = resp.data;
  //       console.log(this.engineerList);
  //     }
  //     else {
  //       this.toast.errorToastr(resp['statusMsg'])
  //     }
  //   }, error => {
  //   })
  // }

  // getCarpenterInfo(id)
  // {
  //   console.log(id);
  //   if(id){
  //     let index= this.engineerList.findIndex(d=> d.id==id);
  //     if(index!=-1){
  //       this.formData.id= this.engineerList[index].id;
  //       this.formData.name= this.engineerList[index].name;
  //       this.formData.mobile_no= this.engineerList[index].mobile_no;
  //     }
  //     console.log(this.data.id);
  //     console.log(this.data.mobile_no);
  //     console.log(this.data.name);
  //   }
  // }

  // assign_engineer(){
  //   this.savingFlag = true;
  //   this.service.post_rqst({'complaint_id':this.data.id,'data':this.formData},"ServiceTask/carpenterAssign").subscribe((result)=>{

  //     if(result['statusCode']==200)
  //     {
  //       this.toast.successToastr(result['statusMsg']);
  //       this.dialogRef.close(true);
  //     }else{
  //       this.toast.errorToastr(result['statusMsg']);
  //       this.savingFlag = false;

  //     }
  //   })
  // }

}
