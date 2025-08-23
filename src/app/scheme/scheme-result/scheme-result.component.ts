import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { SchemeModalComponent } from '../scheme-modal/scheme-modal.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-scheme-result',
  templateUrl: './scheme-result.component.html',
  styleUrls: ['./scheme-result.component.scss']
})
export class SchemeResultComponent implements OnInit {
  
  encryptedData: any;
  decryptedData:any;
  dataList:any;
  allSlabDataList:any;
  dataListCount:any;
  loader:boolean=false;
  schemeId:any=1;
  slabId:any=1;
  resultType:any;
  downurl: any = '';
  filter: any = {};
  active_tab:any='Inprocess'
  slabData:any={}
  
  constructor(public navParam:ActivatedRoute, public location: Location, public service:DatabaseService, public dialog: MatDialog, public confirmDialog:DialogComponent, public cryptoService:CryptoService, public toast: ToastrManager) {
    this.schemeId = this.navParam['params']['_value']['id']
    this.slabId = this.navParam.queryParams['_value']['slabId'];
    this.slabData = this.navParam.queryParams['_value']['slabData'] ? JSON.parse(this.navParam.queryParams['_value']['slabData']) : '';
    this.resultType = this.navParam.queryParams['_value']['resultType'];
    this.downurl = service.downloadUrl;
    console.log(this.slabData)
    this.filter.slab_status = this.active_tab
    
    if (this.resultType == 'AllSlabResult') {
      this.fetchAllSlabResultData();
    }
    else
    {
      this.fetchData()
    }
  }
  
  ngOnInit() {}
  
  back(): void {
    this.location.back()
  }
  
  refresh(){
    this.filter = {'slab_status':this.active_tab};
    if (this.resultType == 'AllSlabResult') {
      this.fetchAllSlabResultData();
    }
    else
    {
      this.fetchData()
    }
  }
  
  fetchData() {
    this.loader = true;
    this.encryptedData = this.service.payLoad ? {scheme_id:this.schemeId, scheme_slab_id:this.slabId, 'search' : this.filter}: this.cryptoService.encryptData({scheme_id:this.schemeId, scheme_slab_id:this.slabId, 'search' : this.filter});
    this.service.post_rqst(this.encryptedData, 'Scheme/schemeResults').subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      this.loader = false;
      if (this.decryptedData['statusCode'] == 200) {
        this.dataList = this.decryptedData['result'];
        this.dataListCount = this.decryptedData['count'];
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg'])
      }
    }
  )
}

fetchAllSlabResultData() {
  this.loader = true;
  this.encryptedData = this.service.payLoad ? {scheme_id:this.schemeId, scheme_slab_id:this.slabId , 'search' : this.filter}: this.cryptoService.encryptData({scheme_id:this.schemeId, scheme_slab_id:this.slabId, 'search' : this.filter});
  this.service.post_rqst(this.encryptedData, 'Scheme/schemeAllSlabResults').subscribe((result) => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
    this.loader = false;
    if (this.decryptedData['statusCode'] == 200) {
      this.allSlabDataList = this.decryptedData['result']
      this.dataListCount = this.decryptedData['count'];
      console.log(this.allSlabDataList);
      
    }
    else {
      this.toast.errorToastr(this.decryptedData['statusMsg'])
    }
  }
)
}


openDialog(type:string, data:any=[], slabData:any={}): void {
  const dialogRef = this.dialog.open(SchemeModalComponent, {
    width: '400px',
    panelClass: 'cs-model',
    data: {
      formData:data,
      otherData:slabData,
      type:type
    }
    
  });
  
  dialogRef.afterClosed().subscribe(result => {
    if (result != false) {
      console.log('dialog closed')
    }
  });
}


}