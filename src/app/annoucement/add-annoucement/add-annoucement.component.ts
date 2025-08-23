import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService'
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-add-annoucement',
  templateUrl: './add-annoucement.component.html',
  animations: [slideToTop()]
})
export class AddAnnoucementComponent implements OnInit {
  savingFlag: boolean = false;
  city_list: any = [];
  announcementData: any = {};
  states: any = [];
  district_list: any = [];
  distributorList: any = [];
  directDealerList: any = [];
  dealertList: any = [];
  salesUserList: any = [];
  urls = new Array<string>();
  selectedFile = [];
  submit = false;
  loader: any;
  formData = new FormData();
  userData: any;
  userId: any;
  userName: any;
  search: any = {}
  assign_login_data: any = [];
  assign_login_data2: any = [];
  networkType: any = [];
  influencerNetwork: any = [];
  today_date: any = new Date()

  constructor(public toast: ToastrManager, public serve: DatabaseService, public rout: Router, public session: sessionStorage, public dialog: DialogComponent) {
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;

    this.getStateList('');
    this.announcementData.secondary = [];
    this.announcementData.direct_dealer = [];
    this.announcementData.primary = [];
    this.announcementData.users = [];
    this.announcementData.influencer = [];

    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
    this.getNetworkType();


  }

  ngOnInit() {

  }
  selectAllStates(action) {
    if (action == 'allstate') {
      setTimeout(() => {
        if (this.announcementData.allstate == true) {
          const Allstates = [];
          for (let i = 0; i < this.states.length; i++) {
            Allstates.push(this.states[i].state_name)
          }
          this.announcementData.state = Allstates;
          this.getStateList('')
          console.table(this.announcementData.state)
        } else {
          this.announcementData.state = [];
        }
      }, 100);
    }
  }
  getStateList(search) {

    this.serve.post_rqst({ 'search': search }, "Announcement/getAllState").subscribe(response => {
      if (response['statusCode'] == 200) {
        this.loader = false;
        this.states = response['all_state'];
      } else {
        this.loader = false;
        this.toast.errorToastr(response['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');

    });

  }

  getNetworkType() {
    setTimeout(() => {
      this.serve.post_rqst('', "Announcement/leadNetworkModule").subscribe((result => {
        this.networkType = result['modules'];
      }))
    }, 3000);
  }

  getInfluencer(type, search) {
    this.serve.post_rqst({ 'type': type, 'search': search, 'state': this.announcementData.state }, "Announcement/getInfluencer").subscribe((result => {
      this.influencerNetwork = result['influencer'];
    }))
  }



  getCityList() {
    let value = { "state": this.announcementData.state, "district": this.announcementData.district }
    this.serve.post_rqst(value, "User/city_user_list").subscribe((response => {

      this.city_list = response['query']['city'];
    }));
  }
  getUserDrList(searcValue, filter) {
    this.serve.post_rqst({ 'state': this.announcementData.state, 'district': this.announcementData.district, 'city': this.announcementData.city, 'filter': filter, 'search': searcValue, 'user_id': this.assign_login_data2.id, 'user_type': this.assign_login_data2.type }, "Announcement/userDrList").subscribe((response => {
      if (response['statusCode'] == 200) {
        this.loader = false;
        this.distributorList = response['result'];
        this.directDealerList = response['result'];
        this.dealertList = response['result'];
        this.salesUserList = response['result'];
        // this.toast.errorToastr(response['statusMsg']);
      } else {
        this.loader = false;
        this.toast.errorToastr(response['statusMsg']);
      }

    }));
  }
  selectAll(action) {
    if (action == 'dealers') {
      setTimeout(() => {
        if (this.announcementData.all_dealers == true) {
          const dealerData = [];
          for (let i = 0; i < this.dealertList.length; i++) {
            dealerData.push(this.dealertList[i].id);
          }
          this.announcementData.secondary = dealerData.map(String);
        }
        else {
          this.announcementData.secondary = []
        }
      }, 200);

    }

    if (action == 'direct_dealer') {
      setTimeout(() => {
        if (this.announcementData.all_direct_dealer == true) {
          const directDealerData = [];

          for (let i = 0; i < this.directDealerList.length; i++) {
            directDealerData.push(this.directDealerList[i].id);

          }
          this.announcementData.direct_dealer = directDealerData.map(String);
        }
        else {
          this.announcementData.direct_dealer = []
        }
      }, 200);
    }

    if (action == 'distributors') {

      setTimeout(() => {
        if (this.announcementData.all_distributors == true) {

          const distributorData = [];
          for (let i = 0; i < this.distributorList.length; i++) {

            distributorData.push(this.distributorList[i].id);

          }



          this.announcementData.primary = distributorData.map(String);
        }
        else {
          this.announcementData.primary = []
        }


      }, 200)
    }

    if (action == 'users') {


      setTimeout(() => {
        if (this.announcementData.all_users == true) {
          const userData = [];
          for (let i = 0; i < this.salesUserList.length; i++) {
            userData.push(this.salesUserList[i].id);
          }

          this.announcementData.users = userData.map(String);
        }
        else {
          this.announcementData.users = []
        }
      }, 200)
    }


    if (action == 'influencer') {


      setTimeout(() => {
        if (this.announcementData.all_influencer == true) {
          const userData = [];
          for (let i = 0; i < this.influencerNetwork.length; i++) {
            userData.push(this.influencerNetwork[i].id);
          }

          this.announcementData.influencer = userData.map(String);
        }
        else {
          this.announcementData.influencer = []
        }
      }, 200)
    }
    // 

  }


  insertImage(data) {
    let files = data.target.files;
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.urls.push(e.target.result);
        }
        reader.readAsDataURL(file);
      }
    }

