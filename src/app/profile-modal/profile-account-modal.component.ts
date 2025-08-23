import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';
import { DialogComponent } from 'src/app/dialog.component';
import { CryptoService } from 'src/_services/CryptoService';
import { ProgressService } from 'src/app/progress.service';


@Component({
    selector: 'app-profile-account-modal',
    templateUrl: './profile-account-modal.component.html'
})
export class ProfileAccountModalComponent implements OnInit {
    encryptedData: any;
    accList:any=[]
    savingFlag: boolean = false;

    constructor(@Inject(MAT_DIALOG_DATA) public data, public cryptoService:CryptoService, public service: DatabaseService, public dialogRef: MatDialogRef<ProfileAccountModalComponent>) {
        this.fetchAccountList()
    }

    ngOnInit(){}

    fetchAccountList(){
        this.encryptedData = this.service.payLoad ? {} : 
        this.cryptoService.encryptData({});
    
        this.service.post_rqst(this.encryptedData, 'login/getChildAccountNames').subscribe(result => {
          if(result['statusCode']==200){
            this.accList = result['company_names']
          }
        })
      }

      udpateActiveAcc(){
        let selectedAcc = this.accList.filter(row=>row.dr_code == this.data.activeAcc)
        localStorage.setItem('activeAcc', JSON.stringify(selectedAcc[0]))
        this.dialogRef.close(selectedAcc[0])
        location.reload();
      }
}