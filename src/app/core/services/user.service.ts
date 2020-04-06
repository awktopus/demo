import { PermissionStorage } from '../localStorage/local-storage.service';
import { ApiService } from '../api/api.service';
import { Injectable } from '@angular/core';
import { OUService } from './ou.service';
import { EsignStateSelector} from '../../esign/service/esign.state.selector';
import { AbstractStateSelector } from '../states/abstract.state.selector';
@Injectable()
export class UserService {
    constructor(private stateselector: AbstractStateSelector, private ouService: OUService) {
    }

    initLoginDetails(): Promise<any> {
        return this.ouService.getUserOU()
            .then(ouRes => {
                // remove deleted ou
                ouRes = ouRes.filter(x => x.userStatus !== 8);
                console.log(ouRes);
               (<EsignStateSelector> this.stateselector).setOrgData(JSON.stringify(ouRes));
                // this.localDb.setOrgUnit(JSON.stringify(ouRes));
                // init default org unit
                let defaultOrg = ouRes[0];
                // get last login
               // let lastLoginOUId = this.localDb.getLastLogin(this.localDb.getUserId());
               let lastLoginOUId = this.stateselector.getCurrentOrg().id;
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
                           (<EsignStateSelector>this.stateselector).setOrgData(defaultOrg);
                            return Promise.resolve(true);
                        }).catch(res => {
                            console.log(res);
                            return Promise.resolve(false);
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