    for (var i = 0; i < data.target.files.length; i++) {
      this.selectedFile.push(data.target.files[i]);
    }
  }

  remove_image(i: any) {

    this.urls.splice(i, 1);
    this.selectedFile.splice(i, 1);
  }


  delete_img(index: any) {
    this.urls.splice(index, 1)
  }

  blankValue(type) {
    if (type == 'Distributor') {
      this.announcementData.all_direct_dealer = false;
      this.announcementData.direct_dealer = [];
      this.announcementData.all_dealers = false;
      this.announcementData.secondary = [];
      this.announcementData.all_users = false;
      this.announcementData.users = [];
      this.announcementData.influencer_type = '';
      this.announcementData.influencer = [];
    }
    else if (type == "Direct Dealer") {
      this.announcementData.all_distributors = false;
      this.announcementData.primary = [];
      this.announcementData.all_dealers = false;
      this.announcementData.secondary = [];
      this.announcementData.all_users = false;
      this.announcementData.users = [];
      this.announcementData.influencer_type = '';
      this.announcementData.influencer = [];
    }
    else if (type == "Retailer") {
      this.announcementData.all_distributors = false;
      this.announcementData.primary = [];
      this.announcementData.all_direct_dealer = false;
      this.announcementData.direct_dealer = [];
      this.announcementData.all_users = false;
      this.announcementData.users = [];
      this.announcementData.influencer_type = '';
      this.announcementData.influencer = [];
    }
    else if (type == "Sales Executive") {
      this.announcementData.all_distributors = false;
      this.announcementData.primary = [];
      this.announcementData.all_direct_dealer = false;
      this.announcementData.direct_dealer = [];
      this.announcementData.all_dealers = false;
      this.announcementData.secondary = [];
      this.announcementData.influencer_type = '';
      this.announcementData.influencer = [];
    }
    else if (type == "Influencer") {
      this.announcementData.all_distributors = false;
      this.announcementData.primary = [];
      this.announcementData.all_direct_dealer = false;
      this.announcementData.direct_dealer = [];
      this.announcementData.all_dealers = false;
      this.announcementData.secondary = [];
      this.announcementData.all_users = false;
      this.announcementData.users = [];
    }

  }

  submitAnnouncement() {
    this.announcementData.uid = this.userId;
    this.announcementData.userName = this.userName;
    this.savingFlag = true;

    this.serve.post_rqst(this.announcementData, "Announcement/addAnnouncement").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.savingFlag = false;
        let id = result['announcement_id'];

        // for(var i=0; i<this.selectedFile.length; i++)
        // {
        //   this.formData.append("image"+i,this.selectedFile[i],this.selectedFile[i].name);
        // }

        this.formData.append('id', id);

        // if(this.selectedFile && this.selectedFile.length > 0)
        // {
        //   this.savingFlag = true;
        //   this.serve.FileData(this.formData,"Announcement/insertImage").subscribe((resp)=>
        //   {
        //     if(resp['statusCode']==200)
        //     {
        //       this.savingFlag = false;
        //       this.dialog.success("Announcement","Sent");
        //       this.rout.navigate(['/announcement-list']);
        //     }else{
        //       this.savingFlag = false;
        //       this.toast.errorToastr(result['statusMsg']);
        //     }
        //   });
        // }

        this.savingFlag = false;
        this.dialog.success("Announcement", "Sent");
        this.rout.navigate(['/announcement-list']);
        this.serve.count_list();
      } else {
        this.savingFlag = false;
        this.toast.errorToastr(result['statusMsg']);
      }

    }, err => {
      this.savingFlag = false;
      this.toast.errorToastr('Something went wrong');
    })

  }


  // fileChange(event:any) {


  //   for (var i = 0; i < event.target.files.length; i++) {
  //     this.selectedFile.push(event.target.files[i]);

  //     let reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       this.urls.push(e.target.result);


  //       for (let index = 0; index < this.selectedFile.length; index++) {

  //         for (let urlIndex = 0; urlIndex < this.urls.length; urlIndex++) {

  //           if(index == urlIndex) {
  //             this.selectedFile[index]['path'] = this.urls[urlIndex];
  //           }
  //         }
  //       }



  //     }

  //     reader.readAsDataURL(event.target.files[i]);

  //   }
  // }

  image = new FormData();
  announcementUpolad(data: any) {
    for (let i = 0; i < data.target.files.length; i++) {

      let files = data.target.files[i];
      if (files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.announcementData.image = e.target.result;


        }
        reader.readAsDataURL(files);
      }
      // else {
      //     this.panBase64 = false;
      // }
      this.image.append("" + i, data.target.files[i], data.target.files[i].name);
    }
  }


}
