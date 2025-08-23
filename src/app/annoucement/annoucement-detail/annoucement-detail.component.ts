import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService'
import { MatDialog } from '@angular/material';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';


@Component({
  selector: 'app-annoucement-detail',
  templateUrl: './annoucement-detail.component.html',
  styleUrls: ['./annoucement-detail.component.scss']
})
export class AnnoucementDetailComponent implements OnInit {
  skLoading:boolean= false;
  noticeId:any='';
  loader:any;
  noticeDetail:any={}
  url:any=''

  constructor(public toast: ToastrManager,
              public cryptoService: CryptoService,
              public route:ActivatedRoute,
              public serve:DatabaseService,
              public router :Router ,
              public dialog: MatDialog,
              public alert:DialogComponent) 
  { 
    this.url=serve.uploadUrl;

    this.route.params.subscribe( params => {
      let id = params.id.replace(/_/g, '/');
      this.noticeId = this.cryptoService.decryptId(id);
      this.serve.currentUserID = this.cryptoService.decryptId(id);
      if(id){
        this.getAnnouncementDetail();
      }
    });
  }

  ngOnInit() 
  {
  }

  getAnnouncementDetail()
  {
    this.skLoading = true;
    this.serve.post_rqst({'noticeId':this.noticeId},"Announcement/announcementDetail").subscribe(result=>
    {
      if(result['statusCode']==200){
        this.noticeDetail = result['announcemenDetail'];
      this.skLoading = false;
      }else{
      this.skLoading = false;
      this.toast.errorToastr(result['statusMsg']);
      }
      
    }, err=>{
      this.toast.errorToastr('Something went wrong');
    })
    
    
    
  }

}
