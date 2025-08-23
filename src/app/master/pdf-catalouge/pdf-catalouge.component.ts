import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
@Component({
  selector: 'app-pdf-catalouge',
  templateUrl: './pdf-catalouge.component.html'
})
export class PdfCatalougeComponent implements OnInit {
  fabBtnValue:any= 'add'
  skLoading:boolean = false;
  pdfCatalouge_data:any=[];
  loader:boolean = false;
  document:any =[];
  url:any;
  pageCount:any;
  total_page:any;
  pagenumber:any=1;
  logined_user_data:any={};
  assign_login_data:any={};
  page_limit:any;
  start:any=0;
  count:any;
  filter: {};
  sr_no: number;
  encryptedData: any;
  decryptedData:any;

  constructor(public service:DatabaseService,  public cryptoService:CryptoService, public toast: ToastrManager, public dialog:DialogComponent,public session: sessionStorage) 
  {
    this.page_limit = this.service.pageLimit;
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    this.url = service.uploadUrl + 'doc_catalogue/';
    this.getPdfList(); 
  }
  
  
  ngOnInit() {
  }
  pervious(){
    this.start = this.start - this.page_limit;
    this.getPdfList();
  }
  
  nextPage(){
    this.start = this.start + this.page_limit;
    this.getPdfList();
  }
  
  lastBtnValue(value){
    this.fabBtnValue = value;
  }
  
  getPdfList() {
    this.loader = true;
    if(this.pagenumber > this.total_page){
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if(this.start<0){
      this.start=0;
    }
    this.encryptedData = this.service.payLoad ? {'start':this.start,'pagelimit':this.page_limit}: this.cryptoService.encryptData({'start':this.start,'pagelimit':this.page_limit});
    this.service.post_rqst(this.encryptedData, "Master/documentCatalogueList").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if(this.decryptedData['statusCode'] == 200){
        this.document = this.decryptedData['doc_list']
        this.pageCount = this.decryptedData['count'];
        
        if(this.pagenumber > this.total_page){
          this.pagenumber = this.total_page;
          this.start = this.pageCount - this.page_limit;
        }
        
        else{
          this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
        }
        this.total_page = Math.ceil(this.pageCount/this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit; 
        setTimeout(() => {
          this.loader = false;
        }, 700);
      }
      else{
        this.toast.errorToastr(this.decryptedData['statusMsg'])
      }
    }
    
    
    ));
    
  }
  
  refresh(){
    this.filter = {};
    this.getPdfList();
  }
  
  delete(id){
    this.dialog.delete('PDF Catalogue!').then((result) => {
      if (result) {
    this.encryptedData = this.service.payLoad ? {'doc_id':id}: this.cryptoService.encryptData({'doc_id':id});
        this.service.post_rqst(this.encryptedData, "Master/deleteDoc").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

          if (this.decryptedData['statusCode'] == 200) {
            this.toast.successToastr(this.decryptedData['statusMsg']);
            this.getPdfList()
          }
          else {
            this.toast.errorToastr(this.decryptedData['statusMsg']);
          }
        })
      }
    });
    
    
  }
  
}
