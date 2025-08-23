import { Component, OnInit, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-scheme-modal',
  templateUrl: './scheme-modal.component.html',
  styleUrls:['./scheme-modal.component.scss']
})
export class SchemeModalComponent implements OnInit {
  pointList:any=[]

  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<SchemeModalComponent>, public serve: DatabaseService,public location: Location,public navparams: ActivatedRoute, public router: Router, private route: ActivatedRoute,public toast: ToastrManager) { 
    console.log(data)
  }
  
  ngOnInit() {

  }

  submitData(){
    this.dialogRef.close(this.data);
  }


}
