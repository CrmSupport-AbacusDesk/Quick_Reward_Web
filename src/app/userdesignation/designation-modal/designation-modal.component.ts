import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { sessionStorage } from 'src/app/localstorage.service';
import { DatabaseService } from 'src/_services/DatabaseService';
import { CryptoService } from 'src/_services/CryptoService';
import { DialogComponent } from 'src/app/dialog.component';

@Component({
  selector: 'app-designation-modal',
  templateUrl: './designation-modal.component.html'
})
export class DesignationModalComponent implements OnInit {
  assign_module_data: any = [];
  assign_module_data2: any = [];
  savingFlag: boolean = false;
  userData: any = {};
  skLoading: boolean = false;
  filter: any = {};
  infoId: any = '';
  checked: any = {};
  optionsList:any=[]
  options:any={}
  org_id:any;
  constructor(public toast: ToastrManager, public alert: DialogComponent, public cryptoService:CryptoService, @Inject(MAT_DIALOG_DATA) public modelData, public rout: Router, public session: sessionStorage, public service: DatabaseService, public dialogRef: MatDialogRef<DesignationModalComponent>) {
    if(this.modelData.type=='designation'){
      this.infoId = modelData.info.id
      this.getDesignation();
    }
    
    if(this.modelData.type=='typesManagement' || this.modelData.type=='loyaltyBaseManagement'){
      console.log(this.modelData.info)
      this.infoId = modelData.info.id
      this.org_id = modelData.org_id
      this.getOptionsList()
    }
  }
  
  ngOnInit() {
  }
  
  addToList(){
    if(this.options.moduleName){
      const existingItem  = this.optionsList.find(item => item.name === this.options.moduleName);
      if (!existingItem ) {
        this.optionsList.push({name:this.options.moduleName, id:this.infoId, table_name:this.modelData.info.table_name, module_value:this.modelData.info.distribution_type})
        this.updateTypeOptions({name:this.options.moduleName, id:this.infoId, table_name:this.modelData.info.table_name, module_value:this.modelData.info.distribution_type,org_id:this.org_id})
        this.options.moduleName = ''
      } else {
        this.toast.errorToastr('Module Name Already Exists')
      }
    }
  }
  
