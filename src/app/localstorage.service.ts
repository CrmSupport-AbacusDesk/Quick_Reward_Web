import { Injectable, OnInit, Renderer2 } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService'
import { DialogComponent } from './dialog.component';


@Injectable({ providedIn: 'root' })
export class sessionStorage implements OnInit {
    loading = false;   
    alert:any;
    st_user: any = {};
    nexturl:any;
    constructor(private route: ActivatedRoute, private router: Router, public db: DatabaseService,public dialog:DialogComponent) {  
        
    }
    
    ngOnInit() {
        this.st_user.st_log = false;
    }
    
    getSession():Observable<any> {
        this.st_user = JSON.parse(localStorage.getItem('st_user')) || ''
        return of(this.st_user);
    }
    
    
    LogOutSession()
    { 
        this.st_user = {};
        this.st_user.st_log = false;
        this.db.can_active = '';
        localStorage.removeItem('st_user');   
        localStorage.clear()  
    }
    
 
}
