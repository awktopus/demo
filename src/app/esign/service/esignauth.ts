import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { EsignAuthService } from './esignauth.service';

@Injectable()
export class ESignGuard implements CanActivate {
    constructor(private router: Router, private service: EsignAuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log('ESign AuthGuard: isAuthenticated: ' + this.service.isEsignAuth());
        if (this.service.isEsignAuth()) {
            // logged in so return true
            return true;
        }
        else{
            const userId=this.service.getUserID()
            this.service.runESignAuth().subscribe(resp => {
                const obj: any = <any>resp;
                this.service.setESignToken(obj.esignAccessToken,userId);
                console.log(obj);
                setTimeout(() => this.router.navigate([state.url]));
            });
            return false;
        }
        // not logged in so redirect to login page with the return url
       
    }
}

