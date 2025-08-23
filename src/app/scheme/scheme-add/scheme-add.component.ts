import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Location } from '@angular/common';
import { CryptoService } from 'src/_services/CryptoService';
import { MatDialog } from '@angular/material';
import { SchemeModalComponent } from '../scheme-modal/scheme-modal.component';
import * as moment from 'moment';

@Component({
    selector: 'app-scheme-add',
    templateUrl: './scheme-add.component.html',
    styleUrls: ['./scheme-add.component.scss']
})
export class SchemeAddComponent implements OnInit {
    currentDate:any = new Date()
    encryptedData: any;
    decryptedData:any;
    paramData:any={};
    data:any ={genric:'All', customer_type:'Distributor'};
    scheme_slab:any={
                    scheme_type:'Product', 
                    subCategory:[], 
                    slab_item_arr:[], 
                    slab_type:'Range', 
                    point_type:'Fixed Points', 
                    both_type:'And', 
                    sub_criteria:'uom'
                  }
    imgUrl:any;
    stateList:any=[]
    categoryList:any=[]
    subCategoryList:any=[]
    productList:any=[]
    schemeStandardList:any=[]
    slabList:any=[]
    rewardList:any=[]
    uomList:any=['ltr', 'kg']
    isEditEnabled:boolean=false;
    paramsData:any;
    slabId:any;
    isAddNewSlab:boolean=false
    cartList:any=[]

