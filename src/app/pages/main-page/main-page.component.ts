import { AuthService } from './../../core/auth/auth.service';
import { AfterViewInit, Component, HostBinding, HostListener, OnInit } from '@angular/core';
import { ResizeService } from '../../resize/resize.service';
import { routerAnimation } from '../../utils/page.animation';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../core/localStorage/local-storage.service';
import { OUService } from '../../core/services/ou.service';
import { EsignAuthService } from '../../esign/service/esignauth.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  animations: [routerAnimation]
})

export class MainPageComponent implements OnInit, AfterViewInit {
  // Add router animation
  @HostBinding('@routerAnimation') routerAnimation = true;
  // Applying theme class
  @HostBinding('class.dark-theme') darkTheme = false;
  _sidenavMode = 'side';
  _boxedLayout = false;
  sideNavOpened = false;

  currentAuthData: any;
  displayName: string;
  userRole: any;
  isClient = false;
  isAccountingFirm = false;
  industryName: string;
  industryId: string;

  // tslint:disable-next-line:max-line-length
  constructor(public resizeService: ResizeService, private router: Router,
    private auth: AuthService, private localStorage: LocalStorageService,
    private ous: OUService, private esignauth: EsignAuthService) {
    this.onResize();
    this.esignauth.cur_org.subscribe(org => {
      if (org) {
        this.userRole = org.role;
        this.industryName = org.industryName;
        this.industryId = org.industryId;

        if (this.industryId === '10') {
          this.isAccountingFirm = true;
        } else {
          this.isAccountingFirm = false;
        }
        if (this.userRole === 'Client') {
          this.isClient = true;
        } else {
          this.isClient = false;
        }
      }
    });
  }

  ngOnInit() {
    this.getAuthData();
  }

  ngAfterViewInit(): void {
    // Resize after sidenav open on startup to draw charts correctly
    setTimeout(() => this.resizeService.resizeInformer$.next(), 500);
    setTimeout(() => this.sideNavOpened = true, 0);
  }

  logout(event) {
    event.preventDefault();
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  getAuthData() {
    this.currentAuthData = this.localStorage.getAuth();
    if (this.currentAuthData) {
      console.log(this.currentAuthData);
      this.displayName = this.currentAuthData.givenName ? this.currentAuthData.givenName : this.currentAuthData.userName;
    }
  }

  set sidenavMode(val) {
    this._sidenavMode = val;
    setTimeout(() => this.resizeService.resizeInformer$.next(), 500);
  }

  get sidenavMode() {
    return this._sidenavMode;
  }

  set boxedLayout(val) {
    this._boxedLayout = val;
    setTimeout(() => this.resizeService.resizeInformer$.next(), 500);
  }

  get boxedLayout() {
    return this._boxedLayout;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth <= 1280) {
      this.sideNavOpened = false;
      this._sidenavMode = 'over';
    }
  }
}
