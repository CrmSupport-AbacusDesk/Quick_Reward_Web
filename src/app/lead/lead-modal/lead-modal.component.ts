import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-lead-modal',
  templateUrl: './lead-modal.component.html',
  styleUrls: ['./lead-modal.component.scss']
})
export class LeadModalComponent implements OnInit {
  encryptedData: any;
  decryptedData:any;
  templateTitle:any =[];
  templateMsg:any =[];
  loader:boolean = false;
  login_data:any ={}
  
  
  
  constructor(@Inject(MAT_DIALOG_DATA) public data, public cryptoService:CryptoService, public dialog: MatDialog, public session: sessionStorage, public service: DatabaseService, public toast: ToastrManager) {
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data = this.login_data.data;
    
  }
  
  ngOnInit() {
    this.getTemplate();
  }
  
  
  getTemplate() {
    this.service.post_rqst({}, "Enquiry/enquiryTemplateList").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      
      if (this.decryptedData['statusCode'] == 200) {
        this.templateTitle = this.decryptedData['result'];
        if(this.templateTitle.length > 0){
          this.getMsg(this.templateTitle[0]['title'],  this.templateTitle[0]['id'])
        }
      } 
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg'])
      }
    }
  )
}

getMsg(msg, id) {
  this.templateMsg =[];
  this.loader = true;
  this.templateTitle.forEach(item => item['active'] = (item['id'] === id) ? 'active' : '');
  this.encryptedData = this.service.payLoad ? { 'title': msg }: this.cryptoService.encryptData({ 'title': msg });
  this.service.post_rqst(this.encryptedData, "Enquiry/getTemplateDetail").subscribe((result) => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
    if (this.decryptedData['statusCode'] == 200) {
      this.loader = false;
      this.templateMsg = this.decryptedData['templates'];
    } 
    else {
      this.loader = false;
      this.toast.errorToastr(this.decryptedData['statusMsg'])
    }
  }
)
}



shareWhatsapp(msg: string) {
  const message = encodeURIComponent(
    `Dear ${this.data.customer_name}, \n\n${msg}\n\nThanks & Regards\n${this.login_data.name}`
  );
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${this.data.customer_mobile}&text=${message}`;
  window.open(whatsappUrl, '_blank');
}



sendEmail(sub: string, msg: string) {
  const body = encodeURIComponent(
    `Dear ${this.data.customer_name},\n\n${msg}\n\nThanks & Regards\n${this.login_data.name}`
  );
  
  const mailtoUrl = `mailto:${this.data.customer_email}?subject=${sub}&body=${body}`;
  
  window.open(mailtoUrl, '_blank');
}

}

