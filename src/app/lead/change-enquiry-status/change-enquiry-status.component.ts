import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogComponent } from 'src/app/dialog.component';
import { ProductUploadComponent } from 'src/app/product-upload/product-upload.component';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
    selector: 'app-change-enquiry-status',
    templateUrl: './change-enquiry-status.component.html'
})
export class ChangeEnquiryStatusComponent implements OnInit {
    data: any = {};
    report_manager: any = [];
    dealers: any = [];
    
    // followupData: any=[];
    date: any;
    userData: any;
    userId: any;
    savingFlag: boolean = false;
    userName: any;
    Active_Tab_status:any;
    enquiry_id: any;
    customerNetwork: any = [];
    statusList:any = [];
    reasonList:any =[];
    
    
    constructor(@Inject(MAT_DIALOG_DATA) public modal_data, public cryptoService:CryptoService, public dialog: DialogComponent, public service: DatabaseService, public rout: Router, public toast: ToastrManager, public dialogRef: MatDialogRef<ChangeEnquiryStatusComponent>) {
        console.log('modeldata', this.modal_data)
        this.data.dr_type = this.modal_data.dr_type;
        this.Active_Tab_status = this.modal_data.active_tab;
        this.data.dr_type_name = 'Enquiry';
        this.date = new Date();
        this.userData = JSON.parse(localStorage.getItem('st_user'));
        this.userId = this.userData['data']['id'];
        this.userName = this.userData['data']['name'];
        this.data = this.modal_data.lead_data;
        console.log(this.data);
        this.data.requirement = this.modal_data.lead_data.description;
        this.data.create_follow_up = 'Yes';
        
        if(this.data.sfa == 1 && this.data.dms ==1){
            this.data.assign_type = ''
        }
        else if(this.data.sfa == 1){
            this.data.assign_type = 'sales_user';
            this.getReportManager('');
        }
        else if(this.data.dms == 1){
            this.data.assign_type = 'Dealer';
            this.getDealer('');
        }
        
        if(this.modal_data.assignType == 'reassign')
            {
            this.getReportManager('');
            // this.getDealer('');
            this.data.assignType = this.modal_data.assignType;
            this.data.lead_status = this.modal_data.lead_data.stage_level;
            this.data.assign_type = this.modal_data.lead_data.assign_to_user_type;
            this.data.sales_user_id = this.modal_data.lead_data.assigned_to_user_id.toString();
            
        }
        
        if(this.modal_data.assignType == 'updateStatus'){
            this.data.lead_status = this.modal_data.lead_data.stage_level;
            if(this.data.lead_status == 'Inprocess'){
                this.data.lead_status = '';
            }
            if(this.data.lead_status == 'Lost'|| this.data.lead_status == 'Dropped'){
                this.getReasons(this.data.lead_status);
            }
            this.statusDropDown()
        }
    }
    
    ngOnInit() {}
    
    public onDate(event): void {
        // this.orderList();
    }
    
    
    
    statusDropDown() {
        this.service.post_rqst({}, 'Enquiry/enquiryStatus').subscribe(result => {
            if (result['statusCode'] == 200) {
                this.statusList = result['data'];
            } else {
                this.toast.errorToastr(result['statusMsg']);
            }
            
        });
    }
    
    
    
    getReasons(reason_status) {
        var func_name
        if (reason_status == 'Lost') {
            func_name = 'Enquiry/getEnquiryLostReason'
        }
        if(reason_status == 'Dropped') {
            func_name = 'Enquiry/getEnquiryDropReason'
        }
        this.service.post_rqst(this.data, func_name).subscribe((result) => {
            if (result['statusCode'] == 200) {
                this.reasonList = result['result']
            }
            else {
                this.toast.errorToastr(result['statusMsg']);
            }
        })
    }
    
    
    getNetworkType(type) {
        this.service.post_rqst({ 'type': type }, "CustomerNetwork/distributionNetworkSubType").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.customerNetwork = result['result'];
                if (this.customerNetwork.length == 1) {
                    this.data.customer_network_type = this.customerNetwork[0]['name'];
                }
            } else {
                this.toast.errorToastr(result['statusMsg']);
            }
            
        }));
    }
    getReportManager(searcValue) {
        this.service.post_rqst({ 'search': searcValue }, "Enquiry/getSalesUserForReporting").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.report_manager = result['all_sales_user'];
            }
            else {
                this.toast.errorToastr(result['statusMsg']);
            }
        }));
    }
    
    
    getDealer(searcValue) {
        this.service.post_rqst({ 'search': searcValue, 'state':this.data.state }, "Enquiry/getStateWiseDealer").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.dealers = result['all_sales_user'];
            }
            else {
                this.toast.errorToastr(result['statusMsg']);
            }
        }));
    }
    
    
    findUser(id) {
        let index = this.report_manager.findIndex(row => row.id == id)
        if (index != -1) {
            this.data.user_name = this.report_manager[index].name;
        }
    }
    findDealer(id) {
        let index = this.dealers.findIndex(row => row.id == id)
        if (index != -1) {
            this.data.user_name = this.dealers[index].name;
        }
    }
    
    
    submitDetail() {
        this.data.created_by_name = this.userName;
        this.data.created_by_id = this.userId;
        this.data.dr_id = this.modal_data.id;
        this.data.enquiry_id = this.modal_data.id;
        this.data.user_employee_code = this.modal_data.user_employee_code;
        this.data.next_followup_date = moment(this.data.next_followup_date).format('YYYY-MM-DD');
        this.savingFlag = true;
        if (this.data.lead_status == 'Disqualified') {
            this.data.create_follow_up = 'No'
        }
        if(this.data.assignType == 'reassign'){
            var function_name = 'Enquiry/reassignEnquiryToUser';
        }
        else{
            var function_name = 'Enquiry/enquiryStageChange';
        }
        this.service.post_rqst(this.data, function_name).subscribe((result) => {
            if (result['statusCode'] == 200) {
                this.toast.successToastr(result['statusMsg']);
                this.savingFlag = false;
                this.dialogRef.close(true);
            }
            else {
                this.toast.errorToastr(result['statusMsg']);
                this.savingFlag = false;
            }
        }, error => {
        })
        
    }
    
    
    changeStatus() {
        this.dialog.confirm('You want to change status').then((result) => {
            if (result) {
                this.data.created_by_name = this.userName;
                this.data.created_by_id = this.userId;
                this.data.dr_id = this.modal_data.id;
                this.data.enquiry_id = this.modal_data.id;
                this.data.user_employee_code = this.modal_data.user_employee_code;
                this.savingFlag = true;
                
                this.service.post_rqst(this.data, "Enquiry/enquiryStatusChange").subscribe((result) => {
                    if (result['statusCode'] == 200) {
                        this.toast.successToastr(result['statusMsg']);
                        this.savingFlag = false;
                        this.dialogRef.close(true);
                    }
                    else {
                        this.toast.errorToastr(result['statusMsg']);
                        this.savingFlag = false;
                    }
                }, error => {
                })
            }
        });
        
        
        
    }
}