    constructor(public navParam:ActivatedRoute, public router : Router, public dialog: MatDialog, public confirmDialog:DialogComponent, public service:DatabaseService, public cryptoService:CryptoService, public toast: ToastrManager, public location: Location) {
      this.paramsData = Object.assign({}, this.navParam['params']['_value'])

      if(this.paramsData.edit_type && (this.paramsData.edit_type=='primaryInfo'||this.paramsData.edit_type=='slabInfo')){
        this.isEditEnabled=true;
        this.fetchDetail()

        this.navParam.params.subscribe(params => {
          this.slabId = this.navParam.queryParams['_value']['slabId']
      })
      }

      if(this.paramsData.edit_type && (this.paramsData.edit_type=='addNewSlab')){
        this.isEditEnabled=true;
        
        this.navParam.params.subscribe(params => {
          this.slabId = this.navParam.queryParams['_value']['slabId']
      })

      if((this.isEditEnabled&&this.paramsData.edit_type=='addNewSlab')){
        this.isAddNewSlab=true;
      }

      }
      
      this.fetchData({}, "Scheme/getState", "stateList")
      this.fetchData({type:'scheme_standard'}, "Scheme/schemeOptionList", "schemeStandardList")
      this.fetchData({type:'criteria'}, "Scheme/schemeOptionList", "slabList")
      this.fetchData({type:'reward_type'}, "Scheme/schemeOptionList", "rewardList")
      this.fetchData({}, "Scheme/fetchCategory", "categoryList")
}

ngOnInit() {
    
}

reset(){
  this.confirmDialog.confirm("This action will reset this form").then((result) => {
    if(result){
      this.scheme_slab = {'slab_type':'Range', scheme_type:'Product', point_type:'Fixed Points'}
      this.subCategoryList=[]
      this.productList=[]
    }
  })
}

cartHandler(){
  this.itemHandler(this.categoryList, 'scheme_slab', 'categoryInp', 'category')
  this.itemHandler(this.subCategoryList, 'scheme_slab', 'subCategory', 'subCategory')

  console.log(this.scheme_slab)
  

    if(this.scheme_slab.slab_type=='Range'&&(this.scheme_slab.slab_end<this.scheme_slab.slab_start)){
      this.toast.errorToastr('End slab should be greater than start!');
      return;
    }

    // if(this.scheme_slab.scheme_type=='Category'){
    //   this.scheme_slab.slab_item_arr = this.scheme_slab.subCategoryInp;
    // }
    // this.cartList.push({...this.scheme_slab})
    this.cartList.push(JSON.parse(JSON.stringify(this.scheme_slab)))
    if (!this.isAddNewSlab) {
      this.toast.successToastr('New Slab Added!');
    }

    this.scheme_slab.slab_start = ''
    this.scheme_slab.slab_end = ''
    this.scheme_slab.reward_type = ''
    this.scheme_slab.both_type = ''
    this.scheme_slab.gift_name = ''
    this.scheme_slab.point_type = ''
    this.scheme_slab.point = ''

    this.scheme_slab = {...this.scheme_slab, 
                        point_type:'Fixed Points', 
                        both_type:'And', 
                        sub_criteria:'uom'
                      }
}

dateHandler(){
  if(this.data.start_date){
    this.data.start_date = moment(this.data.start_date).format('YYYY-MM-DD');
  }
  if(this.data.end_date){
    this.data.end_date = moment(this.data.end_date).format('YYYY-MM-DD');
  }
}
updateHandler(){
  this.dateHandler()
  const submission = () => {
    this.encryptedData = this.service.payLoad ? {data:this.data}: this.cryptoService.encryptData({data:this.data});
    this.service.post_rqst(this.encryptedData,'Scheme/updateScheme').subscribe((result)=>
    {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if(this.decryptedData['statusCode'] == 200){
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.back()
      }
      else{
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    })
  }

  this.convertImageUrlToBase64(this.data.image)
      .then(base64String => {
        // output.textContent = base64String;
        console.log(base64String)
        this.data.image = base64String
        submission()
      })
      .catch(error => {
        console.error('Error converting image:', error);
        alert('Failed to convert image to Base64.');
      });
}

updateNewSlabHandler(){
  let payload = {id:this.paramsData.id, ...this.data, scheme_slab:this.cartList}
  console.log(payload)
  
  this.encryptedData = this.service.payLoad ? {data:payload}: this.cryptoService.encryptData({data:payload});
  this.service.post_rqst(this.encryptedData,'Scheme/addSchemeSlabs').subscribe((result)=>
  {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
    if(this.decryptedData['statusCode'] == 200){
      this.toast.successToastr(this.decryptedData['statusMsg']);
      this.back()
    }
    else{
      this.toast.errorToastr(this.decryptedData['statusMsg']);
    }
  })
}

updateSlabHandler(){
  console.log(this.scheme_slab)
  
  this.encryptedData = this.service.payLoad ? {data:this.scheme_slab}: this.cryptoService.encryptData({data:this.data});
  this.service.post_rqst(this.encryptedData,'Scheme/updateSchemeSlabs').subscribe((result)=>
  {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
    if(this.decryptedData['statusCode'] == 200){
      this.toast.successToastr(this.decryptedData['statusMsg']);
      this.back()
    }
    else{
      this.toast.errorToastr(this.decryptedData['statusMsg']);
    }
  })
}

schemeStandardHandler(){
  if((this.scheme_slab.scheme_type=='Product'&&!this.scheme_slab.slab_item_arr.length)||(this.scheme_slab.scheme_type=='Category'&&!this.scheme_slab.subCategoryInp.length)){
    let msg = this.scheme_slab.scheme_type=='Product'?'Product':'Sub Category'
    this.toast.errorToastr('Select '+msg+' first!');
    this.scheme_slab.scheme_standard={};
    return;
  } 

  if(this.scheme_slab.scheme_standard=='Over All Each'||this.scheme_slab.scheme_standard=='Each'){
    this.openDialog('eachPoints', this.scheme_slab.slab_item_arr)
  }

  if(this.scheme_slab.scheme_standard=='Flat'){
    this.scheme_slab.criteria = 'Volume';
    this.scheme_slab.point_type='UOM Fixed';
    this.scheme_slab.slab_type=''
  }else{
    this.scheme_slab.point_type='Fixed Points'
  }
}

formHandler(){
  (this.isEditEnabled)? (
    this.paramsData.edit_type=='primaryInfo'?this.updateHandler():
    this.paramsData.edit_type=='slabInfo'?this.updateSlabHandler():
    this.paramsData.edit_type=='addNewSlab'?this.updateNewSlabHandler():null
  ):
  this.submitDetailHandler()
}

submitDetailHandler(){
let payload = {...this.data, scheme_slab:this.cartList}
  console.log(payload)
  this.dateHandler()
  this.encryptedData = this.service.payLoad ? {data:payload}: this.cryptoService.encryptData({data:payload});
  this.service.post_rqst(this.encryptedData,'Scheme/SubmitScheme').subscribe((result)=>
  {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
    if(this.decryptedData['statusCode'] == 200){
      this.toast.successToastr(this.decryptedData['statusMsg']);
      this.back()
    }
    else{
      this.toast.errorToastr(this.decryptedData['statusMsg']);
    }
  })
}

back(): void {
  this.location.back()
}

uploadImageHandler(data:any){
      let files = data.target.files[0];
      if (files) 
      {
        let reader = new FileReader();
        reader.onload = (e: any) => {this.data.image = e.target.result;}
        reader.readAsDataURL(files);
      }
}

convertImageUrlToBase64(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // This is important for cross-origin images
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height);
      // Convert canvas to Base64 string
      resolve(canvas.toDataURL()); // You can specify the image format here
    };
    img.onerror = () => {
      reject(new Error('Could not load image.'));
    };
    img.src = url;
  });
}

