import { Injectable } from '@angular/core';
import { InactivityService } from './InactivityService';
import { Router } from '@angular/router';
import { DatabaseService } from './DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private inactivityService: InactivityService, public router: Router, public service:DatabaseService, public session:sessionStorage) {
    this.inactivityService.initializeLogout().subscribe((res) => {
       
        
      // Perform logout operation here
      this.logout();
    });
  }

  private logout(): void {
    this.session.LogOutSession();
    this.service.datauser = {};
    this.router.navigate(['']);

    // Your logout logic here (clear user session, redirect to login page, etc.)
  }
}