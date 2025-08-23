import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material';
import { SecondarySchemeModalComponent } from '../secondary-scheme-modal/secondary-scheme-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';


@Component({
    selector: 'app-secondary-scheme-sub-detail',
    templateUrl: './secondary-scheme-sub-detail.component.html'
})
export class SecondarySchemeSubDetailComponent implements OnInit {
    
    schemeDetailsId: any;
    slabId: any;
    skLoading: any = false;
    subSchemeDetails: any;
    userData: any;
    loader: any = false;
    downurl: any = '';
    
    
    
    constructor(public serve: DatabaseService,public location: Location, public dialogs: MatDialog,public navparams: ActivatedRoute, public router: Router, private route: ActivatedRoute,public toast: ToastrManager) {
        this.route.params.subscribe( (params) => {
            console.log(params);
            this.downurl = serve.downloadUrl;
            
            this.schemeDetailsId = params.schemeDetailsId;
            this.slabId = params.slabId;
        }
        );
        if (this.slabId) {
            this.getSubSchemeDetails();
        }
        else
        {
            this.getSubSchemeDetailsForPoints();
        }
    }
    
    ngOnInit() {
    }
    
    
    back(): void {
        this.location.back()
    }
    
    getSubSchemeDetailsForPoints() {
        this.skLoading = true;
        this.serve.post_rqst({'scheme_id': this.schemeDetailsId }, "SecondaryScheme/schemeWithoutSlab")
        .subscribe((result => {
            console.log(result);
            
            if (result['statusCode'] == 200) {
                this.subSchemeDetails = result['result'];
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
    
    getSubSchemeDetails() {
        this.skLoading = true;
        this.serve.post_rqst({'scheme_id': this.schemeDetailsId , 'slab_id' : this.slabId }, "SecondaryScheme/slabDetails")
        .subscribe((result => {
            if (result['statusCode'] == 200) {
                this.subSchemeDetails = result['result'];
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
        const dialogRef = this.dialogs.open(SecondarySchemeModalComponent, {
            width: '1024px',
            data: {
                company_name: this.subSchemeDetails.userData[idx].company_name,
                dr_id: this.subSchemeDetails.userData[idx].id,
                
                mobile: (this.subSchemeDetails.scheme_for == 'Sales user' ? this.subSchemeDetails.userData[idx].contact_01 : this.subSchemeDetails.userData[idx].mobile),
                name: this.subSchemeDetails.userData[idx].name,
                slab_type: this.subSchemeDetails.slabData.slab_type ? this.subSchemeDetails.slabData.slab_type : '',
                scheme_id: this.schemeDetailsId,
                slab_id: this.slabId,
                scheme_for: this.subSchemeDetails.scheme_for
            }
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }
    
    openDialogWithoutSlab(idx) {
        const dialogRef = this.dialogs.open(SecondarySchemeModalComponent, {
            width: '1024px',
            data: {
                company_name: this.subSchemeDetails.userData[idx].company_name,
                dr_id: this.subSchemeDetails.userData[idx].id,                
                mobile: (this.subSchemeDetails.scheme_for == 'Sales user' ? this.subSchemeDetails.userData[idx].contact_01 : this.subSchemeDetails.userData[idx].mobile),
                name: this.subSchemeDetails.userData[idx].name,
                scheme_id: this.schemeDetailsId,
                scheme_for: this.subSchemeDetails.scheme_for
            }
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }
    exportAsXLSX() {
        this.loader = true;
        if (this.subSchemeDetails.gift_type == 'Point' && this.subSchemeDetails.point_type == 'Product Qty') {
            this.serve.post_rqst({ 'scheme_id': this.schemeDetailsId}, "SecondaryScheme/schemeWithoutSlabDetailsExcel")
            .subscribe((result => {
                console.log(result);                
                if (result['statusCode'] == 200) {
                    this.loader = false;
                    window.open(this.downurl + result['filename'])
                    this.getSubSchemeDetails()
                } else {
                }
                
            }));
        }
        else
        {
            this.serve.post_rqst({ 'scheme_id': this.schemeDetailsId , 'slab_id' : this.slabId }, "SecondaryScheme/slabSalesDetailsExcel")
            .subscribe((result => {
                console.log(result);                
                if (result['statusCode'] == 200) {
                    this.loader = false;
                    window.open(this.downurl + result['filename'])
                    this.getSubSchemeDetails()
                } else {
                }
                
            }));
        }
    }
}
