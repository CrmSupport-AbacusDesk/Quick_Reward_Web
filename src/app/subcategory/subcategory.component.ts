import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../router-animation/router-animation.component';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService'
import { MatDialog, PageEvent } from '@angular/material';
import { DialogComponent } from 'src/app/dialog.component';
import { StatusModalComponent } from '../order/status-modal/status-modal.component';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { UploadFileModalComponent } from 'src/app/upload-file-modal/upload-file-modal.component';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html'
})
export class SubcategoryComponent implements OnInit {

  tabValue: any = 'Pending';
  fabBtnValue: any = 'add';

  subCategory: any = [];
  sub_category_status: any = {};
  value: any = {};
  imgDoc:any[]=[];
  start: any = 0;
  count: any;
  total_page: any = 0;
  pagenumber: any = 0;
  page_limit: any;
  pageCount: any;
  endPage: any = 0;
  excel_data: any = [];
  excelLoader: boolean = false;
  loader: boolean = false;
  today_date: Date;
  assign_login_data: any = {};
  logined_user_data: any = {};
  sr_no = 0;
  userData:any;
  catImgFlag:any
  datanotfound: boolean = false;
  downurl: any = ''

  constructor(
    public rout: Router,
    public service: DatabaseService,
    public cryptoService:CryptoService, 
    public dialog: MatDialog,
    public dialogs: DialogComponent,
    public session: sessionStorage,
    public alert: DialogComponent,
    public toast: ToastrManager) {
    this.downurl = service.downloadUrl;
    this.page_limit = service.pageLimit;
    this.today_date = new Date();
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.catImgFlag = parseInt(this.userData['organisation_data']['cat_img']);
    this.getSegmentList('');
  }

  ngOnInit() {
  }


  lastBtnValue(value) {
    this.fabBtnValue = value;
  }

  previousPage() {
    this.start = this.start - this.page_limit;
    this.getSegmentList('');
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.getSegmentList('');
  }

  clearFilter() {
    this.value = {};
    this.getSegmentList('');
  }


  getSegmentList(data) {
    if (data.pageIndex > data.previousPageIndex) {
      this.nextPage();
    }
    this.sr_no = data.previousPageIndex;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    this.loader = true;
    let header = this.service.post_rqst({'start': this.start, 'pagelimit': this.page_limit, 'search': this.value}, "Master/getSubCategoryList")
    header.subscribe((result => {
      if (result['statusCode'] == 200) {
        this.subCategory = result.sub_category_list.sub_cat_list;
        this.pageCount = result.sub_category_list.sub_cat_count;
        this.loader = false;
        if (this.subCategory.length == 0) {
          this.datanotfound = true;
        } else {
          this.datanotfound = false;
        }
        for (let i = 0; i < this.subCategory.length; i++) {
          if (this.subCategory[i].status == '1') {
            this.subCategory[i].sub_category_status = true
          }
          else if (this.subCategory[i].status == '0') {
            this.subCategory[i].sub_category_status = false;
          }
        }
        this.total_page = Math.ceil(this.pageCount / this.page_limit);
        this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
        if (this.start + this.page_limit >= this.pageCount) {
          this.endPage = Math.ceil(this.start + this.page_limit - (this.pageCount / this.page_limit));
        } else if (this.pageCount == 1) {
          this.endPage = '1';
        }
        else if (this.pageCount != 1 && this.pageCount < this.page_limit) {
          this.endPage = this.pageCount;
        } else {
          this.endPage = this.start + this.page_limit;
        }
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit;
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
        this.loader = false;
      }

    }
    ));
  }

  insertImage(event, data) {
    this.imgDoc = [];
    let files = event.target.files;
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.imgDoc.push(e.target.result);
        }
        reader.readAsDataURL(file);
      }
      this.InsertImage(data);
    }
  }
  

  InsertImage(data) {
    
    this.dialogs.confirm('You Want To Change Sub Category Image ?').then((result) => {
      if (result) {
        this.service.post_rqst({ 'sub_category_id': data.id, 'image': this.imgDoc }, "Master/uploadSubCategoryImage").subscribe((result) => {
          if (result['statusCode'] == 200) {
            this.toast.successToastr(result['statusMsg']);
            this.getSegmentList('');
          } else {
            this.toast.errorToastr(result['statusMsg']);
          }
        });
      } else {
        this.getSegmentList('');

      }
    });
  }
  openDialog(category, master_category_id, sub_category_name, id, action_type): void {
    const dialogRef = this.dialog.open(StatusModalComponent, {
      width: '600px',
      panelClass: 'cs-modal',
      disableClose: true,
      data: {
        delivery_from: 'subcategory-list',
        type: action_type,
        master_category_id,
        sub_category_name,
        category,
        id
      }

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.getSegmentList('')
      }
    });
  }
  date_format(): void {
    this.value.date_created = moment(this.value.date_created).format('YYYY-MM-DD');
    this.getSegmentList('');
  }

  upload_excel(type) {
    const dialogRef = this.dialog.open(UploadFileModalComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      disableClose: true,
      data: {
        'from': 'uploadSegment',
        'modal_type': type
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {
        this.getSegmentList('');
      }
    });
  }

  updateStatus(index, id, event) {
    this.alert.confirm("You Want To Change Status !").then((result) => {
      if (result) {
        if (event.checked == false) {
          this.subCategory[index].status = "0";
        }
        else {
          this.subCategory[index].status = "1";
        }
        let value = this.subCategory[index].status;
        this.service.post_rqst({ 'sub_category_id': id, 'status': value, 'status_changed_by': this.logined_user_data.id, 'status_changed_by_name': this.logined_user_data.name }, "Master/subCategoryStatusChange")
          .subscribe(result => {
            if (result['statusCode'] == 200) {
              this.toast.successToastr(result['statusMsg']);
              this.getSegmentList('');
            }
            else {
              this.toast.errorToastr(result['statusMsg']);
            }
          })
      }
    })
  }

  download_excl() {
    this.service.post_rqst({'start': this.start, 'pagelimit': this.page_limit, 'search': this.value}, "Excel/get_sub_category_list").subscribe((result => {
      if (result['msg'] == true) {
        window.open(this.downurl + result['filename'])
        this.getSegmentList('');
      } else {
      }
    }));

  }


  refresh() {
    this.start = 0;
    this.value = {};
    this.getSegmentList('');
  }


  deleteSubCategory(id) {
    this.dialogs.delete('Segment Data !').then((result) => {
      if (result) {
        this.service.post_rqst({ "id": id }, "Master/deleteSubCategory").subscribe((result) => {
          if (result['statusCode'] == 200) {
            this.getSegmentList('');
            this.toast.successToastr(result['statusMsg'])
          }
          else{
            this.toast.errorToastr(result['statusMsg'])
          }
        });
      }
    });
  }

}
