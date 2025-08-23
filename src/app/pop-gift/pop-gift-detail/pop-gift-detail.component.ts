import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
// import { PearlService } from 'src/app/pearl.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';



import { PopGiftIssueModalComponent } from '../pop-gift-issue-modal/pop-gift-issue-modal.component';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-pop-gift-detail',
  templateUrl: './pop-gift-detail.component.html'
})
export class PopGiftDetailComponent implements OnInit {
  skelton:any={};
  id:any={};
  popData:any={};
  stockList:any =[];
  loader:any;
  data_not_found=false;
  incoming_data_not_found=false;
  logIN_user: any;
  skLoading:boolean = false;
  
  
  constructor(public dialog: MatDialog, public cryptoService:CryptoService, public session: sessionStorage ,public service: DatabaseService,public route:Router,public routes:ActivatedRoute) {
    
    
  }
  
  ngOnInit() 
  {
    this.routes.params.subscribe( params => {
      let id = params.id.replace(/_/g, '/');
      this.id = this.cryptoService.decryptId(id);
      this.service.currentUserID =  this.cryptoService.decryptId(id)
      this.logIN_user = JSON.parse(localStorage.getItem('user'));
      if(id){
        this.gift_detail();
      }
    });
  }
  
  
  
  gift_detail()
  {
    this.skLoading = true;
    this.service.post_rqst({"id":this.id},"PopGift/popDetail").subscribe((result=>{
      this.popData=result['result']['data'];
      this.stockList=result['result']['incoming'];
      this.skLoading = false;
    }))
  }
  
}
