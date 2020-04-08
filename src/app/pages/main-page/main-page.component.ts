import { AuthService } from './../../core/auth/auth.service';
import { AfterViewInit, Component, HostBinding, HostListener, OnInit } from '@angular/core';
import { ResizeService } from '../../resize/resize.service';
import { routerAnimation } from '../../utils/page.animation';
import { Router } from '@angular/router';
import { OUService } from '../../core/services/ou.service';
import { EsignAuthService } from '../../esign/service/esignauth.service';
import { EsignStateSelector} from '../../esign/service/esign.state.selector';
import { AbstractStateSelector } from '../../core/states/abstract.state.selector';
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
  isIETfunctionAccessible = false;
isAdmin = false;
  // tslint:disable-next-line:max-line-length
  constructor(public resizeService: ResizeService, private router: Router,
    private auth: AuthService, private stateselector: AbstractStateSelector,
    private ous: OUService, private esignauth: EsignAuthService) {
    this.onResize();

 // 040420 - Menu PubSub refactoring - start
    this.esignauth.cur_org.subscribe(org => {
      if (org) {
        this.userRole = org.role;
        this.industryName = org.industryName;
        this.industryId = org.industryId;
        console.log('inside main page org:');
        console.log(org);
        console.log(org.userRole.normalizedName);
        // if (this.industryId.toUpperCase() === 'ACCOUNT'
        //               && org.userRole.normalizedName !== 'PARTNER'
        //               && this.industryId.toUpperCase() !== 'PERSONAL') {
        //   this.isAccountingFirm = true;
        //   this.isIETfunctionAccessible = true;
        // } else {
        //   this.isAccountingFirm = false;
        //   this.isIETfunctionAccessible = false;
        // }

        if (this.industryId.toUpperCase() === 'ACCOUNT') {
          this.isAccountingFirm = true;
        } else {
          this.isAccountingFirm = false;
        }

        if (this.industryId.toUpperCase() !== 'PERSONAL') {
          this.isIETfunctionAccessible = true;
        } else {
          this.isIETfunctionAccessible = false;
        }

        if (org.userRole.normalizedName.toUpperCase() === 'CLIENT') {
          this.isClient = true;
        } else {
          this.isClient = false;
        }

        if (org.userRole.normalizedName.toUpperCase() === 'ADMIN' ||
              org.userRole.normalizedName.toUpperCase() === 'OWNER') {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        }
      }
    });
     // 040420 - Menu PubSub refactoring - end
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
    this.currentAuthData = this.stateselector.getAuthData();
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
