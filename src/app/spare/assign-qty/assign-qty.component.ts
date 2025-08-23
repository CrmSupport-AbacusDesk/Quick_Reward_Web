import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
@Component({
  selector: 'app-assign-qty',
  templateUrl: './assign-qty.component.html',
  styleUrls: ['./assign-qty.component.scss']
})
export class AssignQtyComponent implements OnInit {

  qtyList: any = [];
  model_type:any;
  spareIncomingList: any = [];
  spareOutgoingList: any = [];
  sparereturnList: any = [];
  technicianData:any={}
  formData:any={}
  engineerList: any = [];
  add_list: any = [];
  spareList: any = [];
  savingFlag:boolean = false;
  add_list2: any = [];
  spare_data: any = {};

  add_list3: any = [];
  returnData: any = {}
  row: any = {}
  max_qty: any = [];
  asgn_qty: any;
  engineer_list: any = [];
  showSavebtn: boolean = true;



  constructor(@Inject(MAT_DIALOG_DATA) public data,public service: DatabaseService,public rout: Router,public toast: ToastrManager,private route: ActivatedRoute,public dialog: DialogComponent,public dialog2: MatDialog,public dialogRef: MatDialogRef<AssignQtyComponent>) {
    this.qtyList=data.data

    this.model_type=data.type

    this.spareIncomingList=data.data

    this.spareOutgoingList=data.data

    this.sparereturnList=data.data
   }

   ngOnInit() {
    this.assign_engineerget('');
    this.getSparePartList('');
    this.assign_engineer('');
  }