selectAllOption(isAllSelected:boolean, dataList:any, mainObj:any, setValueTo:string) {
    setTimeout(() => {
      if (isAllSelected) {
        let allSelectedList = [];
        for (let i = 0; i < dataList.length; i++) {
          setValueTo=='state_name'?allSelectedList.push(dataList[i]['state_name']):
          setValueTo=='categoryInp'?allSelectedList.push(dataList[i]['id']):
          setValueTo=='subCategoryInp'?allSelectedList.push(dataList[i]['id']):
          setValueTo=='products'?allSelectedList.push(dataList[i]['id']):null
        }

        this[mainObj][setValueTo] = allSelectedList;

        (setValueTo=='categoryInp')?
        this.fetchData({'catArr':this.scheme_slab.categoryInp}, 'Scheme/fetchSubCategory', 'subCategoryList'):null;

        
        (setValueTo=='subCategoryInp'&&this.scheme_slab.scheme_type=='Product')?
        this.fetchData({'catArr':this.scheme_slab.categoryInp, 'subCatArr':this.scheme_slab.subCategoryInp}, 'Scheme/fetchProduct', 'productList'):null
        
        setValueTo=='products'?
        this.itemHandler(this.productList, 'scheme_slab', 'products', 'slab_item_arr'):null;

        (setValueTo=='subCategoryInp'&&this.scheme_slab.scheme_type=='Category')?
        this.itemHandler(this.subCategoryList, 'scheme_slab', 'subCategoryInp', 'slab_item_arr'):null;

      } else {
        this[mainObj][setValueTo]=[];
        setValueTo=='categoryInp'?
        ( this.subCategoryList=[], this.scheme_slab.subCategoryInp=[], 
          this.scheme_slab.scheme_type=='Product'?(this.scheme_slab.products=[], this.productList=[]):null,
          this.scheme_slab.slab_item_arr=[]
        ):null;

        setValueTo=='subCategoryInp'?
        ( this.productList=[], 
          this.scheme_slab.scheme_type=='Product'?this.scheme_slab.products=[]:null,
          this.scheme_slab.slab_item_arr=[]
        ):null;

        setValueTo=='products'?
        (
          this.scheme_slab.slab_item_arr=[]
        ):null;
      }
    }, 100);
}

openDialog(type, data:any=[], isViewOnly:boolean=false): void {
  // let data = this.scheme_slab.scheme_type=='Product'?this.scheme_slab.slab_item_arr:this.scheme_slab.subCategoryInp
  // let data = this.scheme_slab.slab_item_arr
  const dialogRef = this.dialog.open(SchemeModalComponent, {
    width: '400px',
    panelClass: 'cs-model',
    data: {
      formData:data,
      otherData:this.scheme_slab,
      type:type,
      isViewOnly
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      console.log('dialog closed')
      console.log(result)
      this.scheme_slab.slab_item_arr = result.formData;
    }
  });
}

fetchDetail() {
  this.encryptedData = this.service.payLoad ? {'id':this.paramsData.id}: this.cryptoService.encryptData({'id':this.paramsData.id});
  this.service.post_rqst(this.encryptedData, 'Scheme/SchemeDetails').subscribe((result) => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
   
    if (this.decryptedData['statusCode'] == 200) {
     this.data = this.decryptedData['result']
     this.data.image = this.service.uploadUrl+"schemeBanners/"+this.data.image
     if(this.slabId){
       this.scheme_slab = this.data.scheme_slab.filter((row)=>row.id==this.slabId)[0]
       this.scheme_slab.slab_item_arr = this.scheme_slab.scheme_item_list;
     }else{
      this.scheme_slab = this.data.scheme_slab
      this.cartList = this.scheme_slab
     }
    }
    else {
      this.toast.errorToastr(this.decryptedData['statusMsg'])
    }
  }
  )
}

fetchData(payload:any, api:string, list:string) {
  this.encryptedData = this.service.payLoad ? payload: this.cryptoService.encryptData(payload);
  this.service.post_rqst(this.encryptedData, api).subscribe((result) => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
   
    if (this.decryptedData['statusCode'] == 200) {
     this[list] = this.decryptedData['result']
    }
    else {
      this.toast.errorToastr(this.decryptedData['statusMsg'])
    }
  }
  )
}

