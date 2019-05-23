
export class OrgUnit {
    // static DEFAULT_CLIENTS = 'Clients';
    // static DEFAULT_PARTNERS = 'Partners';
    // static DEFAULT_COWORKERS = 'Co-Workers';
    // static AVATAR_PROGRAMMER = 'assets/img/avatar_programmer.png';
    // static AVATAR_MANAGER = 'assets/img/avatar_manager.png';
    // static AVATAR_PLANNER = 'assets/img/avatar_planner.png';
    // static AVATAR_ADMIN = 'assets/img/avatar_admin.png';
    // static AVATAR_STOCK_KEEPER = 'assets/img/avatar_stock_keeper.png';
    // static AVATAR_CLIENT = 'assets/img/avatar_client.png';
    // static AVATAR_LAWYER1 = 'assets/img/avatar_lawyer.png';
    // static AVATAR_LAWYER2 = 'assets/img/avatar_lawyer2.png';
    // static AVATAR_DEFAULT = 'assets/img/avatar_default.png';
    static ORG_AVATAR_DEFAULT = '/assets/avatars/home.png';

    orgUnitId: string;
    name: string;
    parent: OrgUnit;
    imageUrl: string;
    fullImageUrl: string;
    isRoot: boolean;
    groups: any[];
    contacts: any[];
    orgUnits: OrgUnit[];
    mailingAddress: string;
    postalCode: string;
    state: string;
    phoneNumber: string;
    email: string;
    rootOrgUnitId: string;
    rootOrgUnitName: string;
    userStatus: number;
    userRole: any;
    industryId: string;
    industryName: string;
    entityStatus: number;

    constructor(orgUnitId: string, name: string, parent: OrgUnit) {
        this.orgUnitId = orgUnitId;
        this.name = name;
        this.imageUrl = OrgUnit.ORG_AVATAR_DEFAULT;
        this.parent = parent;
        this.isRoot = (parent == null);
        this.orgUnits = [];
        this.contacts = [];
        this.groups = [];
        this.entityStatus = 1;
    }

    static parseList(data: any[]) {
        let result: OrgUnit[] = [];
        if (data) {
            data.forEach(d => {
                let ou = new OrgUnit(d.orgUnitId, d.name, d.parent);
                ou.imageUrl = d.imageUrl;
                ou.fullImageUrl = d.fullImageUrl;
                ou.mailingAddress = d.mailingAddress;
                ou.postalCode = d.postalCode;
                ou.state = d.state;
                ou.phoneNumber = d.phoneNumber;
                ou.email = d.email;
                ou.rootOrgUnitId = d.rootOrgUnitId;
                ou.rootOrgUnitName = d.rootOrgUnitName;
                ou.isRoot = d.isRoot;
                ou.userStatus = d.userStatus;
                ou.userRole = d.userRole;
                ou.industryId = d.industryId;
                ou.industryName = d.industryName;
                ou.entityStatus = d.entityStatus;
                // TODO: others properties may need to parse and assign
                result.push(ou);
            });
        }
        return result;
    }
}
