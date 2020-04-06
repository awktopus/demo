import { OUService } from './../../services/ou.service';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { EsignStateSelector } from '../../../esign/service/esign.state.selector';
import { AuthService } from '../../auth/auth.service';
import { pocolog } from 'pocolog';
<<<<<<< HEAD
import { EsignAuthService } from '../../../esign/service/esignauth.service';
=======
import { AbstractStateSelector } from '../../states/abstract.state.selector';
>>>>>>> 3814fd6bd26c02608ff3efc41c794244f5aba9d7

@Component({
    selector: 'ui-current-ou',
    templateUrl: './current-ou.component.html',
    styleUrls: ['./current-ou.component.scss']
})
export class CurrentOUComponent implements OnInit {
    orgUnits: any[] = [];
    currentOU: any;
    currentOUId: string;
    oldOUId: string;

    // group orgs
    orgMyOrgs: any[] = [];
    orgPartners: any[] = [];
    orgClients: any[] = [];

    constructor(private ou: OUService, private router: Router,
        public dialog: MatDialog, public snackBar: MatSnackBar,
<<<<<<< HEAD
        private esignstate: EsignStateSelector,
        private authService: AuthService, private esignauth: EsignAuthService) {
=======
        private esignstate: AbstractStateSelector,
        private authService: AuthService) {
>>>>>>> 3814fd6bd26c02608ff3efc41c794244f5aba9d7
    }

    ngOnInit() {
        this.ou.getUserOU()
            .then(data => {
                // remove deleted ou
                data = data.filter(x => x.userStatus !== 8);
                // this.localStorage.setOrgUnit(JSON.stringify(data));
                (<EsignStateSelector>this.esignstate).setUserOrgs(data);
                this.render(data);
            });
    }

    private render(data: any[]) {

        // remove org with deleted flag
        data = data.filter(o => o.entityStatus !== 9);

        if (data && data.length >= 1) {
            this.orgUnits = data.sort((a, b) => {
                if (a.name < b.name) { return -1; }
                if (a.name > b.name) { return 1; }
                return 0;
            });

            // select current ou
            const selectedOU = data.filter(o => o.orgUnitId === this.ou.getSelectedOU())[0];
            let existingCurrentOU;
            if (selectedOU) {
                existingCurrentOU = selectedOU.orgUnitId;
                console.log('existingCurrentOU: ' + existingCurrentOU);
            } else {
                // cannot select ou, ou could be deleted
                console.log('no existingCurrentOU');
            }

            if (existingCurrentOU) {
                const index = data.findIndex(ou => ou.orgUnitId === existingCurrentOU);
                this.currentOU = index !== -1 ? data[index] : data[0];
                this.currentOUId = this.currentOU.orgUnitId;
                this.oldOUId = this.currentOUId;
                // this.localStorage.setRootOU(this.currentOU.rootOrgUnitId);
                console.log('currentOUId: ' + this.currentOUId);
                (<EsignStateSelector>this.esignstate).setOrgData(this.currentOU);
                // update permissions
                this.authService.getPermission(this.currentOUId)
                    .then(res => {
                     //   this.localStorage.setPermission(JSON.stringify(res));
                    })
                    .catch(res => {
                        pocolog.error(res);
                    });
            } else {
                this.currentOU = data[0];
                this.currentOUId = this.currentOU.orgUnitId;
                this.oldOUId = this.currentOUId;
              //  this.localStorage.setRootOU(this.currentOU.rootOrgUnitId);
              (<EsignStateSelector>this.esignstate).setOrgData(this.currentOU);
                console.log('currentOUId: ' + this.currentOUId);
                this.ou.switchOU(this.currentOUId)
                    .then(res => {
                       // this.localStorage.setRootOU(this.currentOU.rootOrgUnitId);
                        this.esignauth.updateOrg(this.currentOU);
                        window.location.reload();
                    });
            }

            // group org into role groups
            this.orgUnits.forEach((org) => {
                if (org.userRole.name === 'Partner') {
                    this.orgPartners.push(org);
                } else if (org.userRole.name === 'Client') {
                    this.orgClients.push(org);
                } else {
                    this.orgMyOrgs.push(org);
                }
            });

            // esign code
          //  this.esignauth.updateOrg(this.currentOU);
          (<EsignStateSelector>this.esignstate).setOrgData(this.currentOU);
        } else {
            this.openSnackBar('There is no organization associated to this account', 'OK');
        }
    }

    switch(newValue) {
        if (newValue === 'new') {
            return this.oldOUId;
        } else {
            const newCurrentOUIndex = this.orgUnits.findIndex(ou => ou.orgUnitId === newValue);
            if (newCurrentOUIndex !== -1) {
                this.currentOU = this.orgUnits[newCurrentOUIndex];
                console.log('inside switch org');
                console.log(this.currentOU);
                this.ou.switchOU(this.currentOU.orgUnitId)
                    .then(res => {
                      //  this.localStorage.setRootOU(this.currentOU.rootOrgUnitId);
                      //  window.location.href = '/';
                        this.esignauth.updateOrg(this.currentOU);
                        (<EsignStateSelector>this.esignstate).setOrgData(this.currentOU);
                        return newValue;
                    });
            }
            // full reload
        }
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 3000,
        });
    }
}
