import { Component, OnInit } from '@angular/core';
import {  ViewEncapsulation, ElementRef, PipeTransform, Pipe, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { GuestEzsignService } from './service/guestezsign.service';

@Component({
  selector: 'app-guestezsign',
  templateUrl: './guestezsign.component.html',
  styleUrls: ['./guestezsign.component.scss']
})
export class GuestEzsignComponent implements OnInit {

  guestToken: any = null;
  tokenStatus: any = "" ;
  resendstatus = "N";
  constructor(private route: ActivatedRoute, private service: GuestEzsignService,
    private router: Router) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.guestToken =  encodeURIComponent(params['guestSecureToken']);
      console.log("run authentication on token");
      console.log(params['guestSecureToken']);
      this.service.auth.runGuestEzsignAuth(this.guestToken).subscribe(res => {
         const resp: any = res;
         console.log(resp);
         if (resp.statusCode === "200") {
            console.log("token is good routing to the doc signing page");
            this.tokenStatus = "valid";
            this.service.auth.setAuthData(resp);
            this.service.auth.setGuestToken(this.guestToken);
            this.service.auth.setEzsignGuestAuthToken(resp.guestELToolsAccessToken);
           // this.router.navigateByUrl("guestezsign/guestdoc");
         } else if ( resp.statusCode === "406") {
            console.log(" token is good but expired");
            this.tokenStatus = "expired";
         } else if (resp.statusCode === "404") {
            console.log(" token is good but document removed");
            this.tokenStatus = "notfound";
         } else {
            console.log(" token is invalid");
            this.tokenStatus = "invalid";
         }
      });
   });
  }

  resendLink() {
    console.log("resending url...");
    this.service.refreshGuestUrl(this.guestToken).subscribe(resp => {
        console.log(resp);
        console.log("resend done");
        this.resendstatus = "Y";
    });
  }
  goToGuestDoc () {
    console.log(" start signing");
    this.router.navigateByUrl("guestezsign/guestdoc");
  }
}
@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
