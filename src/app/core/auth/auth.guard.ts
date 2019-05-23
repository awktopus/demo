import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { pocolog } from 'pocolog';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private auth: AuthService) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const isVerified: boolean = this.auth.isVerified();
        const isAuthenticated: boolean = this.auth.isAuthenticated();
        // logged in
        pocolog.trace('AuthGuard: isVerified: %s', isVerified);
        if (isVerified) {
            // email verified
            pocolog.trace('AuthGuard: isAuthenticated: %s', isAuthenticated);
            return true;

        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
