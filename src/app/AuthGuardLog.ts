import { Injectable } from '@angular/core';
import { Router, RouterModule, Routes, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { sessionStorage } from './localstorage.service';
import { DatabaseService } from 'src/_services/DatabaseService'



@Injectable()
export class AuthGuardLog implements CanActivate {

      users: any = [];
      constructor(private router: Router, public ses: sessionStorage, public db: DatabaseService) { }



      canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
            // this.ses.getSe().subscribe(
            //   data => {
            //    this.users = data;
            //    },
            //    error => {

            //       });


            // if (this.users.st_log) {
            //     if(state.url != '/')   {          
            //       //this.router.navigate([state.url]);
            //     }else{
            //       this.router.navigate(['/category']);

            //     }
            //     this.db.can_active = '1';
            //      return false;

            //  }else{
            //       this.db.can_active = '';
            return true;
            //  }

      }

}

