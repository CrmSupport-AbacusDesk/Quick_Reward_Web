import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';

@Component({
    selector: 'app-scheme-list',
    templateUrl: './scheme-list.component.html'
})
export class SchemeListComponent implements OnInit {

    dataList:any=[];
    loader:boolean=false;

    constructor(public service:DatabaseService, public confirmDialog:DialogComponent, public cryptoService:CryptoService, public toast: ToastrManager) {
       this.fetchData()
    }
    
    ngOnInit() {}

    refresh(){
      this.fetchData()
    }

    fetchData() {
        this.loader = true;
        this.service.post_rqst({}, 'Scheme/SchemeListing').subscribe((result) => {
          this.loader = false;
          if (result['statusCode'] == 200) {
           this.dataList = result['result'];
           this.dataList.forEach(item => item['encrypt_id'] = this.cryptoService.encryptId(item['id']));
          }
          else {
            this.toast.errorToastr(result['statusMsg'])
          }
        }
        )
      }

    deleteHandler(id){
      this.confirmDialog.confirm("Are you sure ?").then((result) => {
        if (result) {
          this.deleteRow(id)
        }
      })
    }

    deleteRow(id){
      this.service.post_rqst({id}, 'Scheme/deleteScheme').subscribe((result) => {
        if (result['statusCode'] == 200) {
          this.toast.successToastr(result['statusMsg']);
          this.fetchData()
        }
        else {
          this.toast.errorToastr(result['statusMsg'])
        }
      }
      )
    }
    

    
}