import { Component, Inject, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-header-setting-modal',
  templateUrl: './header-setting-modal.component.html'
})
export class HeaderSettingModalComponent implements OnInit {
  data: any = {};
  skLoading: boolean = false;
  todo = [];
  done = [];
  fixedHeaderList: any = [];
  module_id;
  module_name;
  app_id;
  allHeaderSearchActive: any;
  selectedHeaderSearchActive: any;
  filter: any = {};
  
  
  constructor(@Inject(MAT_DIALOG_DATA) public modalData, public service: DatabaseService, public toast: ToastrManager, public route: ActivatedRoute) {
    console.log(modalData);
    this.module_id = modalData.module_id;
    this.module_name = modalData.module_name;
    this.app_id = modalData.app_id;
    console.log(this.module_name , this.module_id , this.app_id);
    
    this.getHeader(this.module_name);
  }
  
  ngOnInit() {
  }
  
  
  
  
  
  refresh() {
    this.todo = [];
    this.done = [];
    
  }
  
  
  
  getHeader(module_name) {
    this.skLoading = true;
    this.service.post_rqst({ 'module_name': module_name ,'module_id' : this.module_id , 'app_id': this.app_id }, "Master/fetchHeaders").subscribe((result) => {
      if (result['statusCode'] == 200) {
        for (let i = 0; i < result['result'].length; i++) {
          if (result['result'][i]) {
            this.todo.push({ 'header_id': result['result'][i]['header_id'], 'header_name': result['result'][i]['header_name'], 'header_encoded_name': result['result'][i]['header_encoded_name'], 'header_tbl_col_name': result['result'][i]['header_tbl_col_name'], 'module_id': result['result'][i]['module_id']})
          }
        }
        for (let i = 0; i < result['assign_headers'].length; i++) {
          console.log('1');
          if (result['assign_headers'][i]) {
            console.log('2');
            this.done.push({ 'header_id': result['assign_headers'][i]['header_id'], 'header_name': result['assign_headers'][i]['header_name'], 'header_encoded_name': result['assign_headers'][i]['header_encoded_name'], 'header_tbl_col_name': result['assign_headers'][i]['header_tbl_col_name'], 'module_id': result['assign_headers'][i]['module_id']})
          }
        }
        console.log(this.todo);
        console.log(this.done);
        this.skLoading = false;
      } else {
        this.skLoading = false;
        this.toast.errorToastr(result['statusMsg'])
      }
    });
  }
  
  // selectAllHeader() {
  //   console.log(this.todo);
  //   console.log(this.done);

  //   this.done.push(this.todo);
  //   this.todo = [];

  //   console.log(this.todo);
  //   console.log(this.done);
    
  // }
  
  // removeAllHeader() {
  //   console.log(this.todo);
  //   console.log(this.done);

  //   this.todo.push(this.done);
  //   this.done = [];

  //   console.log(this.todo);
  //   console.log(this.done);    
  // }
  
  saveHeader() {
    this.skLoading = true;
    this.service.post_rqst({ 'selected_headers': this.done, 'app_id': this.app_id}, "Master/assignHeaders").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.toast.successToastr(result['statusMsg']);
        this.skLoading = false;
      } else {
        this.skLoading = false;
        this.toast.errorToastr(result['statusMsg'])
      }
    });
  }
  
  drop(event: CdkDragDrop<string[]>, filterName: any) {
    this.filter[filterName] = '';
    this.selectedHeaderSearchActive = false;
    this.allHeaderSearchActive = false;
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      }
    }
    
  }
  