import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { CryptoService } from 'src/_services/CryptoService';



@Component({
  selector: 'app-customer-add',
  templateUrl: './customer-add.component.html',
  styleUrls: ['./customer-add.component.scss']
})
export class CustomerAddComponent implements OnInit {
  data: any = {};
  states:any =[];
  dr_type: any;
  district_list: any = [];
  savingFlag:boolean = false;
  params_id: any;
  getData:any ={};  
  id: any;
  exist:boolean=false;
  
  params_network:any;
  params_type:any;
  encryptedData: any;
  decryptedData:any;

  
  constructor(
    public service: DatabaseService,
    public cryptoService:CryptoService,
    public rout: Router,
    public location: Location,
    public route: ActivatedRoute,
    public toast:ToastrManager,
    public session: sessionStorage,
    private http: HttpClient
    ) {
      this.data.country = 'india';
      this.getStateList();
      this.route.params.subscribe(params => {
        this.id =  params.id;
        console.log(this.id);
        if (this.id) {
          this.getCustomerDetail(this.id);
        }
        
        
      });
    }
    
    ngOnInit() {
    }
    MobileNumber(event: any) {
      const pattern = /[0-9\+\-\ ]/;
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
      
    }
    getDistrict(val) {
      let st_name;
      if(val == 1)
      {
        st_name = this.data.state;
      }
    this.encryptedData = this.service.payLoad ? {'state_name':st_name}: this.cryptoService.encryptData({'state_name':st_name});

      this.service.post_rqst(this.encryptedData, "Influencer/getAllDistrict").subscribe((result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        
        if (this.decryptedData['statusCode'] == 200) {
          this.district_list = this.decryptedData['all_district'];
        }
        else{
          this.toast.errorToastr(this.decryptedData['statusMsg']);
        }
      }));
      
    }
    getStateList() {
      this.encryptedData = this.service.payLoad ? 0: this.cryptoService.encryptData(0);

      this.service.post_rqst(this.encryptedData, "Influencer/getAllState").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

        if (this.decryptedData['statusCode'] == 200) {
          this.states = this.decryptedData['all_state'];
        }
        else{
          this.toast.errorToastr(this.decryptedData['statusMsg']);
        }
      }));
    }
    
    submitDetail()
    {
      
      this.savingFlag = true;
      let header
      if(this.id){
        this.encryptedData = this.service.payLoad ? {"data":this.data,'type': 'Edit','id':this.id}: this.cryptoService.encryptData({"data":this.data,'type': 'Edit','id':this.id});
        header =this.service.post_rqst( this.encryptedData,"ServiceCustomer/serviceCustomerAdd") 
      }
      else
      {
        this.encryptedData = this.service.payLoad ? {"data":this.data,'type': 'Add',}: this.cryptoService.encryptData({"data":this.data,'type': 'Add',});
        header =this.service.post_rqst( this.encryptedData,"ServiceCustomer/serviceCustomerAdd") 
      }
      header.subscribe((result=>
        {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
          if (this.decryptedData['statusCode'] == 200) {
            
            this.rout.navigate(['/customer-list']);
            
            this.toast.successToastr(this.decryptedData['statusMsg']);
            this.savingFlag = false;
          }
          else{
            this.toast.errorToastr(this.decryptedData['statusMsg']);
            this.savingFlag = false;
          }
          
        }));
      }
      back(): void {
        this.location.back()
      }
      
      getCustomerDetail(id)
      {
        this.encryptedData = this.service.payLoad ? {'customer_id':id}: this.cryptoService.encryptData({'customer_id':id});
        this.service.post_rqst(this.encryptedData,"ServiceCustomer/serviceCustomerDetail").subscribe((result=>
          {
            this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
            this.getData = this.decryptedData['result'];
            this.data = this.getData;
            this.getDistrict(1)
          }
          ));
          
        }
        
        checkMobile() {      
          this.encryptedData = this.service.payLoad ? { 'customer_mobile':this.data.mobile_no }: this.cryptoService.encryptData({ 'customer_mobile':this.data.mobile_no });
          if (this.data.mobile_no.length == 10) {
            this.service.post_rqst(this.encryptedData,"ServiceTask/customerCheck").subscribe((result) => {
             this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
              if (this.decryptedData.statusMsg == "Exist") {
                this.toast.errorToastr("This Mobile No. is already exist!");
              }
            });
          }
        }
        
        
      }
      