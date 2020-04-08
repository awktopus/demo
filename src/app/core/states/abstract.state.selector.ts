import { Observable } from "rxjs";

export abstract class AbstractStateSelector {
  // Data
  abstract getAuthData(): {
    accessToken: string;
    expiredIn: number;
    userName: string;
  };

  // get current user profile
  abstract getCurrentUser(): {
    userId: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
  };

  // Get current selected org
  abstract getCurrentOrg(): {
    id: string;
    name: string;
    isPersonal: boolean;
    industryId: string;
  };

  // Get current active selected org's users
  abstract getCurrentOrgUsers(): {
    orgId: string;
    userId: string;
    firstName: string;
    lastName: string;
    role: string;
  }[];

  abstract getCurrentOrgUser(): {
    orgId: string;
    userId: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}