  updateTypeOptions(payload){
    this.savingFlag = true;
    this.service.post_rqst(payload, "Master/masterDropdownadd").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.toast.successToastr(result['statusMsg']);
        // this.dialogRef.close(true);
      } else {
        this.toast.errorToastr(result['statusMsg'])
      }
      this.savingFlag = false;
    }, err => {
      this.savingFlag = false;
    });
  }
  
  updateCheck(module_name) {
    for (let i = 0; i < this.assign_module_data.length; i++) {
      if (module_name == 'view') {
        if (this.assign_module_data[i]['view'] === '0' || this.assign_module_data[i]['view'] === 0 || this.assign_module_data[i]['view'] === false) {
          this.checked.viewAll = false;
          return;
        }
        else {
          this.checked.viewAll = true;
        }
      }
      
      if (module_name == 'edit') {
        if (this.assign_module_data[i]['edit'] === '0' || this.assign_module_data[i]['edit'] === 0 || this.assign_module_data[i]['edit'] === false) {
          this.checked.editAll = false;
          return;
        }
        else {
          this.checked.editAll = true;
        }
      }
      if (module_name == 'delete') {
        if (this.assign_module_data[i]['delete'] === '0' || this.assign_module_data[i]['delete'] === 0 || this.assign_module_data[i]['delete'] === false) {
          this.checked.deleteAll = false;
          return;
        }
        else {
          this.checked.deleteAll = true;
        }
      }
      if (module_name == 'add') {
        if (this.assign_module_data[i]['add'] === '0' || this.assign_module_data[i]['add'] === 0 || this.assign_module_data[i]['add'] === false) {
          this.checked.addAll = false;
          return;
        }
        else {
          this.checked.addAll = true;
        }
      }
      if (module_name == 'export') {
        if (this.assign_module_data[i]['export'] === '0' || this.assign_module_data[i]['export'] === 0 || this.assign_module_data[i]['export'] === false) {
          this.checked.exportAll = false;
          return;
        }
        else {
          this.checked.exportAll = true;
        }
      }
      
      if (module_name == 'import') {
        if (this.assign_module_data[i]['import'] === '0' || this.assign_module_data[i]['import'] === 0 || this.assign_module_data[i]['import'] === false) {
          this.checked.importAll = false;
          return;
        }
        else {
          this.checked.importAll = true;
        }
      }
      if (module_name == 'approval') {
        if (this.assign_module_data[i]['approval'] === '0' || this.assign_module_data[i]['approval'] === 0 || this.assign_module_data[i]['approval'] === false) {
          this.checked.approvalAll = false;
          return;
        }
        else {
          this.checked.approvalAll = true;
        }
      }
    }
  }
  
  assign_module(module_name, event, index) {
    if (event.checked) {
      this.assign_module_data[index][module_name] = 1;
      this.updateCheck(module_name);
    }
    else {
      this.assign_module_data[index][module_name] = 0;
      this.updateCheck(module_name);
    }
  }

  updateStatus(data,i)
  {
    this.alert.confirm("You Want To Change Scanning Type !").then((result)=>{
      if(result){
        this.service.post_rqst({'org_id':this.org_id,data}, "Master/masterDropdownupdate")
        .subscribe(result => {
          if(result['statusCode'] == 200){
            this.toast.successToastr(result['statusMsg']);
            this.getOptionsList();
          }
          else{
            this.toast.errorToastr(result['statusMsg']);
          }
        })
      }
      else{
        this.getOptionsList();


      }
    })
  }

  
  delteDataRequest(data, i){
    this.alert.confirm(`This action will delete whole data of this client`).then((resp)=>{
      if(!resp) return;
      
      this.savingFlag = true;
      this.service.post_rqst({data}, "Master/masterDropdownDelete").subscribe((result) => {
       
        if (result['statusCode'] == 200) {
          this.optionsList.splice(i, 1)
          this.toast.successToastr(result['statusMsg']);
        } else {
          this.toast.errorToastr(result['statusMsg'])
        }
        this.getOptionsList();
        this.savingFlag = false;
      }, err => {
        this.savingFlag = false;
      });
      
    })
  }
  
  selectAll(event, action) {
    const setValues = (property, value) => {
      for (let i = 0; i < this.assign_module_data.length; i++) {
        if (this.assign_module_data[i][property] !== "disable") {
          this.assign_module_data[i][property] = value;
        }
      }
    };
    if (event.checked === true) {
      switch (action) {
        case 'View':
        setValues('view', true);
        break;
        case 'Edit':
        setValues('edit', true);
        break;
        case 'Delete':
        setValues('delete', true);
        break;
        case 'Add':
        setValues('add', true);
        break;
        case 'Export':
        setValues('export', true);
        break;
        case 'Import':
        setValues('import', true);
        break;
        case 'Approved':
        setValues('approval', true);
        break;
      }
    } else {
      switch (action) {
        case 'View':
        setValues('view', false);
        break;
        case 'Edit':
        setValues('edit', false);
        break;
        case 'Delete':
        setValues('delete', false);
        break;
        case 'Add':
        setValues('add', false);
        break;
        case 'Export':
        setValues('export', false);
        break;
        case 'Import':
        setValues('import', false);
        break;
      }
    }
  }
  
  getOptionsList(){
    // this.optionsList = [];
    this.service.post_rqst({ id:this.infoId,'org_id':this.org_id }, "Master/masterDropdownSubList").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.optionsList = result['data'];
      } else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }, err => {
      
    });
  }
  
  
  
  
  getDesignation() {
    this.skLoading = true;
    this.service.post_rqst({ 'id': this.infoId }, this.modelData.user_type == 'ORG' ? 'Master/designationDetailOrg' : "Master/designationDetail").subscribe(result => {
      if (result['statusCode'] == 200) {
        this.skLoading = false;
        this.assign_module_data = result['designation_detail']['assign_module'];
        this.assign_module_data2 = result['designation_detail']['assign_module'];
      } else {
        this.skLoading = false;
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.skLoading = false;
      this.toast.errorToastr('Something went wrong');
    });
  }
  
  submitDetail() {
    this.userData.assignModule = this.assign_module_data;
    this.userData.id = this.infoId;
    this.savingFlag = true;
    this.service.post_rqst({ 'userData': this.userData }, this.modelData.user_type == 'ORG' ? 'Master/updateOrgDesignationRole' : "Master/updateDesignationRole").subscribe((result => {
      if (result['statusCode'] == "200") {
        this.toast.successToastr(result['statusMsg']);
        this.dialogRef.close(true);
        this.savingFlag = false;
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
        this.savingFlag = false;
      }
    }));
  }
  
  searchModuleName(moduleName) {
    moduleName = moduleName.toLowerCase();
    let tempSearch = '';
    this.assign_module_data = [];
    for (let i = 0; i < this.assign_module_data2.length; i++) {
      tempSearch = this.assign_module_data2[i].module_name.toLowerCase();
      if (tempSearch.includes(moduleName)) {
        this.assign_module_data.push(this.assign_module_data2[i]);
      }
    }
  }
  
  searchDepartmentName(departmentName) {
    departmentName = departmentName.toLowerCase();
    let tempSearch = '';
    this.assign_module_data = [];
    for (let i = 0; i < this.assign_module_data2.length; i++) {
      tempSearch = this.assign_module_data2[i].department_name.toLowerCase();
      if (tempSearch.includes(departmentName)) {
        this.assign_module_data.push(this.assign_module_data2[i]);
      }
    }
  }
  
}
