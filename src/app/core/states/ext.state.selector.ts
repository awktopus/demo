import { AbstractStateSelector } from "./abstract.state.selector";
import { Injectable } from "@angular/core";
//import { AuthStateSelector } from "./auth.state.selector";
//import { EnterpriseSelector } from "./enterprise.state.selector";
//import { UserDataSelector } from "./user-data.state.selector";
//import { OrgType } from "../enum/org-type";

@Injectable({
  providedIn: "root"
})
export class ExtStateSelector implements AbstractStateSelector {
  constructor(
  //  private authSelector: AuthStateSelector,
  //  private enterpriseSelector: EnterpriseSelector,
  //  private userDataSelector: UserDataSelector
  ) {}

  getAuthData(): { accessToken: string; expiredIn: number; userName: string } {
    //const data = { ...this.authSelector.data };
    let data: any = {};
    return {
      accessToken: data.accessToken,
      expiredIn: data.expiredIn,
      userName: data.userName
    };
  }

  getCurrentUser(): {
    userId: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
  } {
    //const user = { ...this.userDataSelector.userProfile };
    let user: any = {}
    return {
      userId: user.userId,
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    };
  }
  getCurrentOrg(): {
    id: string;
    name: string;
    isPersonal: boolean;
    industryId: string;
  } {
    let OrgType: any = {};
    //const org = { ...this.enterpriseSelector.getCurrentOrg() };
    let org: any = {};
    return {
      id: org.id,
      name: org.name,
      isPersonal: org.type === OrgType.Personal,
      industryId: org.industryId
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
    return users.map(u => {
      return {
        orgId: u.orgId,
        userId: u.userId,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role
      };
    });
  }
}
