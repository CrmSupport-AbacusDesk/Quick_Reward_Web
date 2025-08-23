
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from '../dialog.component';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-engineer-assign-model-component',
  templateUrl: './engineer-assign-model-component.component.html',
  styleUrls: ['./engineer-assign-model-component.component.scss']
})
export class EngineerAssignModelComponentComponent implements OnInit {
  
  formData:any={}
  engineerList: any = [];  
  id;
  carpenter_id:any;

  savingFlag:boolean = false;
  
  
  constructor(@Inject(MAT_DIALOG_DATA) public data,public dialogRef: MatDialogRef<EngineerAssignModelComponentComponent>,public service: DatabaseService,public toast: ToastrManager,public alert:DialogComponent,public dialog:MatDialog) {
    // console.log(this.data.carpenter_id,'carpenter_id');
   }

  
  ngOnInit() {
    this.assign_engineerget('');
  }
  
  filter: any = {};
  assign_engineerget(searcValue) {
    this.filter.technician_detail = searcValue;
    this.filter.state = this.data.state;
    this.service.post_rqst({ 'filter': this.filter, }, 'ServiceTask/plumberList').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.engineerList = resp.data;
        // console.log(this.data.carpenter_id);
        this.formData.id=this.data.carpenter_id;
        // console.log(this.formData.id);
      }
      else {
        this.toast.errorToastr(resp['statusMsg'])
      }
    }, error => {
    })
  }

  getCarpenterInfo(id)
  {
    console.log(id);
    if(id){
      let index= this.engineerList.findIndex(d=> d.id==id);
      if(index!=-1){
        this.formData.id= this.engineerList[index].id;
        this.formData.name= this.engineerList[index].name;
        this.formData.mobile_no= this.engineerList[index].mobile_no;
      }
      console.log(this.data.id);
      console.log(this.data.mobile_no);
      console.log(this.data.name);
    }
  }
  
  assign_engineer(){ 
    console.log(this.id);
    this.savingFlag = true;

    this.service.post_rqst({'complaint_id':this.data.id,'data':this.formData},"ServiceTask/carpenterAssign").subscribe((result)=>{
      
      if(result['statusCode']==200)
      {
        this.toast.successToastr(result['statusMsg']);
        this.dialogRef.close(true);
      }else{
        this.toast.errorToastr(result['statusMsg']);
        this.savingFlag = false;

      }
    })
  }
  
}