searchItems(event, type) {
  let item = event.target.value.toLowerCase();
  switch (type){
    case "state":
      this.fetchData({'search':item}, "Scheme/getState", "stateList")
    break;
    case "category":
      this.fetchData({'search':item}, "Scheme/fetchCategory", "categoryList")
    break;
    case "subCategory":
      this.fetchData({'catArr':this.scheme_slab.categoryInp, 'search':item}, 'Scheme/fetchSubCategory', 'subCategoryList');
    break;
    case "product":
      this.fetchData({'catArr':this.scheme_slab.categoryInp, 'subCatArr':this.scheme_slab.subCategoryInp, 'search':item}, 'Scheme/fetchProduct', 'productList')
    break;
  }
}

categoryHandler(){
  (this.categoryList.length != this.scheme_slab.categoryInp.length)?this.scheme_slab.allCategory=false:
  (this.categoryList.length == this.scheme_slab.categoryInp.length)?this.scheme_slab.allCategory=true:null;

  // let catId = this.scheme_slab.category.map((row)=>row.item_id);
  (this.scheme_slab.categoryInp.length)?
  this.fetchData({'catArr': this.scheme_slab.categoryInp}, 'Scheme/fetchSubCategory', 'subCategoryList'):null;
  !this.scheme_slab.categoryInp.length?this.scheme_slab.allCategoryInp=false:null
}

subCategoryHandler(){
  (this.subCategoryList.length != this.scheme_slab.subCategoryInp.length)?this.scheme_slab.allSubCategory=false:
  (this.subCategoryList.length == this.scheme_slab.subCategoryInp.length)?this.scheme_slab.allSubCategory=true:null;
  // let catId = this.scheme_slab.category.map((row)=>row.item_id);
  // let subCatId = this.scheme_slab.subCategoryInp.map((row)=>row.item_id);
  if(this.scheme_slab.scheme_type=='Product'){
    this.fetchData({'catArr':this.scheme_slab.categoryInp, 'subCatArr':this.scheme_slab.subCategoryInp}, 'Scheme/fetchProduct', 'productList')
  }
  if(this.scheme_slab.scheme_type=='Category'){
    this.itemHandler(this.subCategoryList, 'scheme_slab', 'subCategoryInp', 'slab_item_arr')
  }
}

itemHandler(dataList:any, mainObj:string, valueFrom:string, setValueTo:string){
  if(!this[mainObj][valueFrom]) return;

  let iteration = this[mainObj][valueFrom]
  this[mainObj][setValueTo] = []
  
  for (let index = 0; index < iteration.length; index++) {
    let isIndex = dataList.findIndex(row=>row.id==iteration[index])
    if(isIndex!=-1){
      let payload = {}
      if(setValueTo=='category'){
        payload = {
          'item_id':dataList[isIndex].id, 
          'item_name':dataList[isIndex].category
        }
      }

      if(setValueTo=='subCategory'){
        payload = {
          'item_id':dataList[isIndex].id, 
          'item_name':dataList[isIndex].sub_category_name
        }
      }
      if(setValueTo=='slab_item_arr'){
        payload = {
          'item_id':dataList[isIndex].id,
          'item_name': valueFrom=='products'?dataList[isIndex].product_name:valueFrom=='subCategoryInp'?dataList[isIndex].sub_category_name:null,
          'uom':dataList[isIndex].uom
        }
      }

      this[mainObj][setValueTo].push(payload)
      console.log(this[mainObj][setValueTo])
    }
  }
}

deleteDialog(type, i:any=0) {
  this.confirmDialog.confirm("Are you sure ?").then((result) => {
    if (result) {
      switch(type){
        case "allItem":
          if(this.scheme_slab.scheme_type=='Product'){
          this.scheme_slab.allProduct=false;
          this.selectAllOption(this.scheme_slab.allProduct, this.productList, 'scheme_slab', 'products')
          }else if(this.scheme_slab.scheme_type=='Category'){
            this.scheme_slab.allSubCategory=false;
            this.selectAllOption(this.scheme_slab.allSubCategory, this.subCategoryList, 'scheme_slab', 'subCategoryInp')
          }
        break;
        case "item":
          if(this.scheme_slab.scheme_type=='Product'){
            this.scheme_slab.allProduct=false;
            this.scheme_slab.slab_item_arr = this.scheme_slab.slab_item_arr.toSpliced(i, 1)
            this.scheme_slab.products = this.scheme_slab.products.toSpliced(i, 1)
          }else if(this.scheme_slab.scheme_type=='Category'){
            this.scheme_slab.allSubCategory=false;
            this.scheme_slab.slab_item_arr = this.scheme_slab.slab_item_arr.toSpliced(i, 1)
            this.scheme_slab.subCategoryInp = this.scheme_slab.subCategoryInp.toSpliced(i, 1)
          }
        break;
        case "cartItem":
          this.cartList = this.cartList.toSpliced(i, 1)
        break;
        default:
          console.log('default');
      }
    }
  })
}

}