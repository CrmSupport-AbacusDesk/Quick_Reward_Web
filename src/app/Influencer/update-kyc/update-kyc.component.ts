import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute ,Router} from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { sessionStorage } from 'src/app/localstorage.service';
import { DatabaseService } from 'src/_services/DatabaseService';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-update-kyc',
  templateUrl: './update-kyc.component.html'
})
export class UpdateKycComponent implements OnInit {
  userData: any;
  userId: any;
  userName: any;
  data:any ={};
  savingFlag:boolean = false;
  assign_login_data:any={};
  logined_user_data:any={};
  kyc_id:any;
  encryptedData: any;
  decryptedData:any;
  
  constructor(@Inject(MAT_DIALOG_DATA)public modelData,  public cryptoService:CryptoService, public dialogs: MatDialog, public toast:ToastrManager,  public session: sessionStorage, public ActivatedRoute : ActivatedRoute , public service : DatabaseService , public route :  Router, public dialogRef: MatDialogRef<UpdateKycComponent>) { 
    this.kyc_id = modelData.kyc_id;
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
  }
  
  ngOnInit() {
  }
  
  submitDetail() {
    this.savingFlag = true;
    this.data.created_by_id = this.logined_user_data.id;
    this.data.created_by_name = this.logined_user_data.name;
    this.data.id = this.kyc_id;
    this.encryptedData = this.service.payLoad ? {'data':this.data,}: this.cryptoService.encryptData({'data':this.data,});
    this.service.post_rqst(this.encryptedData, this.modelData.kyc_type == 'secondary' ? 'CustomerNetwork/updateKycStatus' : 'Influencer/updateKycStatus').subscribe((result)=>
      {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.toast.successToastr('KYC Successfully Updated');
        this.savingFlag = false;
        this.dialogRef.close(true);
      }
      else{
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.savingFlag = false;
      }
    });
  }
  
}
