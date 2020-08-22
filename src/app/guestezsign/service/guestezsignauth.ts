import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { GuestEZsignAuthService } from './guestezsign.service';

@Injectable()
export class GuestEzsignGuard implements CanActivate {
    constructor(private router: Router, private service: GuestEZsignAuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log('ESign AuthGuard: isAuthenticated: ' + this.service.isGuestEzsignAuth());
        if (this.service.isGuestEzsignAuth()) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.service.runGuestEzsignAuth(this.service.getGuestToken()).subscribe(resp => {
            const obj: any = <any>resp;
            console.log(obj);
            this.service.setEzsignGuestAuthToken(obj.guestELToolsAccessToken);
            console.log(obj);
            setTimeout(() => this.router.navigate([state.url]));
        });
        return false;
    }
}

