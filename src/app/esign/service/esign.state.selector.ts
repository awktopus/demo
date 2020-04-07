import { AbstractStateSelector } from "../../core/states/abstract.state.selector";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class EsignStateSelector implements AbstractStateSelector {
  private _authdata: any = null;
  private _orgData: any = null;
  private _userOrgs: any[] = null;
  private _eSignAccessToken: any = null;
  constructor() {
  }

  clearData() {
    this._authdata = null;
    this._orgData = null;
    this._eSignAccessToken = null;
  }

  setAuthData(authData: any) {
    this._authdata = authData;
    let n_ary = this._authdata.givenName.split();
    if (n_ary.length > 1) {
      this._authdata.firstName = n_ary[0];
      this._authdata.lastName = n_ary[1];
    } else {
      this._authdata.firstName = n_ary[0];
      this._authdata.lastName = "";
    }
  }

  setOrgData(orgData: any) {
    this._orgData = orgData;
  }

  setCurOrgById(newOrgID) {
    if (this._userOrgs) {
      this._userOrgs.forEach(vv => {
        let org: any = vv;
        if (org.orgUnitId === newOrgID) {
          this.setOrgData(org);
        }
      });
    }
  }
  setUserOrgs(orgs: any[]) {
    this._userOrgs = orgs;
  }

  getAuthData(): { accessToken: string; expiredIn: number; userName: string } {
    if (this._authdata) {
      return {
        accessToken: this._authdata.accessToken,
        expiredIn: this._authdata.expiredIn,
        userName: this._authdata.userName
      };
    } else {
      return null;
    }
  }

  getCurrentUser(): {
    userId: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
  } {
    // const user = { ...this.userDataSelector.userProfile };
    // let user: any = {}
    if (this._authdata) {
      return {
        userId: this._authdata.id,
        userName: this._authdata.userName,
        firstName: this._authdata.firstName,
        lastName: this._authdata.lastName,
        email: this._authdata.userName
      };
    } else {
      return null;
    }
  }
  getCurrentOrg(): {
    id: string;
    name: string;
    isPersonal: boolean;
    industryId: string;
  } {
    // const org = { ...this.enterpriseSelector.getCurrentOrg() };
    // let org: any = {};
    if (this._orgData) {
      return {
        id: this._orgData.orgUnitId,
        name: this._orgData.name,
        isPersonal: this._orgData.type === OrgType.Personal,
        industryId: this._orgData.industryId
      };
    }
  }
  getCurrentOrgUsers(): {
    orgId: string;
    userId: string;
    firstName: string;
    lastName: string;
    role: string;
  }[] {
    // const users = [...this.enterpriseSelector.getCurrentOrgUsers()];
    const users: any = [];
    /*return users.map(u => {
      return {
        orgId: u.orgId,
        userId: u.userId,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role
      };
    });*/
    return users;
  }

  getESignAccessToken(): { accessToken: string; } {
    if (this._eSignAccessToken) {
      return {
        accessToken: this._eSignAccessToken
      };
    } else {
      return null;
    }
  }

  setESignAccessToken(accessToken: any) {
    this._eSignAccessToken = accessToken;
  }
}
export enum OrgType {
  Personal = 1,
  Business = 2
}

