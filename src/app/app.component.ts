import { Component, HostListener, Renderer2, OnDestroy } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService'
import { AuthGuard } from './auth.guard';
import { sessionStorage } from './localstorage.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { Router } from '@angular/router';
import { ProgressService } from './progress.service';
import { CryptoService } from 'src/_services/CryptoService';
import { Subscription, timer, fromEvent, merge, of, } from 'rxjs';
import { map } from 'rxjs/operators';
import { DialogComponent } from './dialog.component';
// import
// import { LocalStorage } from './localstorage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  internetStatus: boolean = false;
  internetStatus$: Subscription = Subscription.EMPTY;

  login_data: any = {};
  decryptedData: any;
  private idleTimeoutSubscription: Subscription;
  // private idleTimeoutDuration = 60 * 60 * 1000; // 1 hour in milliseconds
  private idleTimeoutDuration = 24 * 60 * 60 * 1000;
  private userActive: boolean = false;



  constructor(public service: DatabaseService, public session: sessionStorage, public router: Router, public renderer: Renderer2, private bnIdle: BnNgIdleService, private progressService: ProgressService, public cryptoService: CryptoService, public dialog: DialogComponent,) {
    this.session.getSession()
      .subscribe(resp => {
        this.login_data = resp.data;
        if (resp.data != undefined) {
          if (this.login_data.project_login_code != 'eM|"A|}g9JFYLO360DAY6y2{O|BASIQzg~R)[GOib2') {
            this.session.LogOutSession();
            this.router.navigate(['']);
          }
        }

      });

    this.resetIdleTimer();
  }
  ngOnInit(): void {
    window.onload = (event) => {
      let value
      this.progressService.getDownloaderActive().subscribe(result => {
        value = result
      })
      if (value == false) {
        this.progressService.setCancelReq(true);
        this.service.cancelDownloading();
      }
      document.getElementById("splashScreen").classList.add("splashScreenFadeHide")
    }
    document.getElementById("splashScreen").addEventListener('transitionend', (e) => {
      document.getElementById("splashScreen").style.display = 'none'
    })

    // this.bnIdle.startWatching(this.service.resetTime).subscribe((isTimedOut: boolean) => {
    //   if (isTimedOut) {
    //     this.session.LogOutSession();
    //     this.router.navigate(['']);
    //     localStorage.removeItem('st_user');
    //   }
    // });
    this.checkInternetStatus();
  };


  @HostListener('document:keydown', ['$event'])
  handleGlobalKeydownEvent(event: KeyboardEvent) {
    this.resetIdleTimer();
  }

  @HostListener('document:mousemove', ['$event'])
  handleGlobalMousemoveEvent(event: MouseEvent) {
    this.resetIdleTimer();
  }

  @HostListener('document:click', ['$event'])
  handleGlobalClickEvent(event: MouseEvent) {
    this.resetIdleTimer();
  }

  resetIdleTimer() {
    if (this.idleTimeoutSubscription) {
      this.idleTimeoutSubscription.unsubscribe();
    }

    this.idleTimeoutSubscription = timer(this.idleTimeoutDuration).subscribe(() => {
      this.handleUserInactivity();
    });
  }

  handleUserInactivity() {
    console.log('User is inactive, logging out...');
    this.session.LogOutSession();
    this.router.navigate(['']);
    localStorage.removeItem('st_user');
  }

  ngOnDestroy() {
    if (this.idleTimeoutSubscription) {
      this.idleTimeoutSubscription.unsubscribe();
    }
    this.internetStatus$.unsubscribe();

  }


  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key.toLowerCase() === 'u' || event.ctrlKey && event.key.toLowerCase() === 'U') {
      event.preventDefault();
    }
  }

  checkInternetStatus() {
    this.internetStatus = navigator.onLine;
    this.internetStatus$ = merge(
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    )
      .pipe(map(() => navigator.onLine))
      .subscribe(status => {
        console.log('status', status);
        this.internetStatus = status;
        if (this.internetStatus == false) {
          this.dialog.error("Slow Internet Or May be You Are Offline.");
        }
      });



  }


}
