import { PermissionStorage } from '../localStorage/local-storage.service';
import { ApiService } from '../api/api.service';
import { Injectable } from '@angular/core';
import { OUService } from './ou.service';
import { EsignStateSelector} from '../../esign/service/esign.state.selector';
@Injectable()
export class UserService {
    constructor(private stateselector: EsignStateSelector, private ouService: OUService) {
    }

    initLoginDetails(): Promise<any> {
        return this.ouService.getUserOU()
            .then(ouRes => {
                console.log('inside init log in details');
                console.log(ouRes);
                // remove deleted ou
                ouRes = ouRes.filter(x => x.userStatus !== 8);
                this.stateselector.setUserOrgs(ouRes);
                // this.localDb.setOrgUnit(JSON.stringify(ouRes));
                // init default org unit
                let defaultOrg = ouRes[0];
                console.log('default org');
                console.log(defaultOrg);
                this.stateselector.setOrgData(defaultOrg);
                // get last login
               // let lastLoginOUId = this.localDb.getLastLogin(this.localDb.getUserId());
               let lastLoginOUId = null;
              // if (this.stateselector.getCurrentOrg()) {
              //  lastLoginOUId = this.stateselector.getCurrentOrg().id;
              //  }

               if (lastLoginOUId) {
                    let lastLoginOrg = ouRes.filter(x => x.orgUnitId === lastLoginOUId)[0];
                    if (lastLoginOrg) {
                        defaultOrg = lastLoginOrg;
                    }
                }

                if (defaultOrg) {
                    // check for userStatus suspended
                    if (defaultOrg.userStatus === 2) {
                        // change to other active org
                        let activeOrgs = ouRes.filter(x => x.orgUnitId !== defaultOrg.orgUnitId && x.userStatus !== 2);
                        if (activeOrgs.length > 0) {
                            defaultOrg = activeOrgs[0];
                        }
                    }

                    return this.ouService.switchOU(defaultOrg.orgUnitId)
                        .then(p => {
                            // set root ou
                           // this.localDb.setRootOU(defaultOrg.rootOrgUnitId);
                           this.stateselector.setOrgData(defaultOrg);
                            return Promise.resolve(true);
                        }).catch(res => {
                            console.log(res);
                            return Promise.resolve(true);
                        });
                } else {
                    // no active org detected.
                    // create blank permission obj in storage
                    let permission: PermissionStorage = {
                        orgUnitId: null,
                        permission: {},
                        roleId: null,
                        roleName: 'N/A'
                    }
                  // this.localDb.setPermission(JSON.stringify(permission));
                   return Promise.resolve(true);
                }
            }).catch(res => {
                console.log(res);
                return Promise.reject(false);
            });
    }
}
