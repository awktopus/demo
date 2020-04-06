import { AbstractStateSelector } from "../../core/states/abstract.state.selector";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class EsignStateSelector implements AbstractStateSelector {
  private _authdata: any = null;
  private _orgData: any = null;
  private _userOrgs: [] =  null;
  constructor(
  //  private authSelector: AuthStateSelector,
  //  private enterpriseSelector: EnterpriseSelector,
  //  private userDataSelector: UserDataSelector
  ) {}

  clearData() {
    this._authdata = null;
    this._orgData = null;
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
    this._userOrgs.forEach(vv => {
      let org: any = vv;
      if (org.orgUnitId === newOrgID) {
        this.setOrgData(org);
      }
    });
  }
  setUserOrgs(orgs: []) {
    this._userOrgs = orgs;
  }
  /*
  userName: "rvrnkumar_363@yahoo.com"
givenName: "Ranga  Rachapudi"
id: "db608b99-d878-428c-8f7a-3daad5fd596a"
matrixId: "@el.lh7k1-qw7eoqpfskowfp5q:matrixlab-new.everleagues.com"
matrixAccessToken: "MDAyYmxvY2F0aW9uIG1hdHJpeGxhYi1uZXcuZXZlcmxlYWd1ZXMuY29tCjAwMTNpZGVudGlmaWVyIGtleQowMDEwY2lkIGdlbiA9IDEKMDA0YmNpZCB1c2VyX2lkID0gQGVsLmxoN2sxLXF3N2VvcXBmc2tvd2ZwNXE6bWF0cml4bGFiLW5ldy5ldmVybGVhZ3Vlcy5jb20KMDAxNmNpZCB0eXBlID0gYWNjZXNzCjAwMjFjaWQgbm9uY2UgPSBUbHVYRCw0QnVqa0BSalpzCjAwMmZzaWduYXR1cmUgVlB_XO82HbkQ9SaXyD96OQ9nolXsvQRyPtUvpeqqOY8K"
accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9zaWQiOiJkYjYwOGI5OS1kODc4LTQyOGMtOGY3YS0zZGFhZDVmZDU5NmEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoicnZybmt1bWFyXzM2M0B5YWhvby5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJydnJua3VtYXJfMzYzQHlhaG9vLmNvbSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2dpdmVubmFtZSI6IlJhbmdhICBSYWNoYXB1ZGkiLCJodHRwczovL3d3dy5ldmVybGVhZ3Vlcy5jb20vand0L2NsYWltcy9taWQiOiJAZWwubGg3azEtcXc3ZW9xcGZza293ZnA1cTptYXRyaXhsYWItbmV3LmV2ZXJsZWFndWVzLmNvbSIsImh0dHBzOi8vd3d3LmV2ZXJsZWFndWVzLmNvbS9qd3QvY2xhaW1zL2RpZCI6IklJSlBZR1VGVU0iLCJodHRwczovL3d3dy5ldmVybGVhZ3Vlcy5jb20vand0L2NsYWltcy9tYXQiOiJNREF5WW14dlkyRjBhVzl1SUcxaGRISnBlR3hoWWkxdVpYY3VaWFpsY214bFlXZDFaWE11WTI5dENqQXdNVE5wWkdWdWRHbG1hV1Z5SUd0bGVRb3dNREV3WTJsa0lHZGxiaUE5SURFS01EQTBZbU5wWkNCMWMyVnlYMmxrSUQwZ1FHVnNMbXhvTjJzeExYRjNOMlZ2Y1hCbWMydHZkMlp3TlhFNmJXRjBjbWw0YkdGaUxXNWxkeTVsZG1WeWJHVmhaM1ZsY3k1amIyMEtNREF4Tm1OcFpDQjBlWEJsSUQwZ1lXTmpaWE56Q2pBd01qRmphV1FnYm05dVkyVWdQU0JVYkhWWVJDdzBRblZxYTBCU2FscHpDakF3TW1aemFXZHVZWFIxY21VZ1ZsQl9YTzgySGJrUTlTYVh5RDk2T1E5bm9sWHN2UVJ5UHRVdnBlcXFPWThLIiwiaHR0cHM6Ly93d3cuZXZlcmxlYWd1ZXMuY29tL2p3dC9jbGFpbXMvMmZhIjpmYWxzZSwiaHR0cHM6Ly93d3cuZXZlcmxlYWd1ZXMuY29tL2p3dC9jbGFpbXMvcGxjIjoiZGVmYXVsdC1hdXRoIiwiaHR0cHM6Ly93d3cuZXZlcmxlYWd1ZXMuY29tL2p3dC9jbGFpbXMvZW12Ijp0cnVlLCJuYmYiOjE1ODYxMDgyODIsImV4cCI6MTU4ODcwMDI4MiwiaXNzIjoiZXZlcmxlYWd1ZXMuY29tIiwiYXVkIjoiZXZlcmxlYWd1ZXMuY29tIn0.-6Lacnrd9iwrhSiFiJCxKfL3cwUhReTMmeBOSVNo8gE"
expiredIn: 2592000
twoFactorEnabled: false
phoneNumber: null
emailVerified: true
recaptchaToken: null
*/
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
    //const user = { ...this.userDataSelector.userProfile };
    // let user: any = {}
    if (this._authdata) {
      return {
        userId: this._authdata.Id,
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
    //const org = { ...this.enterpriseSelector.getCurrentOrg() };
    //let org: any = {};
    return {
      id: this._orgData.orgUnitId,
      name: this._orgData.name,
      isPersonal: this._orgData.type === OrgType.Personal,
      industryId: this._orgData.industryId
    };
  }
  getCurrentOrgUsers(): {
    orgId: string;
    userId: string;
    firstName: string;
    lastName: string;
    role: string;
  }[] {
    //const users = [...this.enterpriseSelector.getCurrentOrgUsers()];
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
}
export enum OrgType {
  Personal = 1,
  Business = 2
}
