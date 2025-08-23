import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material';
import { SchemeModalComponent } from '../scheme-modal/scheme-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';


@Component({
    selector: 'app-scheme-sub-detail',
    templateUrl: './scheme-sub-detail.component.html'
})
export class SchemeSubDetailComponent implements OnInit {
    
    schemeDetailsId: any;
    slabId: any;
    skLoading: any = false;
    subSchemeDetails: any;
    userData: any;
    loader: any = false;
    downurl: any = '';
    encryptedData: any;
    decryptedData:any;
    
    
    constructor(public service: DatabaseService, public cryptoService:CryptoService,public location: Location, public dialogs: MatDialog,public navparams: ActivatedRoute, public router: Router, private route: ActivatedRoute,public toast: ToastrManager) {
        this.route.params.subscribe( (params) => {
            console.log(params);
            this.downurl = service.downloadUrl;
            
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
        this.encryptedData = this.service.payLoad ? {'scheme_id': this.schemeDetailsId }: this.cryptoService.encryptData({'scheme_id': this.schemeDetailsId });
        this.service.post_rqst( this.encryptedData, "Scheme/schemeWithoutSlab")
        .subscribe((result => {
            this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

            if (this.decryptedData['statusCode'] == 200) {
                this.subSchemeDetails = this.decryptedData['result'];
                this.userData = this.decryptedData['result']['userData'];
                this.skLoading = false;
                
                setTimeout(() => {
                    this.skLoading = false;
                }, 700);
            }
            else {
                this.toast.errorToastr(this.decryptedData['statusMsg']);
            }
        }))
    }
    
    getSubSchemeDetails() {
        this.skLoading = true;
        this.encryptedData = this.service.payLoad ? {'scheme_id': this.schemeDetailsId , 'slab_id' : this.slabId }: this.cryptoService.encryptData({'scheme_id': this.schemeDetailsId , 'slab_id' : this.slabId });
        this.service.post_rqst(this.encryptedData, "Scheme/slabDetails")
        .subscribe((result => {
            this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
            if (this.decryptedData['statusCode'] == 200) {
                this.subSchemeDetails = this.decryptedData['result'];
                this.userData = this.decryptedData['result']['userData'];
                this.skLoading = false;
                
                setTimeout(() => {
                    this.skLoading = false;
                }, 700);
            }
            else {
                this.toast.errorToastr(this.decryptedData['statusMsg']);
            }
        }))
    }
    
    openDialog(idx) {
        const dialogRef = this.dialogs.open(SchemeModalComponent, {
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
        const dialogRef = this.dialogs.open(SchemeModalComponent, {
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
            this.encryptedData = this.service.payLoad ? { 'scheme_id': this.schemeDetailsId}: this.cryptoService.encryptData({ 'scheme_id': this.schemeDetailsId});
            this.service.post_rqst(this.encryptedData, "Scheme/schemeWithoutSlabDetailsExcel")
            .subscribe((result => {
                this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
                if (this.decryptedData['statusCode'] == 200) {
                    this.loader = false;
                    window.open(this.downurl + this.decryptedData['filename'])
                    this.getSubSchemeDetails()
                } else {
                }
                
            }));
        }
        else
        {
            this.encryptedData = this.service.payLoad ? { 'scheme_id': this.schemeDetailsId , 'slab_id' : this.slabId }: this.cryptoService.encryptData({ 'scheme_id': this.schemeDetailsId , 'slab_id' : this.slabId });
            this.service.post_rqst(this.encryptedData, "Scheme/slabSalesDetailsExcel")
            .subscribe((result => {
                this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
                if (this.decryptedData['statusCode'] == 200) {
                    this.loader = false;
                    window.open(this.downurl + this.decryptedData['filename'])
                    this.getSubSchemeDetails()
                } else {
                }
                
            }));
        }
    }
}
