import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { sessionStorage } from 'src/app/localstorage.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';
import { SchemeModalComponent } from '../scheme-modal/scheme-modal.component';
@Component({
    selector: 'app-scheme-sub-list',
    templateUrl: './scheme-sub-list.component.html',
    styleUrls: ['./scheme-sub-list.component.scss']
})
export class SchemeSubListComponent implements OnInit {
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
    scheme_id: any = ''
    giftSchemeList:any=[]
    image_url:any;
    gift_image_url:any;
    schemeDetailRunning: any = [];
    schemeDetailExpire: any = [];
    subSchemeList: any = [];
    subSchemeDetailRunning: any = [];
    subSchemeDetailExpire: any = [];
    type: any = '';
    
    constructor(public serve: DatabaseService,public dialog: DialogComponent, public dialogs: MatDialog,  public alert: DialogComponent, private route: ActivatedRoute, public router: Router, public location: Location, public toast: ToastrManager, public session: sessionStorage) {
        this.downurl = serve.downloadUrl
        this.page_limit = this.serve.pageLimit;
        this.assign_login_data = this.session.getSession();
        this.logined_user_data = this.assign_login_data.value;
        this.logined_user_data2 = this.logined_user_data.data;
        this.route.params.subscribe( (params) =>{
            this.type = params.type;
            this.scheme_id = params.id;
            this.getSubSchemeListing();
        })
        console.log('Got Here too !!!')
        this.today_date = new Date();
        this.image_url = serve.uploadUrl + 'giftImages/'
        this.gift_image_url = serve.uploadUrl + 'schemeRewards/'
    }
    
    ngOnInit() {}
    
    public onDate(event): void {
        this.filter.date_created = moment(event.value).format('YYYY-MM-DD');
        this.getSubSchemeListing();
    }
    back(): void {
        this.location.back()
    }
    
    getSubSchemeListing(){
        this.subSchemeDetailRunning = [];
        this.subSchemeDetailExpire = [];
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
        this.serve.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit, 'scheme_id': this.scheme_id }, "Scheme/subSchemeListing")
        .subscribe((result => {
            if (result['statusCode'] == 200) {
                this.subSchemeList = result['result'];
                for (let i = 0; i < this.subSchemeList.length; i++) {
                    if (this.subSchemeList[i]['scheme_state'] == 'Running') {
                        this.subSchemeDetailRunning.push(this.subSchemeList[i]);    
                        console.log(1);                    
                    }
                    else
                    {
                        this.subSchemeDetailExpire.push(this.subSchemeList[i]);            
                    }
                }
                // this.schemeDetailRunning=this.schemeList.filter(row=>row.scheme_state=='Running')
                console.log(this.subSchemeDetailRunning);        
                console.log(this.subSchemeDetailExpire);
                
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
    
    refresh() {
        this.filter = {};
        this.getSubSchemeListing();
    }
    
    lastBtnValue(value) {
        this.fabBtnValue = value;
    }
    
    downloadExcel() {
        this.serve.post_rqst({ 'filter': this.filter }, "Scheme/").subscribe((result => {
            if (result['statusCode'] == 200) {
                window.open(this.downurl + result['filename'])
                this.getSubSchemeListing();
            } else {
                this.toast.errorToastr(result['statusMsg']);
            }
        }));
    }
    
    // pervious() {
    //     this.getSubSchemeListing();
    //     this.start = this.start - this.page_limit;
    // }
    
    // nextPage() {
    //     this.getSubSchemeListing();
    //     this.start = this.start + this.page_limit;
    // }
    
    deleteSubScheme(id) {
        this.dialog.delete('Sub Scheme Data !').then((result) => {
            if (result) {
                let value = { "sub_scheme_id": id }
                this.serve.post_rqst(value, "Scheme/deleteSubScheme").subscribe((result) => {
                    if (result) {
                        this.getSubSchemeListing();
                    }
                });
            }
        });
    }
}
