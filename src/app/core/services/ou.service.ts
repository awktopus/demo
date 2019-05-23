import { LocalStorageService } from './../localStorage/local-storage.service';
import { ApiService } from './../api/api.service';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class OUService {
    constructor(private api: ApiService, private localDb: LocalStorageService, private authService: AuthService) {
    }

    getUserOU(): Promise<any> {
        return this.api.getAysnc<any>('v2/ou/current', null, this.getSelectedOU())
            .then(data => {
                const res: any[] = [];
                if (data) {
                    data.forEach(element => {
                        res.push(element);
                    });
                }
                return Promise.resolve(res);
            }).catch(res => {
                this.api.handleError(res);
                return Promise.reject(res.error);
            });
    }

    getSelectedOU() {
        return this.localDb.getCurrentOU();
    }

    switchOU(ouId): Promise<boolean> {
        const existing = this.localDb.getCurrentOU();
        if (existing !== ouId) {
            this.localDb.setCurrentOU(ouId);
            // this.OnOuSwitched.next(ouId);

            let permission = this.localDb.getPermissions();

            if (permission === null || permission.orgUnitId !== ouId) {
                // get permission
                return this.authService.getPermission(ouId)
                    .then(res => {
                        this.localDb.setPermission(JSON.stringify(res));
                        return Promise.resolve(true);
                    })
                    .catch(res => {
                        console.log(res);
                        return Promise.reject(false);
                    });
            }
        } else {
            return Promise.reject(false);
        }
    }

    getCurrentOU(): Promise<any> {
        return this.getOU(this.localDb.getCurrentOU());
    }

    getOU(ouId: string): Promise<any> {
        return this.api.getAysnc('v2/ou/' + ouId, null, this.getSelectedOU());
    }

    getIndustry(): Promise<any> {
        return this.api.getAysnc<any>('v2/ou/industry')
            .then(data => {
                return Promise.resolve(data);
            }).catch(res => {
                this.api.handleError(res);
                return Promise.reject(res.error);
            });
    }
}
