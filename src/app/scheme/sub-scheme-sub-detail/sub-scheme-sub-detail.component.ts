import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material';
import { SchemeModalComponent } from '../scheme-modal/scheme-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-sub-scheme-sub-detail',
  templateUrl: './sub-scheme-sub-detail.component.html',
  styleUrls: ['./sub-scheme-sub-detail.component.scss']
})
export class SubSchemeSubDetailComponent implements OnInit {
  schemeDetailsId: any;
  slabId: any;
  skLoading: any = false;
  subSchemeId: any;
  userData: any;
  loader: any = false;
  downurl: any = '';
  slab_type: any;
  subSchemeSubDetails: any ;
  scheme_id: any;
  
  
  constructor(public serve: DatabaseService,public location: Location, public dialogs: MatDialog,public navparams: ActivatedRoute, public router: Router, private route: ActivatedRoute,public toast: ToastrManager) {
      this.route.params.subscribe( (params) => {
          console.log(params);
          this.downurl = serve.downloadUrl;
          this.scheme_id = params.id
          this.subSchemeId = params.subSchemeId;
          this.slabId = params.slabId;
          this.slab_type = params.slab_type;
      }
      );
      this.getSubSchemeSubDetails();
  }
  
  ngOnInit() {
  }
  
  
  back(): void {
      this.location.back()
  }
  
  
  getSubSchemeSubDetails() {
      this.skLoading = true;
      this.serve.post_rqst({'scheme_id': this.scheme_id, 'sub_scheme_id': this.subSchemeId , 'slab_id' : this.slabId }, "Scheme/subSchemeSlabDetails")
      .subscribe((result => {
          if (result['statusCode'] == 200) {
              this.subSchemeSubDetails = result['result'];
              this.userData = result['result']['userData'];
              this.skLoading = false;
              
              setTimeout(() => {
                  this.skLoading = false;
              }, 700);
          }
          else {
              this.toast.errorToastr(result['statusMsg']);
          }
      }))
  }
  
  openDialog(idx) {
      const dialogRef = this.dialogs.open(SchemeModalComponent, {
          width: '1024px',
          data: {
              company_name: this.subSchemeSubDetails.userData[idx].company_name,
              dr_id: this.subSchemeSubDetails.userData[idx].id,
              
              mobile: (this.subSchemeSubDetails.scheme_for == 'Sales user' ? this.subSchemeSubDetails.userData[idx].contact_01 : this.subSchemeSubDetails.userData[idx].mobile),
              name: this.subSchemeSubDetails.userData[idx].name,
              slab_type: this.subSchemeSubDetails.slabData.slab_type ? this.subSchemeSubDetails.slabData.slab_type : '',
              scheme_id: this.schemeDetailsId,
              slab_id: this.slabId,
              scheme_for: this.subSchemeSubDetails.scheme_for
          }
      });
      dialogRef.afterClosed().subscribe(result => {
      });
  }
  
  openDialogWithoutSlab(idx) {
      const dialogRef = this.dialogs.open(SchemeModalComponent, {
          width: '1024px',
          data: {
              company_name: this.subSchemeSubDetails.userData[idx].company_name,
              dr_id: this.subSchemeSubDetails.userData[idx].id,                
              mobile: (this.subSchemeSubDetails.scheme_for == 'Sales user' ? this.subSchemeSubDetails.userData[idx].contact_01 : this.subSchemeSubDetails.userData[idx].mobile),
              name: this.subSchemeSubDetails.userData[idx].name,
              scheme_id: this.schemeDetailsId,
              scheme_for: this.subSchemeSubDetails.scheme_for
          }
      });
      dialogRef.afterClosed().subscribe(result => {
      });
  }
  exportAsXLSX() {
      this.loader = true;
      if (this.subSchemeSubDetails.gift_type == 'Point' && this.subSchemeSubDetails.point_type == 'Product Qty') {
          this.serve.post_rqst({ 'scheme_id': this.schemeDetailsId}, "Scheme/schemeWithoutSlabDetailsExcel")
          .subscribe((result => {
              console.log(result);                
              if (result['statusCode'] == 200) {
                  this.loader = false;
                  window.open(this.downurl + result['filename'])
                  this.getSubSchemeSubDetails()
              } else {
              }
              
          }));
      }
      else
      {
          this.serve.post_rqst({ 'scheme_id': this.schemeDetailsId , 'slab_id' : this.slabId }, "Scheme/slabSalesDetailsExcel")
          .subscribe((result => {
              console.log(result);                
              if (result['statusCode'] == 200) {
                  this.loader = false;
                  window.open(this.downurl + result['filename'])
                  this.getSubSchemeSubDetails()
              } else {
              }
              
          }));
      }
  }

}
