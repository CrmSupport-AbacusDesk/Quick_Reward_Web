import { Component, OnInit, Renderer2, Input, EventEmitter, Output, HostListener } from '@angular/core';
import { sessionStorage } from '../localstorage.service';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialog.component';
import { DatabaseService } from 'src/_services/DatabaseService';  
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ProgressService } from '../progress.service';
import { CryptoService } from 'src/_services/CryptoService';
import { MatDialog } from '@angular/material';
import { ProfileAccountModalComponent } from '../profile-modal/profile-account-modal.component';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
  
})
export class HeaderComponent implements OnInit {
  searchData: any = {};
  login_data: any = {};
  dataList: any = [];
  downloaderActive$: any = false;
  uploaderActive$: any = false;
  uploadLogdownload$: any = '';
  @Input() dataToReceive: any;
  @Output() itemClicked = new EventEmitter<void>();
  downloadPercent$ = this.progressService.getDownloadProgress();
  uploadPercent$ = this.progressService.getUploadProgress();
  totalCount = this.progressService.getTotalCount();
  remainingCount = this.progressService.getRemainingCount();
  uploadlogsUrl = this.progressService.getUploaderDownloadUrl();
  encryptedData: any;
  decryptedData: any;
  url: any;
  downurl: any;
  isHidden: boolean = false;
  isFullyHidden: boolean = false;
  userData: any;
  logined_user_data:any ={};
  organisation_data:any ={};
  activeAcc:any;
  accList:any=[]
  
  constructor(private renderer: Renderer2, public dialog2:MatDialog, public cryptoService: CryptoService, public session: sessionStorage, public toastCtrl: ToastrManager, public service: DatabaseService, public router: Router, public dialog: DialogComponent, private progressService: ProgressService) {
    this.url = this.service.uploadUrl + 'logo/';
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data = this.login_data.data;
    this.downurl = service.uploadUrl;
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.activeAcc = JSON.parse(localStorage.getItem('activeAcc'));
    this.logined_user_data = this.userData['data'];
    this.organisation_data = this.logined_user_data['organisation_data'];
    
    
    if(Object.keys(this.userData).length){
      let logindata = this.userData.data
      setTimeout(() => {
        if(logindata.user_type=='DMS') this.fetchAccountList()
        }, 1000);
    }
  }
  
