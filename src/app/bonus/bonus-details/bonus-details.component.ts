import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { UploadFileModalComponent } from 'src/app/upload-file-modal/upload-file-modal.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { BonusUpdateComponent } from '../bonus-update/bonus-update.component';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-bonus-details',
  templateUrl: './bonus-details.component.html'
})
export class BonusDetailsComponent implements OnInit {
  id: any;
  data: any = {};
  skLoading: boolean = false;
  savingFlag: boolean = false;
  bonusdetail_data: any = {};
  districts: any = [];
  State_list: any = [];
  form_statelist: any = [];
  form_districtlist: any = [];
  assign_login_data: any = {};
  logined_user_data: any = {};
  runningScheme: any = [];
  filter: any={};
  lastPageProduct:any=[];
  pointCategories_data:any=[]
  labelPosition = 'before';
  editTrue:boolean = false



  constructor(public route: ActivatedRoute, public cryptoService:CryptoService,public toast: ToastrManager, public dialog: MatDialog, public dialogs: DialogComponent, public session: sessionStorage, public rout: Router, public service: DatabaseService, public alrt: MatDialog) {
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
 

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params.id.replace(/_/g, '/');
      this.id = this.cryptoService.decryptId(id)
      this.service.currentUserID = this.cryptoService.decryptId(id)
      if(id){
        this.bonus_detail();
      }
    });
  }

  bonus_detail() {
    this.skLoading = true;
    this.service.post_rqst({ 'id': this.id }, 'Bonus/bonusDetail').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.bonusdetail_data = result['data'];
        this.runningScheme = result['data']['influencer_ids'];
        this.lastPageProduct= result['data']['product_data']
        var statearrey = (this.bonusdetail_data['state']).split(",");
        var len = statearrey.length;
        for (var i = 0; i < len; i++) {
          if (statearrey[i]) {
            this.getDistrictList(statearrey[i], true);
          }
        }
        this.getState();

        this.skLoading = false;

        var distarrey = (this.bonusdetail_data['district']).split(",");

        var len1 = distarrey.length;
        for (var i = 0; i < len1 ; i++) {
          if (distarrey[i]) {
            this.getSelDistrict(statearrey[0], distarrey[i], true);
            this.storedistrict(statearrey[0], distarrey[i]);
          }
        }
        if (this.bonusdetail_data.types == 'Influencer') {
          // this.getAreaInfluencer();
         this.pointCategory_data('Item Box');

        }


        setTimeout(() => {
          this.skLoading = false;
        }, 700);
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    })
  }
  states: any = [];
  getState() {
    setTimeout(() => {
      this.service.post_rqst({}, 'Bonus/getAllState').subscribe((result) => {
        if (result['statusCode'] == 200) {
          this.states = result['all_state'];
          this.datastateupdate();
        }
        else {
          this.toast.errorToastr(result['statusMsg']);
        }
      }, error => {
      })
    }, 2000);

  }


  datastateupdate() {
    for (var i = 0; i < this.form_statelist.length; i++) {
      for (var ji = 0; ji < this.states.length; ji++) {
        if (this.form_statelist[i].state_name == this.states[ji].state_name) {
          this.states[ji].state_value = true;
        }
      }
    }
  }

  dataupdatedistrict() {
    const uniqueDistrict = this.form_districtlist.filter((item, index, self) =>
      index === self.findIndex((t) =>
        t.state_name === item.state_name && t.district_name === item.district_name
      )
    );

    this.form_districtlist = uniqueDistrict;
    for (var i = 0; i < this.form_districtlist.length; i++) {
      for (var ji = 0; ji < this.districts.length; ji++) {
        for (var ki = 0; ki < this.districts[ji].district.length; ki++) {
          if (this.form_districtlist[i].district_name == this.districts[ji].district[ki].district_name) {
            this.districts[ji].district[ki].district_value = true;
          }
        }
      }
    }

  }


  newDistrict: any = []
  districtList(stateinput) {
    setTimeout(() => {
      this.service.post_rqst({ 'state_name': stateinput }, "Bonus/getAllDistrict").subscribe((result => {
        if (result['statusCode'] == 200) {
          this.newDistrict = result['all_district'];
          this.districts.push({ 'state_name': stateinput, 'district': this.newDistrict });
          const uniqueDistrict = this.districts.filter((item, index, self) =>
            index === self.findIndex((t) => t.state_name === item.state_name)
          );
          this.districts = uniqueDistrict;
          this.dataupdatedistrict();
        }
        else {
          this.toast.errorToastr(result['statusMsg']);
        }


      }));
    }, 1000);

  }

  storestate(state_name) {
    if (state_name) {
      this.form_statelist.push({ state_name: state_name });
    }
  }
  removeStateListData(state_name) {

    var x = this.form_statelist.findIndex(items => items.state_name === state_name);
    if (x != '-1') this.form_statelist.splice(x, 1);
  }

  storedistrict(stateinp, district_name) {
    if (district_name) {
      this.form_districtlist.push({ 'state_name': stateinp, 'district_name': district_name });

      const uniqueDistrict = this.form_districtlist.filter((item, index, self) =>
        index === self.findIndex((t) =>
          t.state_name === item.state_name && t.district_name === item.district_name
        )
      );

      this.form_districtlist  =  uniqueDistrict;
    }
  }

  removeDistrictListData(district_name) {
    const uniqueDistrict = this.form_districtlist.filter((item, index, self) =>
      index === self.findIndex((t) =>
        t.state_name === item.state_name && t.district_name === item.district_name
      )
    );
    this.form_districtlist = uniqueDistrict
    var x = this.form_districtlist.findIndex(items => items.district_name === district_name);
    if (x != '-1') this.form_districtlist.splice(x, 1);
    
  }

  removeDist(stateinput) {
    var x = this.districts.findIndex(items => items.state_name === stateinput);
    if (x != '-1') this.districts.splice(x, 1);

  }

  getDistrictList(stateinput, e) {
    if (e && this.all_state_check==false) {
      this.districtList(stateinput);
      this.storestate(stateinput);
    } else  {
      this.removeDist(stateinput);
      this.removeStateListData(stateinput);
    }
  }
  all_dis_check: any = false;
  sel_all_dis(e) {
    if (e.checked==true) {
      this.all_dis_check = true;
      for (let i = 0; i < this.districts.length; i++) {
        for (let j = 0; j < this.districts[i]['district'].length; j++) {
          this.storedistrict(this.districts[i]['state_name'], this.districts[i]['district'][j]['district_name']);
        }
      }
    }
    else {
      this.all_dis_check = false;
      for (let k = 0; k < this.districts.length; k++) {
        for (let l = 0; l < this.districts[k]['district'].length; l++) {
          this.removeDistrictListData(this.districts[k]['district'][l]['district_name']);
        }
      }
    }
  }


  all_state_check: any = false;
  sel_all_state(e) {
    if (e.checked==true) {
      this.all_state_check = true;
      for (let i = 0; i < this.states.length; i++) {
          this.storestate(this.states[i]['state_name']);
             this.districtList(this.states[i]['state_name']);

      }
    }
    else {
      this.all_state_check = false;
      for (let k = 0; k < this.states.length; k++) {
          this.removeStateListData(this.states[k]['state_name']);
          this.removeDist(this.states[k]['state_name']);

      }
    }
  }


  getSelDistrict(stateinp, districtinput, e) {
    if (e) {
      this.storedistrict(stateinp, districtinput);
    } else {
      this.removeDistrictListData(districtinput);
    }
  }



  areaInfluencer: any = [];
  getAreaInfluencer() {
    setTimeout(() => {
      this.service.post_rqst({ 'user_type': this.bonusdetail_data.types, 'scheme_id': this.id, 'influencer_type': this.bonusdetail_data.influencer_type, 'state': this.form_statelist, 'district': this.form_districtlist }, 'Bonus/influencerList').subscribe((result) => {
        if (result['data']['statusCode'] == 200) {
          this.areaInfluencer = result['data']['this.decryptedData'];
          setTimeout(() => {
            this.compareArray();
          }, 300);
        }
        else {
          this.toast.errorToastr(result['data']['statusMsg']);
        }
      }, error => {
      })
    }, 5000);

  }


  allInfluncerData: any = [];
  compareArray() {

    for (let i = 0; i < this.areaInfluencer.length; i++) {
      for (let j = 0; j < this.runningScheme.length; j++) {
        if (parseInt(this.areaInfluencer[i]['id']) == parseInt(this.runningScheme[j]['id'])) {

          this.areaInfluencer[i]['selected'] = true;
          this.selInfluncer.push({ 'id': this.areaInfluencer[i]['id'] });


        }
        else {
          // this.areaInfluencer[i]['selected'] = false;
        }
      }

    }

    this.allInfluncerData.push(this.areaInfluencer);



  }


  selInfluncer: any = [];
  setInfluencer(e, id) {
    if (e.checked == true) {


      this.selInfluncer.push({ 'id': id });
    }
    else {
      let removeindex = this.areaInfluencer.findIndex(row => row.id == id);
      this.selInfluncer.splice(removeindex, 1);
    }


  }

  allInfluncer() {
    if (!this.data.Influencer) {
      this.selInfluncer = [];
      for (let i = 0; i < this.areaInfluencer.length; i++) {
        this.areaInfluencer[i].selected = false;
      }
    } else {
      this.selInfluncer = [];
      for (let i = 0; i < this.areaInfluencer.length; i++) {
        this.areaInfluencer[i].selected = true;
        this.selInfluncer.push({ 'id': this.areaInfluencer[i].id });

      }
    }


  }



  edit() {
    this.rout.navigate(['/bonus-edit/' + this.id]);
  }




  areaUpdate() {

    this.savingFlag = true;
    let productPoint = []
    for (let i = 0; i < this.pointCategories_data.length; i++) {
      const element = this.pointCategories_data[i];
      if (this.pointCategories_data[i]['id'] == this.newProdcut[0][i]['id']) {
        element.scheme_influencer_point = this.newProdcut[0][i]['scheme_influencer_point']
      }
      productPoint.push({ 'product_id': element.id, 'product_name': element.point_category_name, 'influencer_point': element.scheme_influencer_point })
    }

    const hasPositiveInfluencerPoint = productPoint.some(item => item.influencer_point > 0);

    if (!hasPositiveInfluencerPoint) {
      this.toast.errorToastr('All category points are zero. At least one should be greater than zero.');
      return
    }
    


    const uniqueState = this.form_statelist.filter((item, index, self) =>
      index === self.findIndex((t) => t.state_name === item.state_name)
    );

    this.data.state = uniqueState 

    const uniqueDistrict = this.form_districtlist.filter((item, index, self) =>
      index === self.findIndex((t) =>
        t.state_name === item.state_name && t.district_name === item.district_name
      )
    );
    this.data.district = uniqueDistrict;


    this.data.update_id = this.id;
    this.data.types = this.bonusdetail_data.types;

    this.data.tittle = this.bonusdetail_data.tittle;
    this.data.start_date = this.bonusdetail_data.start_date;
    this.data.end_date = this.bonusdetail_data.end_date;

    this.data.created_by_id = this.logined_user_data.id;
    this.data.created_by_name = this.logined_user_data.name;

    this.data.influencer_ids = this.selInfluncer;
    this.service.post_rqst({ 'scheme': this.data,'productPoint': productPoint,  'action': 'basic' }, 'Bonus/updateBonus').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.toast.successToastr(result['statusMsg']);
        this.savingFlag = false;
        if(this.all_state_check==true || this.all_dis_check==true){
          this.rout.navigate(['/bonus-list']);
        }
        else{
          this.bonus_detail();
          this.editTrue=false;

        }


      }
      else {
        this.toast.errorToastr(result['statusMsg']);
        this.savingFlag = false;
      }
    });
  }


  update(data, type): void {
    const dialogRef = this.dialog.open(BonusUpdateComponent, {
      width: '400',
      panelClass: 'cs-modal',
      data: {
        data: data,
        type: type,
      }

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.bonus_detail();
      }
    });
  }

  upload_excel(type, id, district, userType, influencerType) {
    const dialogRef = this.alrt.open(UploadFileModalComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      disableClose: true,
      data: {
        'from': 'Bonus',
        'modal_type': type,
        'district': district,
        'user_type': userType,
        'influencer_type': influencerType,
        'bonus_id': id

      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {
        this.bonus_detail();
      }

    });
  }



  pointCategory_data(status) {
    this.filter.point_type = status;
    this.service.post_rqst({ 'filter': this.filter } , 'Master/pointCategoryMasterList').subscribe((result) => {
      this.pointCategories_data = result['point_category_list'];
      this.compareNewArray();
    })
  }

  newProdcut: any = [];
  compareNewArray() {
    for (let i = 0; i < this.pointCategories_data.length; i++) {
      for (let j = 0; j < this.lastPageProduct.length; j++) {
        if (this.pointCategories_data[i]['id'] == this.lastPageProduct[j]['product_id']) {
          this.pointCategories_data[i]['scheme_influencer_point'] = this.lastPageProduct[j]['point'];
        }
      }
    }
    this.newProdcut.push(this.pointCategories_data);
  }

  editPointCategory(){
    this.editTrue=true
  }

}