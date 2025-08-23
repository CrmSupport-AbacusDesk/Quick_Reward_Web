import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
import { DatabaseService } from 'src/_services/DatabaseService';
import { SchemeModalComponent } from '../scheme-modal/scheme-modal.component';
import { MatDialog } from '@angular/material';
import { DialogComponent } from 'src/app/dialog.component';


@Component({
    selector: 'app-scheme-detail',
    templateUrl: './scheme-detail.component.html',
    styleUrls: ['./scheme-detail.component.scss']
})
export class SchemeDetailComponent implements OnInit {
    paramData:any={};
    data:any;
    constructor(public navParam:ActivatedRoute, public rout: Router, public dialog: MatDialog, public confirmDialog:DialogComponent, public service:DatabaseService, public cryptoService:CryptoService, public toast: ToastrManager, public location: Location) {
    }
    
    ngOnInit() {
        console.log(this.navParam.params, 'navParam');
        
        this.navParam.params.subscribe(params => {
            console.log(params, 'params');
            
            let id 
            if(params.id){
                id = params.id.replace(/_/g, '/')
                this.paramData.id = this.cryptoService.decryptId(id);
                this.fetchData()
            }
        });
    }

    stringify(data){
        return JSON.stringify(data)
    }
    
    fetchData() {
        
        this.service.post_rqst({'id':this.paramData.id}, 'Scheme/SchemeDetails').subscribe((result) => {
            if (result['statusCode'] == 200) {
                this.data = result['result']
                this.data.image = this.service.uploadUrl+"schemeBanners/"+this.data.image
            }
            else {
                this.toast.errorToastr(result['statusMsg'])
            }
        }
    )
}
back(): void {
    this.location.back()
}

// edit(type, id) {
//   this.data.isEditEnabled = type;
//   this.rout.navigate(['edit/' + id]);
// }

openDialog(type:string, data:any=[], slabData:any={}): void {
    const dialogRef = this.dialog.open(SchemeModalComponent, {
        width: '600px',
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

deleteDialog(id, req) {
    this.confirmDialog.confirm("Are you sure, You want to delete?").then((result) => {
        if (result) {
            this.deleteRow(id, req)
        }
    })
}

deleteRow(id, api){
    this.service.post_rqst({id}, api).subscribe((result) => {
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