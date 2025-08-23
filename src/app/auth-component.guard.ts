import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { sessionStorage } from './localstorage.service';
import { DatabaseService } from 'src/_services/DatabaseService'


@Injectable({
  providedIn: 'root'
})
export class AuthComponentGuard implements CanActivate {
  constructor(public session:sessionStorage,public db:DatabaseService,public router:Router){
    // this.count_data()
  }
  abq_user:any=[];
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean 
  {
    const expectedRole = next.data.expectedRole || [];
    
    
    
    this.session.getSession()
    .subscribe(resp=>{
      this.abq_user=resp;
    },error=>{
    });
    
    
    if(this.abq_user.st_log && ( !expectedRole.length  || expectedRole.indexOf( this.abq_user.data.access_level ) > -1 ))
    {
      this.db.can_active="1";
      localStorage.setItem('login',JSON.stringify(this.abq_user));
      return true;
    }
    else
    {
      this.db.can_active = '';
      this.router.navigate([''], { queryParams: { returnUrl: state.url }});
      return false;
    }
    
  }
count:any;
 
}