  filter: any = {};
  assign_engineerget(searcValue) {
    this.filter.technician_detail = searcValue;
    this.service.post_rqst({ 'filter': this.filter, }, 'ServiceTask/plumberList').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.engineerList = resp.data;
      }
      else {
        this.toast.errorToastr(resp['statusMsg'])
      }
    }, error => {
    })
  }

  getCarpenterInfo(id)
  {
    if(id){
      let index= this.engineerList.findIndex(d=> d.id==id);
      if(index!=-1){
        this.technicianData.assign_to= this.engineerList[index].id;
        this.technicianData.assign_to_name= this.engineerList[index].name;
      }
    }
  }


  getSparePartList(search) {
    this.service.post_rqst({ 'search': search }, "ServiceSparePart/getSparePartName").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.spareList = result['result'];
      }
    }))
  }
  get_spare_detail(id) {
    if (id) {
      let index = this.spareList.findIndex(d => d.id == id);
      if (index != -1) {
        this.formData.part_id = this.spareList[index].id;
        this.formData.part_no = this.spareList[index].part_no;
        this.formData.part_name = this.spareList[index].part_name;
        this.formData.current_stock = this.spareList[index].current_stock;
      }
    }
  }

  max() {
    if (parseInt(this.formData.qty) > parseInt(this.formData.current_stock)) {
      this.toast.errorToastr('Qty Should Be Less Then Current Stock');
      this.formData.qty=0
    }
  }

  addSpare() {

    if (this.formData.qty == 0 || this.formData.qty == undefined || this.formData.qty == null || !this.formData.qty) {
      this.toast.errorToastr("QTY Should Be More Then Zero");
      return;
    }

    if (this.formData.id) {
      let index = this.spareList.findIndex(d => d.id == this.formData.id);
      if (index != -1) {
        this.formData.part_name = this.spareList[index].part_name;
        this.formData.part_no = this.spareList[index].part_no;
      }
    }
    if (this.formData.id) {
      let index = this.spareList.findIndex(d => d.id == this.formData.id);
      if (index != -1) {
        this.formData.category_name = this.spareList[index].category;
      }
    }
    if (this.add_list.length == 0) {
      this.add_list.push(JSON.parse(JSON.stringify(this.formData)))
      this.formData = {}
    }
    else {
      let isExistIndex: any;
      isExistIndex = this.add_list.findIndex(row => row.id == this.formData.id);
      if (isExistIndex == -1) {
        this.add_list.push(JSON.parse(JSON.stringify(this.formData)))
        this.formData = {}

      }
      else {
        this.add_list[isExistIndex].qty = parseInt(this.formData.qty)
        this.formData = {}

      }
    }
  }

  delete(i) {
    this.add_list.splice(i, 1)
  }


  assignStock() {
    this.technicianData = this.technicianData
    this.savingFlag = true;
    this.service.post_rqst({ "add_list": this.add_list,"data":this.technicianData }, "ServiceSparePart/submitAssignStock").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.dialogRef.close(true);
        this.toast.successToastr(result['statusMsg']);
        // this.dialog2.closeAll();
        setTimeout(() => {
          this.savingFlag = false;
        }, 700);
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }))
  }

  get_spare_detail2(id) {
    if (id) {
      let index = this.spareList.findIndex(d => d.id == id);
      if (index != -1) {
        this.spare_data.part_no = this.spareList[index].part_no;
        this.spare_data.part_name = this.spareList[index].part_name;
      }
    }
  }

  addSpare2() {

    if (this.spare_data.qty == 0 || this.spare_data.qty == undefined || this.spare_data.qty == null || !this.spare_data.qty) {
      this.toast.errorToastr("QTY Should Be More Then Zero");
      return;
    }
    if (this.spare_data.id) {
      let index = this.spareList.findIndex(d => d.id == this.spare_data.id);
      if (index != -1) {
        this.spare_data.part_name = this.spareList[index].part_name;
        this.spare_data.part_no = this.spareList[index].part_no;
      }
    }
    if (this.spare_data.id) {
      let index = this.spareList.findIndex(d => d.id == this.spare_data.id);
      if (index != -1) {
        this.spare_data.category_name = this.spareList[index].category;
      }
    }
    if (this.add_list2.length == 0) {
      this.add_list2.push(JSON.parse(JSON.stringify(this.spare_data)))
      this.spare_data = {}
    }
    else {
      let isExistIndex: any;
      isExistIndex = this.add_list2.findIndex(row => row.id == this.spare_data.id);
      if (isExistIndex == -1) {
        this.add_list2.push(JSON.parse(JSON.stringify(this.spare_data)))
        this.spare_data = {}

      }
      else {
        this.add_list2[isExistIndex].qty = parseInt(this.spare_data.qty)
        this.spare_data = {}

      }
    }
  }

  delete2(i) {
    this.add_list2.splice(i, 1)
  }


  manageStock() {
    this.savingFlag = true;
    this.service.post_rqst({ "add_list": this.add_list2 }, "ServiceSparePart/submitManageStock").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.dialogRef.close(true);
        this.toast.successToastr(result['statusMsg']);
        // this.dialog2.closeAll();
        setTimeout(() => {
          this.savingFlag = false;
        }, 700);
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }))

  }

  filter2: any = {};
  assign_engineer(searcValue) {
    this.filter2.technician_detail = searcValue;
    this.service.post_rqst({ 'filter': this.filter2, }, 'ServiceTask/plumberList').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.engineer_list = resp.data;
      }
      else {
        this.toast.errorToastr(resp['statusMsg'])
      }
    }, error => {
    })
  }

  getCarpenter(id) {
    if (id) {
      let index = this.engineer_list.findIndex(d => d.id == id);
      if (index != -1) {
        this.returnData.assign_to = this.engineer_list[index].id;
        this.getWarrantyDetail();
      }
    }
  }

  getWarrantyDetail() {
    this.service.post_rqst({ "data": this.returnData }, "ServiceSparePart/getAssignedParts").subscribe((result => {
      this.add_list3 = result['assign_part']
    }
    ));

  }
  maxReturn(qty,index,assign_qty) {
    if (parseInt(qty) > parseInt(assign_qty)) {
      this.toast.errorToastr('Qty Should Be Less Then Assign Qty');
      this.add_list3[index].qty=0
      this.showSavebtn=true
      return

    }


    if (qty==0 || qty=='' ||  qty==null){
      // console.log('in if');

      this.showSavebtn=true
    }
    else{
      // console.log('in else');

      this.showSavebtn=false

    }
  }


  submitReturn() {
  this.returnData = this.returnData
  this.savingFlag = true;
  this.service.post_rqst({ "add_list": this.add_list3,"data":this.returnData }, "ServiceSparePart/submitReturnStock").subscribe((result => {
    if (result['statusCode'] == 200) {
      this.dialogRef.close(true);
      this.toast.successToastr(result['statusMsg']);
      // this.dialog2.closeAll();
      setTimeout(() => {
        this.savingFlag = false;
      }, 700);
    }
    else {
      this.toast.errorToastr(result['statusMsg']);
    }
  }))
  }


}
