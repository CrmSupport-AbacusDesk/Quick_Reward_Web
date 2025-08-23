import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { sessionStorage } from 'src/app/localstorage.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';
import { SecondarySchemeModalComponent } from '../secondary-scheme-modal/secondary-scheme-modal.component';
@Component({
    selector: 'app-secondary-scheme-list',
    templateUrl: './secondary-scheme-list.component.html'
})
export class SecondarySchemeListComponent implements OnInit {
    fabBtnValue: any = 'add';
    active_tab: any = 'Running'
    filter: any = {};
    excel_data: any = [];
    schemeList: any = [];
    schemeListItem: any = [];
    search_val: any = {}
    loader: boolean = false;
    login_dr_id: any;
    assign_login_data: any;
    logined_user_data2: any;
    logined_user_data: any;
    datanotfound: boolean = false;
    pageCount: any;
    total_page: any;
    page_limit: any;
    pagenumber: any = 1;
    start: any = 0;
    sr_no: number;
    count: any = {};
    tabCount: any = {};
    today_date: Date;
    items_object: any = {}
    user_type: any = [];
    downurl: any = ''
    type: any = ''
    giftSchemeList:any=[]
    image_url:any;
    gift_image_url:any;
    schemeDetailRunning: any = [];
    schemeDetailExpire: any = [];
    
    constructor(public serve: DatabaseService, public dialog: DialogComponent, public dialogs: MatDialog,  public alert: DialogComponent, private route: ActivatedRoute, public router: Router, public toast: ToastrManager, public session: sessionStorage) {
        this.downurl = serve.downloadUrl
        this.page_limit = this.serve.pageLimit;
        this.assign_login_data = this.session.getSession();
        this.logined_user_data = this.assign_login_data.value;
        this.logined_user_data2 = this.logined_user_data.data;
        this.route.params.subscribe( (params) =>{
            this.getSchemeListing();
        })
        console.log('Got Here too !!!')
        // this.getSchemeListing();
        this.today_date = new Date();
        this.image_url = serve.uploadUrl + 'giftImages/'
        this.gift_image_url = serve.uploadUrl + 'schemeRewards/'
        
        
    }
    
    ngOnInit() {}
    
    public onDate(event): void {
        this.filter.date_created = moment(event.value).format('YYYY-MM-DD');
        this.getSchemeListing();
    }
    
    
    
    
    
