import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogComponent } from 'src/app/dialog.component';
import { DialogService } from 'src/app/dialog.service';
import { sessionStorage } from 'src/app/localstorage.service';
import { ExportexcelService } from 'src/app/service/exportexcel.service';
import { DatabaseService } from 'src/_services/DatabaseService';
import { Location } from '@angular/common';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';
import { CryptoService } from 'src/_services/CryptoService';


@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html'
})
export class TaskDetailComponent implements OnInit {
  task_id;
  getData:any ={};
  skLoading:boolean = false;
  url:any;
  assign_login_data:any={};
  logined_user_data:any={};
  
  constructor( public location: Location,  public cryptoService:CryptoService,public dialogs: MatDialog, public session: sessionStorage, private router: Router, public alert: DialogComponent, public service: DatabaseService, public editdialog: DialogService, public dialog: MatDialog, public route: ActivatedRoute, public toast: ToastrManager, public excelservice: ExportexcelService, public dialog1: DialogComponent) {
    
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    this.url = this.service.uploadUrl + 'task/';
    
    
    this.route.params.subscribe(params => {
      let id = params.id.replace(/_/g, '/');
      this.task_id = this.cryptoService.decryptId(id);
      this.service.currentUserID = this.cryptoService.decryptId(id)
      this.url = this.service.uploadUrl + 'product_image/';
      if (id) {
        this.getTaskDetail();
      }
    });
  }
  
  ngOnInit() {
  }
  
  
  getTaskDetail()
  {
    this.skLoading = true;
    this.service.post_rqst({'id':this.task_id},"Task/getTaskDetail").subscribe((result=>
      {
        if(result['statusCode'] == 200){
          this.getData = result.data;
          this.skLoading = false;
        }
        else{
          this.toast.errorToastr(result['statusMsg']);
        }
      }
      ));
      
    }
    
    
    back(): void {
      this.location.back()
    }
    
    
    goToImage(image)
    {
      const dialogRef = this.dialogs.open(ImageModuleComponent, {
        panelClass:'Image-modal',
        data:{
          'image':image,
          'type':'base64'
        }});
        dialogRef.afterClosed().subscribe(result => {
        });
        
      }
      
    }
    