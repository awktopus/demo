import { Injectable } from '@angular/core';
import { pocolog } from 'pocolog';
import { Permission } from '../enum/permissions.enum';
import { Subject } from 'rxjs';

@Injectable()
export class LocalStorageService {
    private AUTH_KEY = 'Auth-Data';
    private CURRENT_OU_KEY = 'CurrentOU-Data';
    private ROOT_OU_KEY = 'RootOU-Data';
    private USER_OU_KEY = 'UserOU-Data';
    private PERMISSION_KEY = 'Permissions';
    private LAST_LOGIN_KEY = 'LastLogin-Data';

    public onOUChanged: Subject<void> = new Subject<void>();
    public onPermissionChanged: Subject<Permission> = new Subject<Permission>();

    setAuth(token: any) {
        localStorage.setItem(this.AUTH_KEY, JSON.stringify(token));
    }

    updateAuth(givenName: string) {
        // update name
        let auth = this.getAuth();
        auth.givenName = givenName;
        this.setAuth(auth);
    }
    removeAuth() {
        localStorage.removeItem(this.AUTH_KEY);
    }

    getAuth() {
        const res = localStorage.getItem(this.AUTH_KEY);
        if (res) {
            return JSON.parse(res);
        } else {
            return null;
        }
    }
    setRootOU(ouId: string) {
        localStorage.setItem(this.ROOT_OU_KEY, JSON.stringify(ouId));
    }

    /** Get Root OU ID from cache */
    getRootOU(): string {
        const res = localStorage.getItem(this.ROOT_OU_KEY);
        if (res) {
            return JSON.parse(res);
        } else {
            return null;
        }
    }

    getUserId() {
        if (this.getAuth()) {
            return this.getAuth().id;
        } else {
            return null
        }
    }

    setCurrentOU(ouId: string) {
        localStorage.setItem(this.CURRENT_OU_KEY, JSON.stringify(ouId));

        // set last login
        let userId = this.getUserId();
        if (userId) {
            this.setLastLogin(userId, ouId);
        }
    }

    removeCurrentOU() {
        localStorage.removeItem(this.CURRENT_OU_KEY);
    }

    getCurrentOU() {
        const res = localStorage.getItem(this.CURRENT_OU_KEY);
        if (res) {
            return JSON.parse(res);
        } else {
            return null;
        }
    }

    getOrgUnit() {
        const res = localStorage.getItem(this.USER_OU_KEY);
        if (res) {
            return JSON.parse(res);
        } else {
            return null;
        }
    }

    removeOrgUnit(orgUnitId: any) {
        const res = localStorage.getItem(this.USER_OU_KEY);
        if (res) {
            let orgUnits = JSON.parse(res);
            let selectedOU = orgUnits.find(x => x.orgUnitId === orgUnitId);
            let index = orgUnits.indexOf(selectedOU);
            orgUnits.splice(index, 1);
            localStorage.setItem(this.USER_OU_KEY, JSON.stringify(orgUnits));
        } else {
            return null;
        }
    }

    setOrgUnit(orgUnit: any) {
        localStorage.setItem(this.USER_OU_KEY, orgUnit);
    }

    setPermission(permissions: any) {
        localStorage.setItem(this.PERMISSION_KEY, permissions);
        this.onPermissionChanged.next(permissions);
    }

    getPermissions() {
        let permissionString = localStorage.getItem(this.PERMISSION_KEY);

        if (permissionString) {
            let permission = JSON.parse(permissionString);
            return permission;
        } else {
            return null;
        }
    }

    setLastLogin(userId: string, orgUnitId: string) {
        let userLogin = { userId: userId, orgUnitId: orgUnitId };

        let lastLogin = this.getAllLastLogin();
        if (lastLogin) {

            let newLastLogin = lastLogin.filter(x => x.userId !== userId);
            newLastLogin.push(userLogin);
            localStorage.setItem(this.LAST_LOGIN_KEY, JSON.stringify(newLastLogin));
        } else {
            let newLoginArray = [];
            newLoginArray.push(userLogin);
            localStorage.setItem(this.LAST_LOGIN_KEY, JSON.stringify(newLoginArray));
        }
    }

    getAllLastLogin() {
        let lastLoginString = localStorage.getItem(this.LAST_LOGIN_KEY);
        if (lastLoginString) {
            let lastLogin = JSON.parse(lastLoginString);
            return lastLogin;
        } else {
            return null;
        }
    }

    getLastLogin(userId: string) {
        let lastLoginString = localStorage.getItem(this.LAST_LOGIN_KEY);

        if (lastLoginString) {
            let lastLogin = JSON.parse(lastLoginString);
            let userLastLogin = lastLogin.filter(x => x.userId === userId)[0];
            if (userLastLogin) {
                return userLastLogin.orgUnitId;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    getAccessToken(): string {
        let authData = this.getAuth();
        if (!authData) {
            pocolog.error("Failed to get Auth data");
            return null;
        }

        return authData.accessToken;
    }

    clear() {
        this.removeCurrentOU();
        this.removeAuth();
        localStorage.removeItem(this.USER_OU_KEY);
        localStorage.removeItem(this.ROOT_OU_KEY);
        localStorage.removeItem(this.PERMISSION_KEY);
    }

    clearOrgUnit() {
        localStorage.removeItem(this.USER_OU_KEY);
    }
}

export class PermissionStorage {
    orgUnitId: string;
    permission: {}
    roleId: string;
    roleName: string;
}