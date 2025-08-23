import { Component, OnInit, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-secondary-scheme-modal',
  templateUrl: './secondary-scheme-modal.component.html'
})
export class SecondarySchemeModalComponent implements OnInit {

  company_name: any ;
  contact_person: any ;
  mobile_no: any ;
  dr_id: any ;
  scheme_id: any ;
  slab_id: any ;
  slab_type: any ;
  skLoading: boolean = false ;
  invoiceDetails: any = [];
  scheme_for: any ;
  scheme_type: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data, public serve: DatabaseService,public location: Location, public dialogs: MatDialog,public navparams: ActivatedRoute, public router: Router, private route: ActivatedRoute,public toast: ToastrManager) { 
    this.company_name = this.data.company_name ;
    this.mobile_no = this.data.mobile ;
    this.contact_person = this.data.name;
    this.scheme_id = this.data.scheme_id;
    this.dr_id = this.data.dr_id;
    this.scheme_for = this.data.scheme_for;
    this.slab_id = this.data.slab_id;
    this.slab_type = this.data.slab_type;
    
    if (this.slab_id) {   

      this.getInvoices();
      console.log('1');
      
    }
    else
    {
      console.log('2');
      
      this.getInvoicesWithoutSlabDetails();
    }
  }

  ngOnInit() {

  }

  toInvoice(id){
    this.router.navigate(['/secondary-bill-upload-list/secondary-bill-upload-detail/' + id], { queryParams: { id: id }});
    this.dialogs.closeAll();
  }
  
  getInvoices(){
    this.skLoading = true;
    this.serve.post_rqst({'scheme_id': this.scheme_id , 'slab_id' : this.slab_id, 'user_id' : this.dr_id }, "SecondaryScheme/slabSalesDetails")
    .subscribe((result => {
      if (result['statusCode'] == 200) {
        this.invoiceDetails = result['result'];
        this.skLoading = false;
        this.scheme_type = this.invoiceDetails.scheme_type;
        
        setTimeout(() => {
          this.skLoading = false;
        }, 700);
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }))
  }

  getInvoicesWithoutSlabDetails(){
    this.skLoading = true;
    this.serve.post_rqst({'scheme_id': this.scheme_id ,'user_id' : this.dr_id }, "SecondaryScheme/schemeWithoutSlabDetails")
    .subscribe((result => {
      if (result['statusCode'] == 200) {
        this.invoiceDetails = result['result'];
        this.skLoading = false;
        this.scheme_type = this.invoiceDetails.scheme_type;
        
        setTimeout(() => {
          this.skLoading = false;
        }, 700);
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }))
  }
}
