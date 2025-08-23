import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { DatabaseService } from 'src/_services/DatabaseService'
import { ElementSchemaRegistry } from '@angular/compiler';
import { sessionStorage } from './localstorage.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  pearluser: any = [];
  nexturl: any;
  constructor(public session: sessionStorage, public rout: Router, public db: DatabaseService, private route: ActivatedRoute,) {

  }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    this.session.getSession()
      .subscribe((response) => {
        this.pearluser = response;
      }, error => {
      });


    if (this.pearluser.st_log) {
      if (state.url != '/') {

      }
      else if (this.pearluser.data.user_type == 'DMS') {
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/distribution-list/1/Channel%20Partner/distribution-detail/' + this.pearluser.data['id'] + '/Profile';
        this.rout.navigate([this.nexturl]);
        return;
      }
      else if (this.pearluser.data.id != 1) {
        this.rout.navigate(['/dashboard']);

      }
      else {
        this.rout.navigate(['/dashboard']);
      }
      this.db.can_active = '1';
      return false;
    }
    else {
      this.db.can_active = '';
      return true;
    }
  }
}