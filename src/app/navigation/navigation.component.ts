import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MatDialog } from '@angular/material';
import { sessionStorage } from '../localstorage.service';
import { animationFrameScheduler } from 'rxjs';
import { StatusModalComponent } from '../order/status-modal/status-modal.component';
import { skip } from 'rxjs/operators';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  
  
})
export class NavigationComponent implements OnInit {
  count: any = [];
  @ViewChild(DashboardComponent) childComponent: DashboardComponent;
  
  
  
  // distactive: boolean = false;
  // ordersactive: boolean = false;
  // masteractive: boolean = false;
  // reportactive: boolean = false;
  // loyaltyreportactive: boolean = false;
  // sfaReportActive: boolean = false;
  // leadactive: boolean = false;
  // targetactive: boolean = false;
  // accountactive: boolean = false;
  // schemeactive: boolean = false;
  // travelactive: boolean = false;
  // siteactive: boolean = false;
  // dispatchactive: boolean = false;
  // popactive: boolean = false;
  
  activeNavTab:any=''
  
  login_data: any = {};
  data: any = {};
  networkType: any = [];
  networkType1: any = [];
  activeAcc:any={}
  read: any = {};
  nexturl: any;
  tab: 'System Alerts';
  tabType: 'Profile';
  encrypt_id:any;
  
  // report = [{ 'type': 'PJP-Detail-Report' }, { 'type': 'PJP-Summary-Report' }, { 'type': 'Attendance-Report' }, { 'type': 'Expense-Report' }, { 'type': 'Visit-Detail-Report' }, { 'type': 'Visit-Summary-Report' }, { 'type': 'Deviation-Detail-Report' }, { 'type': 'Deviation-Summary-Report' }]
  customerNetworkList:any=[
    {"id":45,"org_id":4,"type":1,"module_name":"Primary","distribution_type":"Dr"},
    {"id":46,"org_id":4,"type":3,"module_name":"Secondary","distribution_type":"Dr"}
  ]
  
  
  constructor(public session: sessionStorage, public cryptoService:CryptoService, public route: ActivatedRoute, public serve: DatabaseService, public dialog: MatDialog, private renderer: Renderer2, private router: Router) {
    this.tabType = 'Profile';
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data = this.login_data.data;
    console.log('Login Data',this.login_data)
    this.encrypt_id =  this.cryptoService.encryptId(this.login_data.id.toString()) 

    this.activeAcc = JSON.parse(localStorage.getItem('activeAcc'))
    this.serve.count_list();
    this.serve.dr_list();
    this.serve.influencer_netwrk();
  }
  ngOnInit() {
    this.data.filter_type = 'LOYALTY';
  }
  
  
  getNetworkType() {
    this.serve.post_rqst('', "CustomerNetwork/distributionNetworkModule").subscribe((result => {
      this.networkType = result['modules'];
    }))
  }
  getNetworkType1() {
    this.serve.post_rqst('', "Dashboard/leadNetworkModule").subscribe((result => {
      this.networkType1 = result['modules'];
    }))
  }
  

  onFilterTypeChange(filterType: string) {
    this.router.navigate(['/dashboard/', filterType]);
  }
  
  activeTabHandler(tab:any=''){
    if(this.activeNavTab==tab) this.activeNavTab='';
    else this.activeNavTab=tab;
  }
  
  status: boolean = false;
  clearFilter() {
    let blank_data = {}
    this.serve.setData(blank_data);
    this.serve.count_list();
    this.serve.currentUserID = ''
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data = this.login_data.data;
  }
  
  
  
  toggleHeader() {
    this.status = !this.status;
    if (!this.status) {
      this.renderer.addClass(document.body, 'nav-active');
    }
    else {
      this.renderer.removeClass(document.body, 'nav-active');
    }
  }
  
  status1: boolean = false;
  toggleNav() {
    this.status1 = !this.status1;
    if (this.status1) {
      this.renderer.addClass(document.body, 'active');
    }
    else {
      this.renderer.removeClass(document.body, 'active');
    }
  }
  gotodmspages(tabtype) {
    this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/distribution-list/1/Channel%20Partner/distribution-detail/' + this.encrypt_id + '/' + tabtype;
    this.router.navigate([this.nexturl]);
  }
  
  openDialog(type): void {
    const dialogRef = this.dialog.open(StatusModalComponent, {
      width: '400px',
      panelClass: 'padding0',
      disableClose: true,
      
      data: {
        'delivery_from': type,
        
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {
      }
    });
    
  }
  
}
