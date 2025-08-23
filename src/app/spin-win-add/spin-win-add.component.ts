import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-spin-win-add',
  templateUrl: './spin-win-add.component.html',
  styleUrls: ['./spin-win-add.component.scss']
})
export class SpinWinAddComponent implements OnInit {
  spinSlab:any=[];
  data:any={};
  userData: any;
  userId: any;
  userName: any;
  badges_id:any;
  savingFlag:boolean = false;
  login_data: any = {};
  st_user: any
  encryptedData: any;
  skLoading:any=false;
  InfluenceArray: any = [];
  decryptedData:any;
  subType:number=0
  today_date: any = new Date();
  constructor(public service:DatabaseService, public cryptoService:CryptoService, public rout: Router, public toast:ToastrManager, private route: ActivatedRoute) {
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId=this.userData['data']['id'];
    this.userName=this.userData['data']['name'];
    this.st_user = JSON.parse(localStorage.getItem('st_user')) || [];
    this.subType = parseInt(this.userData['organisation_data']['scanning_sub_type_wise']);
    this.today_date = new Date();
  }

  ngOnInit() {

    if(this.subType){
      this.fetchInfluencerList()
    }
  }

  fetchInfluencerList(){
    // this.sessionTimer();
    this.st_user = JSON.parse(localStorage.getItem('st_user')) || [];
    if (this.st_user.data) {
      this.login_data = this.st_user.data;
      this.encryptedData = this.service.payLoad ? { 'user_id': this.login_data.id, 'user_type': this.login_data.type} : this.cryptoService.encryptData({ 'user_id': this.login_data.id, 'user_type': this.login_data.type });
      this.service.post_rqst(this.encryptedData, "Influencer/influencerMasterList").subscribe(result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData) {
          this.InfluenceArray = this.decryptedData['result'];
        }
        else {
        }

      });
    }
  }

  daysLength(){
    if(this.data.eligible_days == 0){
      this.toast.errorToastr('This value greater than zero');
      this.data.eligible_days = '';
      return;
    }
  }


  submitDetail(){

    if(this.spinSlab.length == 0){
      this.toast.errorToastr('Please add slab Points.');
      return;
    }
    if(this.data.date_from){
      this.data.date_from = moment(this.data.date_from).format('YYYY-MM-DD');
    }
    if(this.data.date_to){
      this.data.date_to = moment(this.data.date_to).format('YYYY-MM-DD');
    }
   
    this.data.created_by_name=this.userName;
    this.data.created_by_id=this.userId;
    this.data.data=this.spinSlab;
    this.savingFlag = true;
    this.encryptedData = this.service.payLoad ? this.data: this.cryptoService.encryptData(this.data);
    
    let header;
    header = this.service.post_rqst(this.encryptedData,'Bonus/insertSpin')
    header.subscribe((result)=>
    {
      
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      if( this.decryptedData['statusCode'] == 200){
        this.toast.successToastr( this.decryptedData['statusMsg']);
        this.savingFlag = false;
        this.rout.navigate(['/spin-win-list']);
      }
      else{
        this.toast.errorToastr( this.decryptedData['statusMsg']);
        this.savingFlag = false;
      }
    }, error => {
    })
    
  }

  addToList(){

    if(this.data.section == '' || this.data.section == undefined || this.data.section == null){
      this.toast.errorToastr('First of all fill the point section after you add point slab');
      return;
    }
    this.spinSlab.push({slab_point:this.data.spin_points})
    if(this.data.section < this.spinSlab.length){
      this.toast.errorToastr('You could not add more slab from point section.');
      this.spinSlab.splice(-1, 1);
      this.data.spin_points = '';    
      return;
    }
    this.data.spin_points = '';    
  }


  delteDataRequest(index) {
    this.spinSlab.splice(index, 1);
}

}