  ngOnInit() {
    this.progressService.getDownloaderActive().subscribe(downloaderActive => {
      this.downloaderActive$ = downloaderActive
    });
    this.progressService.getUploaderActive().subscribe(uploaderActive => {
      this.uploaderActive$ = uploaderActive
    });
    this.progressService.getUploaderDownloadUrl().subscribe(uploadLogdownload => {
      this.uploadLogdownload$ = uploadLogdownload
    });
    
  }
  
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Check for F5, Ctrl + R, Cmd + R, Ctrl + Shift + R, Cmd + Shift + R
    if (event.key === 'F5' ||
      ((event.ctrlKey || event.metaKey) && event.key === 'r') ||
      ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'R')) {
        if (this.downloaderActive$) {
          event.preventDefault(); // Prevent the default action (refresh)
          alert('Download in progress!'); // Show your alert
        }
        if (this.uploaderActive$) {
          event.preventDefault(); // Prevent the default action (refresh)
          alert('File Uploading in progress!'); // Show your alert
        }
      }
    }
    
    // hideWelcomeContainer() {
    //   this.isHidden = true;  // Set to true to hide the container
    // }
    
    openDialog(): void {
      const dialogRef = this.dialog2.open(ProfileAccountModalComponent, {
        width: '400px',
        panelClass: 'cs-model',
        data: {activeAcc:this.service.activeAcc.dr_code}
      });
      
      dialogRef.afterClosed().subscribe(result => {
        if (result != false) {
          this.service.activeAcc = result
        }
      });
    }
    
    fetchAccountList(){
      console.log(this.userData)
      this.encryptedData = this.service.payLoad ? {} : 
      this.cryptoService.encryptData({});
      
      this.service.post_rqst(this.encryptedData, 'login/getChildAccountNames').subscribe(result => {
        if(result['statusCode']==200){
          this.accList = result['company_names']
          let exist = this.accList.filter((row)=>row.parent_id==0)
          if(this.activeAcc==null){
            localStorage.setItem('activeAcc', JSON.stringify(exist[0]))
          }
          
        }
      })
    }
    
    hideWelcomeContainer() {
      this.isHidden = true; // Start the breaking glass animation
      
      // Wait for the animation duration to end before setting display to none
      setTimeout(() => {
        this.isFullyHidden = true; // Finally hide the container with display: none
      }, 500); // Match the animation duration (0.5s or 500ms)
    }
    
    colorMode: boolean = false;
    nightMode() {
      this.colorMode = !this.colorMode;
      if (this.colorMode) {
        this.renderer.addClass(document.body, 'dark-mode');
      }
      else {
        this.renderer.removeClass(document.body, 'dark-mode');
      }
    }
    
    toggle: boolean = false;
    toggleNav() {
      this.toggle = !this.toggle;
      if (this.toggle) {
        this.renderer.addClass(document.body, 'active');
      }
      else {
        this.renderer.removeClass(document.body, 'active');
      }
    }
    
    filter_dr(search) {
      if (search.length > 3) {
        this.encryptedData = this.service.payLoad ? { 'search': search } : this.cryptoService.encryptData({ 'search': search });
        this.service.post_rqst(this.encryptedData, "Master/masterSearch").subscribe((result => {
          if (result['statusCode'] == 200) {
            this.dataList = result['result'];
          }
          else {
            this.toastCtrl.errorToastr(result['statusMsg']);
          }
        }))
        
      }
    }
    
    
    id: any
    type: any
    dr_type: any
    gotodetail(data) {
      console.log(data, 'data');
      
      this.id = data.id
      this.type = data.module_name;
      this.dr_type = data.type
      if (this.type == "Primary" || this.type == 'Secondary') {
        this.router.navigate(['/distribution-list/' + data.type + '/' + data.module_name + '/distribution-detail/' + this.id + '/' + 'Profile', { queryParams: { 'state': data.state, 'id': data.id, 'type': data.type } }])
      }
      else if (data.distribution_type == 'Influencer') {
        this.router.navigate(['/influencer/' + data.type + '/' + data.module_name + '/influencer-detail/' + this.id + '/' + data.type])
      }
      else if (this.type == '') {
        this.router.navigate(['/sale-user-list/sale-user-detail/' + data.id])
      }
      // else {
      //   this.router.navigate(['/sale-user-list/sale-user-detail/'+data.id]);
      // }
      this.searchData = {}
      this.dataList = [];
    }
    
    
    
    
    
    logoutConfimation() {
      this.dialog.confirm("Logout").then((result) => {
        if (result) {
          this.logout();
        }
      });
    }
    
    logout() {
      this.service.post_rqst({}, "login/logout").subscribe((result => {}));
      let value
      this.progressService.getDownloaderActive().subscribe(response => {          
        value = response
      })
      if (value == true) {
        this.cancelDownloading('');
      }
      this.session.LogOutSession();
      this.service.datauser = {};
      this.router.navigate(['']);
    }
    
    clearDownloadsec() {
      this.progressService.setUploaderDownloadUrl('');
    }
    DownloaduploaderLogs() {
      window.open(this.downurl + this.uploadLogdownload$);
      this.progressService.setUploaderDownloadUrl('');
    }
    
    cancelDownloading(msgFalse) {
      this.progressService.setCancelReq(true);
      this.service.post_rqst(this.encryptedData, "DownloadMaster/cancelDownloadRequest").subscribe((result) => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['statusCode'] == 200) {
          this.progressService.setDownloaderActive(false);
          this.progressService.setTotalCount(0);
          this.progressService.setRemainingCount(0);
          this.progressService.setCancelReq(true);
          if (msgFalse != 'msgFalse') {
            this.toastCtrl.successToastr(this.decryptedData['statusMsg'])
          }
          this.cancelRequest();
        }
        else {
          if (msgFalse != 'msgFalse') {
            this.toastCtrl.errorToastr(this.decryptedData['statusMsg'])
          }
        }
        
      }, err => {
      });
    }
    
    
    
    cancelRequest() {
      setTimeout(() => {
        this.progressService.setDownloaderActive(false);
        this.cancelDownloading('msgFalse');
      }, 300);
    }
  }
  