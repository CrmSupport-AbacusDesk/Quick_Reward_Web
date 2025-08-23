import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import {  sessionStorage} from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';
import { CryptoService } from 'src/_services/CryptoService';


@Component({
  selector: 'app-edit-survey',
  templateUrl: './edit-survey.component.html',
  styleUrls: ['./edit-survey.component.scss']
})
export class EditSurveyComponent implements OnInit {
  savingFlag:boolean = false;
  segment:any={};
  category:any={};
  login:any={};
  Edit_type:any;
  servey_detail:any=[]
  Data:any={}
  userData: any;
  userId: any;
  userName: any;
  id: any=''
  Users:any = []
  minDate:any;
  encryptedData: any;
  decryptedData:any;

  
  constructor(@Inject(MAT_DIALOG_DATA)public data, public cryptoService:CryptoService,public dialog:MatDialog,public service:DatabaseService, public session: sessionStorage,public toast:ToastrManager, public dialogRef: MatDialogRef<EditSurveyComponent>) { 
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.minDate = new Date();
    this.segment=this.data.segment;
    this.userId=this.userData['data']['id'];
    this.userName=this.userData['data']['name'];
    this.Edit_type=this.data.Edit_type;
    this.id=this.data.id;
    this.getNetworkType()
    this.getState()
    this.survey_detail()
  }
  
  ngOnInit() {
    this.login=JSON.parse(localStorage.getItem('login'));
  }
  getNetworkType() {
    this.encryptedData = this.service.payLoad ? { 'type': 'checkin' }: this.cryptoService.encryptData({ 'type': 'checkin' });
    this.service.post_rqst(this.encryptedData, "Survey/allNetworkModule").subscribe((result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if(this.decryptedData['statusCode'] == 200){
        this.Users = this.decryptedData['modules']
      }
      else{
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }))
  }
  survey_detail(){
    this.encryptedData = this.service.payLoad ? {'id':this.id }: this.cryptoService.encryptData({'id':this.id });
    this.service.post_rqst(this.encryptedData,'Survey/surveyDetail').subscribe((result)=>
    {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if(this.decryptedData['statusCode'] == 200){
        this.Data = this.decryptedData['data']
        setTimeout(() => {
        }, 700);
      }
      else{
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    })
  }
  reason_reject:any
  
  Edit_survey(){
    this.savingFlag = true;
    this.Data.created_by_name = this.userName;
    this.Data.uid = this.userId;
    this.Data.survey_id = this.id;
    if (this.Data.start_date){
      
      this.Data.start_date = moment(this.Data.start_date).format('YYYY-MM-DD');
    }
    if (this.Data.end_date){
      
      this.Data.end_date = moment(this.Data.end_date).format('YYYY-MM-DD');
    }
    this.encryptedData = this.service.payLoad ? this.Data: this.cryptoService.encryptData(this.Data);
    this.service.post_rqst(this.encryptedData,"Survey/updateSurveyBasicDetail").subscribe((result=>{
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200){
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.savingFlag = false;
        this.dialogRef.close(true)
      }else{
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.savingFlag = false;
      }
      
    }))
  }
  states = []
  selState = []
  getState(){
    
    this.service.post_rqst({},'User_new/get_all_state').subscribe((result)=>
    {   
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      this.states=this.decryptedData['all_state'];
    }, error => {
    })
    
  }
  setState(e, state){
    if(e.checked == true){
      this.selState.push(state);
    }
    else{
      let removeindex = this.selState.findIndex(r=> r == state );
      this.selState.splice(removeindex, 1);
    }
  }
  allState(){
    if( !this.data.allStates ){
      this.selState= [];
      for (let i = 0; i < this.states.length; i++) {
        this.states[i].selected = false;
      }
    }else{
      this.selState= [];
      for (let i = 0; i < this.states.length; i++) {
        this.states[i].selected = true;
        this.selState.push(this.states[i].state_name);
      }
    }
  }
}
