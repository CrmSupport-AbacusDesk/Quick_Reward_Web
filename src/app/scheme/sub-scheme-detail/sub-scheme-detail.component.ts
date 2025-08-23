import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';
import { Location } from '@angular/common';
import { SchemeModalComponent } from '../scheme-modal/scheme-modal.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-sub-scheme-detail',
  templateUrl: './sub-scheme-detail.component.html',
  styleUrls: ['./sub-scheme-detail.component.scss']
})
export class SubSchemeDetailComponent implements OnInit {
  userData: any;
  userId: any;
  userName: any;
  data: any = {};
  errorMsg: boolean;
  loader: any = false;
  selected_image: any;
  image_id: any;
  image = new FormData();
  savingFlag: boolean = false;
  today_date: Date;
  bonus_schemeList: any = []
  upload_url: any;
  nav_data: any
  gift_id: any;
  scheme_type: any;
  sub_scheme_id: any;
  subSchemeDetails: any;
  skLoading: any = false;
  labelPosition: any = 'after';
  downurl: any = '';
  editorConfig = {
    editable: false,
    spellcheck: false,
    height: '10rem',
    minHeight: '5rem',
    placeholder: '',
    translate: 'no',
    "toolbar": []
  };

  constructor(public serve: DatabaseService, public location: Location, public navparams: ActivatedRoute, public router: Router, private route: ActivatedRoute, public toast: ToastrManager, public dialogs: MatDialog) { 
    this.nav_data = this.navparams['params']['_value']
    this.data.scheme = 'Sales'
    this.gift_id = this.nav_data.id;
    this.scheme_type = this.nav_data.type;
    this.upload_url = this.serve.uploadUrl + 'schemeBanners/'
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
    this.today_date = new Date();
    this.downurl = serve.downloadUrl
    this.route.params.subscribe( (params) => {
        this.sub_scheme_id = params.subSchemeId;
      }
    );
    this.getSubSchemeDetails();
  }

  ngOnInit() {
  }


  back(): void {
    this.location.back()
  }

  goToImage(image) {
    const dialogRef = this.dialogs.open(ImageModuleComponent, {
      panelClass: 'Image-modal',
      data: {
        'image': image,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });

  }

  getSubSchemeDetails() {
    this.skLoading = true;
    this.serve.post_rqst({'sub_scheme_id': this.sub_scheme_id }, "Scheme/subSchemeDetails")
    .subscribe((result => {
      console.log(result);
      
      if (result['statusCode'] == 200) {
        this.subSchemeDetails = result['result'];
        console.log(this.subSchemeDetails);
        
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



}
