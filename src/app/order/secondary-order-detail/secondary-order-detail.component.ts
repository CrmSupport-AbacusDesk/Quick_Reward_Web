import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';
import { Location } from '@angular/common'
import { ToastrManager } from 'ng6-toastr-notifications';
import { StatusModalComponent } from '../status-modal/status-modal.component';
import { CryptoService } from 'src/_services/CryptoService';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';



@Component({
  selector: 'app-secondary-order-detail',
  templateUrl: './secondary-order-detail.component.html'
})
export class SecondaryOrderDetailComponent implements OnInit {
  orderType: any = 'order';
  status: any;
  id: any;
  login_data: any = [];
  secondaryOrderDetail: any = [];
  distributorInfo: any = []
  order_logs: any = []
  item_details: any = []
  editqty: any = false;
  Order_Amount: any;
  img_url:any=''
  login_dr_id: any;
   logined_user_data: any = {};
   userData:any
  skLoading: boolean = false;
  
  
  constructor(public route: ActivatedRoute,  public cryptoService:CryptoService, public location: Location, public service: DatabaseService, public dialog: MatDialog, public session: sessionStorage, public dialogs: DialogComponent, public toast: ToastrManager) {
    this.login_data = this.session.getSession();
    this.img_url = this.service.uploadUrl + 'order_docs/';
    this.login_data = this.login_data.value.data;
       this.userData = JSON.parse(localStorage.getItem('st_user'));
        this.logined_user_data = this.userData['data'];
        console.log(this.logined_user_data, 'logined_user_data');
    if (this.login_data.access_level != '1') {
      this.login_dr_id = this.login_data.id;
    }
   
  }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params.id.replace(/_/g, '/')
      
      this.status = this.route.queryParams['_value']['status'];
      this.id = this.cryptoService.decryptId(id)
      console.log(this.id, 'id')
      this.service.currentUserID = this.cryptoService.decryptId(id);
      if(id){
        this.getSecondaryOrderDetails();
      }
    });
  }
  
  goToImage(image) {
    const dialogRef = this.dialog.open(ImageModuleComponent, {
        panelClass: 'Image-modal',
        data: {
            'image': image,
            'type': 'base64'
        }
    });
    dialogRef.afterClosed().subscribe(result => {
    });

}
  getSecondaryOrderDetails() {
    this.skLoading = true;
    this.service.post_rqst({'id':this.id}, "Order/secondaryOrderDetail")
    .subscribe((result => {
      if (result['statusCode'] == 200) {
        this.skLoading = false;
        this.secondaryOrderDetail = result['result']
        this.distributorInfo = result['result']['distributor_info']
        this.order_logs = result['result']['order_log']
        this.item_details = result['result']['item_info'];
        this.Order_Amount = Number(this.secondaryOrderDetail.order_total) + Number(this.secondaryOrderDetail.order_discount)
        
      } else {
        this.toast.errorToastr(result['statusMsg']);
        this.skLoading = false;
      }
    }))
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(StatusModalComponent, {
      width: '400px', data: {
        order_status: this.secondaryOrderDetail.order_status,
        order_id: this.id,
        from: 'Secondary_order',
        reason: ''
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      this.getSecondaryOrderDetails();
    });
  }
  edit_qty() {
    this.editqty = true;
  }
  deleteOrderitem(order_id, index) {
    this.dialogs.confirm("You want to delet this item !").then((result) => {
      if (result) {
        this.service.post_rqst({ 'id': order_id }, "Order/secondaryOrderDeleteItem")
        .subscribe((result => {
          if (result['statusCode'] == 200) {
            this.toast.successToastr(result['statuMsg']);
            this.item_details.splice(index, 1)
            this.getSecondaryOrderDetails();
          } else {
            this.toast.errorToastr(result['statuMsg'])
          }
          
        }))
      }
    })
  }
  Update_qty(id) {
    let index = this.item_details.findIndex(row => row.id == id)
    
    let cart_data = []
    let Amount = (this.item_details[index].qty * this.item_details[index].price)
    this.item_details[index].product_price = this.item_details[index].price
    this.item_details[index].discounted_price = this.item_details[index].discount_amount
    this.item_details[index].dr_disc = this.item_details[index].discount_percent
    this.item_details[index].total_amount = Amount;
    cart_data.push(this.item_details[index])
    this.service.post_rqst({ 'id': id, 'cart_data': cart_data }, "Order/secondaryOrderUpdateItem").subscribe((result => {
      result = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (result['statusCode'] == 200) {
        this.editqty = false;
        this.toast.successToastr('Quantity Updated Successfully');
      }
      else {
        this.editqty = false;
        this.toast.errorToastr(result['statusMsg']);
      }
    }))
  }
  back(): void {
    this.location.back()
  }
  
  exportPdf() {
    this.skLoading = true;
    let id = { 'id':this.id  }
    this.service.post_rqst(id, "Order/exportSecondaryOrderPdf").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.skLoading = false;
        window.open(this.service.uploadUrl + 'orderPdf/' + result['file_name']);
      } else {
        this.skLoading = false;
        this.toast.errorToastr(result['statusMsg'])
      }
    }
    , err => {
      this.skLoading = false;
      
    }
  )
}

}
