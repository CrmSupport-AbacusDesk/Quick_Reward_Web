import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';
import { Location } from '@angular/common';
import { SecondarySchemeModalComponent } from '../secondary-scheme-modal/secondary-scheme-modal.component';
import { MatDialog } from '@angular/material';


@Component({
  selector: 'app-secondary-scheme-detail',
  templateUrl: './secondary-scheme-detail.component.html'
})
export class SecondarySchemeDetailComponent implements OnInit {

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
  scheme_id: any;
  schemeDetails: any;
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
        this.scheme_id = params.id;
      }
    );
    this.getSchemeDetails();
  }

  ngOnInit() {

  }


  getSchemeDetails() {
    this.skLoading = true;
    this.serve.post_rqst({'scheme_id': this.scheme_id }, "SecondaryScheme/schemeDetails")
    .subscribe((result => {
      console.log(result);
      
      if (result['statusCode'] == 200) {
        this.schemeDetails = result['result'];
        console.log(this.schemeDetails);
        
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





  resetValue() {
    this.data.range_end = '';
  }
  // get_bonus_schemeList(gift_id:any='') {
  //   this.service.post_rqst({'gift_id':gift_id}, 'GiftGallery/bonusSchemeList').subscribe((resp) => {
  //     if (resp['statusCode'] == 200) {
  //       this.bonus_schemeList = resp['result']
  //     }
  //     else {
  //       this.toast.errorToastr(resp['statusMsg']);
  //     }

  //   }, error => {
  //     this.toast.errorToastr(error);
  //   })
  // }

  submitDetail() {
    this.data.date_from ? (this.data.date_from = moment(this.data.date_from).format('YYYY-MM-DD')) : null;
    this.data.date_to ? (this.data.date_to = moment(this.data.date_to).format('YYYY-MM-DD')) : null;
    if (this.data.gift_type == 'Cash') {
      if (parseInt(this.data.range_end) <= parseInt(this.data.range_start)) {
        this.toast.errorToastr('The range end value should be greater than the range start value');
        return;
      }
    }
    // if(this.data.gift_type == 'Gift'){
    //   if(this.selected_image==undefined){
    //     this.toast.errorToastr('Please Upload Image');
    //     return;
    //   }
    // }

    this.data.created_by_name = this.userName;
    this.data.created_by_id = this.userId;
    // this.data.gift_img = this.selected_image;
    let header: any;
    if (this.gift_id) {
      this.data.id = this.gift_id
      header = this.serve.post_rqst(this.data, 'GiftGallery/updateGiftGallery')
    } else {
      header = this.serve.post_rqst(this.data, 'GiftGallery/addGiftGallery')
    }
    header.subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.toast.successToastr(resp['statusMsg']);
        this.savingFlag = false;
        this.router.navigate(['/gift-list']);
        this.serve.count_list();

      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
        this.savingFlag = false;
      }

    }, error => {
      this.toast.errorToastr(error);
    })

  }

  exportAsXLSX() {
    this.loader = true;
    this.serve.post_rqst({ 'scheme_id': this.scheme_id }, "SecondaryScheme/slabSalesPercentage")
      .subscribe((result => {
        if (result['statusCode'] == 200) {
          this.loader = false;
          window.open(this.downurl + result['filename'])
          this.getSchemeDetails()
        } else {
        }

      }));
  }

  onUploadChange(data: any) {
    this.errorMsg = false;
    this.image_id = '';
    for (let i = 0; i < data.target.files.length; i++) {
      let files = data.target.files[i];
      if (files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.selected_image.push({ "image": e.target.result });
        }
        reader.readAsDataURL(files);
      }
      this.image.append("" + i, data.target.files[i], data.target.files[i].name);
    }
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



  back(): void {
    this.location.back()
  }


  openDialog() {
    const dialogRef = this.dialogs.open(SecondarySchemeModalComponent, {
      width: '768px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}