    getSchemeListing() {
        this.schemeDetailRunning = [];
        this.schemeDetailExpire = [];
        console.log(this.active_tab)
        if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
        }
        if (this.start < 0) {
            this.start = 0;
        }
        
        
        this.filter.gift_type = this.active_tab
        console.log(this.filter.gift_type)
        this.loader = true;
        this.serve.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit, 'type': 'Dealer' }, "SecondaryScheme/schemeListing")
        .subscribe((result => {
            if (result['statusCode'] == 200) {
                this.schemeList = result['result'];
                for (let i = 0; i < this.schemeList.length; i++) {
                    if (this.schemeList[i]['scheme_state'] == 'Running') {
                        this.schemeDetailRunning.push(this.schemeList[i]);    
                        console.log(1);                    
                    }
                    else
                    {
                        this.schemeDetailExpire.push(this.schemeList[i]);            
                    }
                }
                // this.schemeDetailRunning=this.schemeList.filter(row=>row.scheme_state=='Running')
                console.log(this.schemeDetailRunning);        
                console.log(this.schemeDetailExpire);
                
                this.count = result['count'];
                this.tabCount = result['tabCount'];
                this.pageCount = result['count'];
                this.loader = false;
                
                if (this.schemeList.length == 0) {
                    this.datanotfound = true
                } else {
                    this.datanotfound = false
                }
                if (this.pagenumber > this.total_page) {
                    this.pagenumber = this.total_page;
                    if (this.pageCount != 0) {
                        this.start = this.pageCount - this.page_limit;
                    }
                    else {
                        this.start = 0
                    }
                }
                
                else {
                    this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
                }
                this.total_page = Math.ceil(this.pageCount / this.page_limit);
                this.sr_no = this.pagenumber - 1;
                this.sr_no = this.sr_no * this.page_limit;
                setTimeout(() => {
                    this.loader = false;
                    
                }, 700);
            }
            else {
                this.toast.errorToastr(result['statusMsg']);
            }
        }))
        this.serve.count_list();
    }
    
    // listing api of gift tab start
    
    getGiftListing() {
        console.log(this.active_tab)
        if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
        }
        if (this.start < 0) {
            this.start = 0;
        }
        this.filter.gift_type = this.active_tab
        console.log(this.filter.gift_type)
        this.loader = true;
        this.serve.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit, 'type': this.type }, "SecondaryScheme/giftListing")
        .subscribe((result => {
            if (result['statusCode'] == 200) {
                this.schemeList = result['result'];
                this.count = result['count'];
                this.tabCount = result['tabCount'];
                this.pageCount = result['count'];
                this.loader = false;
                
                if (this.schemeList.length == 0) {
                    this.datanotfound = true
                } else {
                    this.datanotfound = false
                }
                if (this.pagenumber > this.total_page) {
                    this.pagenumber = this.total_page;
                    if (this.pageCount != 0) {
                        this.start = this.pageCount - this.page_limit;
                    }
                    else {
                        this.start = 0
                    }
                }
                
                else {
                    this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
                }
                this.total_page = Math.ceil(this.pageCount / this.page_limit);
                this.sr_no = this.pagenumber - 1;
                this.sr_no = this.sr_no * this.page_limit;
                
                for (let index = 0; index < this.schemeList.length; index++) {
                    this.schemeListItem = this.schemeList[index]['item'];
                    let val: any = '';
                    for (let index = 0; index < this.schemeListItem.length; index++) {
                        val += this.schemeListItem[index].user_type + ', '
                    }
                    this.schemeList[index].object = val
                }
                setTimeout(() => {
                    this.loader = false;
                    
                }, 700);
            }
            else {
                this.toast.errorToastr(result['statusMsg']);
            }
        }))
        this.serve.count_list();
    }
    
    // listing api of gift tab End
    
    updateStatus(index, id, event) {
        if (event.checked == false) {
            this.alert.confirm("You Want To Change Status !").then((result) => {
                if (result) {
                    if (event.checked == false) {
                        this.schemeList[index].status = "0";
                    }
                    else {
                        this.schemeList[index].status = "1";
                    }
                    let value = this.schemeList[index].status;
                    this.serve.post_rqst({ 'scheme_id': id, 'status': value, 'status_changed_by': this.logined_user_data.data.id, 'status_changed_by_name': this.logined_user_data.data.name }, "SecondaryScheme/updateSchemeStatus")
                    .subscribe(resp => {
                        if (resp['statusCode'] == 200) {
                            this.toast.successToastr(resp['statusMsg']);
                            this.getSchemeListing();
                        }
                        else {
                            this.toast.errorToastr(resp['statusMsg']);
                        }
                    })
                }
                else{
                    this.refresh();
                }
            })
        }
        else if (event.checked == true) {
            this.alert.confirm("You Want To Change Status !").then((result) => {
                if (result) {
                    if (event.checked == false) {
                        this.schemeList[index].status = "0";
                    }
                    else {
                        this.schemeList[index].status = "1";
                    }
                    
                    let value = this.schemeList[index].status;
                    this.serve.post_rqst({ 'scheme_id': id, 'status': value, 'status_changed_by': this.logined_user_data.data.id, 'status_changed_by_name': this.logined_user_data.data.name }, "SecondaryScheme/updateSchemeStatus")
                    .subscribe(resp => {
                        if (resp['statusCode'] == 200) {
                            this.toast.successToastr(resp['statusMsg']);
                            this.getSchemeListing();
                        }
                        else {
                            this.toast.errorToastr(resp['statusMsg']);
                        }
                    })
                }
            })
        }
    }
    
    goToImage(image) {
        const dialogRef = this.dialogs.open(ImageModuleComponent, {
            panelClass: 'Image-modal',
            data: {
                'image': image,
                'type': 'base64'
            }
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }
    
    refresh() {
        if(this.active_tab == 'schemeGift')
        {
            console.log('gift tab')
            this.getGiftListing()
        }
        else{
            this.getSchemeListing();
        }
        this.filter = {};
        
    }
    
    lastBtnValue(value) {
        this.fabBtnValue = value;
    }
    
    openDialog() {
        const dialogRef = this.dialogs.open(SecondarySchemeModalComponent, {
            width: '768px',
            data: {}
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }
    
    downloadExcel() {
        this.serve.post_rqst({ 'filter': this.filter, 'type': this.type }, "SecondaryScheme/schemeListExcel").subscribe((result => {
            if (result['statusCode'] == 200) {
                window.open(this.downurl + result['filename'])
                this.getSchemeListing();
            } else {
                this.toast.errorToastr(result['statusMsg']);
            }
        }));
    }
    
    pervious() {
        if(this.active_tab == 'schemeGift')
        {
            this.getGiftListing()
        }
        else{
            this.getSchemeListing();
        }
        this.start = this.start - this.page_limit;
    }
    
    nextPage() {
        if(this.active_tab == 'schemeGift')
        {
            this.getGiftListing()
        }
        else{
            this.getSchemeListing();
        }
        this.start = this.start + this.page_limit;
        
    }

    deleteScheme(id) {
        this.dialog.delete('Scheme Data !').then((result) => {
            if (result) {
                let value = { "scheme_id": id }
                this.serve.post_rqst(value, "SecondaryScheme/deleteScheme").subscribe((result) => {
                    if (result) {
                        this.getSchemeListing();
                    }
                });
            }
        });
    }
}

