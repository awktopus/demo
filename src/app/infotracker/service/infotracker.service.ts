import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { EsignAuthService } from '../../esign/service/esignauth.service';
import { EZSignDocResource } from '../../esign/beans/ESignCase';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class InfoTrackerService {

  onCategoriesChanged: BehaviorSubject<any>;
  // public baseurl = environment.apiEsignLink;
  // this is pass along the ezsign document information between components
  // private _ezsignDocHistory: BehaviorSubject<EZSignDocResource> = new BehaviorSubject((new EZSignDocResource()));
  // public readonly cur_ezsignDocHistory: Observable<EZSignDocResource> = this._ezsignDocHistory.asObservable();



  constructor(private http: HttpClient, public auth: EsignAuthService) {
    // Set the defaults
    this.onCategoriesChanged = new BehaviorSubject({});
  }

  GetOrgInfoTrackForms(orgUnitId: string, employeeId: string): Observable<any> {
    const url = this.auth.baseurl + '/infotracker/orgunit/' + this.auth.getOrgUnitID() + '/user/'
      + this.auth.getUserID() + '/formtemplates';
    return this.http.get(url, this.auth.getESignOptions());
  }

  GetInfoTrackFormTemplates(employeeId: string): Observable<any> {
    const url = this.auth.baseurl + '/infotracker/user/'
      + this.auth.getUserID() + '/formtemplates';
    return this.http.get(url, this.auth.getESignOptions());
  }

  ActivateInfoTrack(orgUnitId: string, employeeId: string, assignFormjson: any): Observable<any> {
    console.log('ActivateInfoTrack:');
    console.log(orgUnitId);
    console.log(employeeId);
    return this.http.post(this.auth.baseurl + '/infotracker/orgunit/' + this.auth.getOrgUnitID() + '/employee/' +
      this.auth.getUserID() + '/infotrack/activation',
      assignFormjson, this.auth.getESignOptions());
  }

  GetOrgStaff(orgUnitId: string, employeeId: string): Observable<any> {
    const url = this.auth.baseurl + '/infotracker/orgunit/' + this.auth.getOrgUnitID() + '/user/'
      + this.auth.getUserID() + '/orgstaff';
    return this.http.get(url, this.auth.getESignOptions());
  }

  GetOrgAllInfoTrackForms(orgUnitId: string, employeeId: string): Observable<any> {
    const url = this.auth.baseurl + '/infotracker/orgunit/' + this.auth.getOrgUnitID() + '/user/'
      + this.auth.getUserID() + '/allformtemplates';
    return this.http.get(url, this.auth.getESignOptions());
  }

  GetPDFBlob(url: string) {
    const opps = this.auth.getESignOptionswithoutElToken();
    opps['responseType'] = 'arraybuffer';
    console.log('get content url:' + url);
    return this.http.get(url, opps);
  }

  AddDesignatedStaff(orgUnitId: string, employeeId: string, designatedStaff: any): Observable<any> {
    console.log('AddDesignatedStaff:');
    return this.http.post(this.auth.baseurl + '/infotracker/orgunit/' + this.auth.getOrgUnitID() +
      '/employee/' + this.auth.getUserID() + '/adddesignatedstaff',
      designatedStaff, this.auth.getESignOptions());
  }

  GetDesignatedOrgStaff(orgUnitId: string, employeeId: string): Observable<any> {
    const url = this.auth.baseurl + '/infotracker/orgunit/' + this.auth.getOrgUnitID() + '/employee/'
      + this.auth.getUserID() + '/orgdesignatedstaff';
    return this.http.get(url, this.auth.getESignOptions());
  }

  GetOrgLocations(orgUnitId: string, employeeId: string): Observable<any> {
    const url = this.auth.baseurl + '/infotracker/orgunit/' + this.auth.getOrgUnitID() + '/user/'
      + this.auth.getUserID() + '/locations';
    return this.http.get(url, this.auth.getESignOptions());
  }

  AddUpdateLocation(orgUnitId: string, employeeId: string, location: any): Observable<any> {
    console.log('Add update location:');
    return this.http.post(this.auth.baseurl + '/infotracker/orgunit/' + this.auth.getOrgUnitID() +
      '/employee/' + this.auth.getUserID() + '/addupdatelocation',
      location, this.auth.getESignOptions());
  }

  DeleteLocation(orgUnitId: string, employeeId: string, locationSeqNo: number): Observable<any> {
    console.log('Delete location:');
    const url = this.auth.baseurl + '/infotracker/orgunit/' + this.auth.getOrgUnitID() +
      '/employee/' + this.auth.getUserID() + '/location/' + locationSeqNo + '/deletelocation'
    console.log('url:' + url);
    return this.http.delete(url, this.auth.getESignOptions());
  }

  GetAllUserStatus(orgUnitId: string, employeeId: string, reportedStartDate: string,
    userType: string,  reportedEndDate: string): Observable<any> {

    const url = this.auth.baseurl + '/infotracker/orgunit/' + this.auth.getOrgUnitID() +
      '/employee/' + this.auth.getUserID() + '/usertype/' + userType + '/reportedstartdate/' +
      reportedStartDate + '/reportedenddate/' + reportedEndDate + '/userstatus';
    console.log('url:');
    console.log(url);
    return this.http.get(url, this.auth.getESignOptions());
  }

  GetReportedDates(orgUnitId: string, employeeId: string,
    templateId: number): Observable<any> {
    const url = this.auth.baseurl + '/infotracker/orgunit/' + this.auth.getOrgUnitID() +
      '/employee/' + this.auth.getUserID() + '/formtemplate/' +
      templateId + '/reporteddates';
    return this.http.get(url, this.auth.getESignOptions());
  }

  GetFormTemplateConfig(orgUnitId: string, employeeId: string,
    templateId: number): Observable<any> {
      console.log('Get form template config');
      const url = this.auth.baseurl + '/infotracker/orgunit/' + this.auth.getOrgUnitID() +
      '/user/' + this.auth.getUserID() + '/formtemplate/' +
      templateId + '/config';
    return this.http.get(url, this.auth.getESignOptions());
    }

    AddUser(orgUnitId: string, employeeId: string, newUser: any): Observable<any> {
      console.log('Add user:');
      return this.http.post(this.auth.baseurl + '/infotracker/orgunit/' + this.auth.getOrgUnitID() +
        '/employee/' + this.auth.getUserID() + '/adduser',
        newUser, this.auth.getESignOptions());
    }

    SearchUsers(orgUnitId: string, employeeId: string,
      usertype: string, userSearchToken: string) {
        console.log('Search users');
        const url = this.auth.baseurl + '/infotracker/orgunit/' + this.auth.getOrgUnitID() +
        '/employee/' + this.auth.getUserID() + '/usertype/' +
        usertype + '/usersearch/' + userSearchToken;
      return this.http.get(url, this.auth.getESignOptions());
    }

    GetFormInfo(orgUnitId: string, employeeId: string,
      trackerId: string): Observable<any> {
        console.log('Get form info');
        const url = this.auth.baseurl + '/infotracker/orgunit/' + this.auth.getOrgUnitID() +
        '/employee/' + this.auth.getUserID() + '/track/' +
        trackerId + '/forminfo';
      return this.http.get(url, this.auth.getESignOptions());
      }

      SubmitForm(orgUnitId: string, employeeId: string, templateId: number, pageId: number, formInfo: any): Observable<any> {
        console.log('Submit form:');
        return this.http.post(this.auth.baseurl + '/infotracker/orgunit/' + this.auth.getOrgUnitID() +
          '/employee/' + this.auth.getUserID() + '/formtemplate/' + templateId + '/page/' + pageId +
          '/submitform',
          formInfo, this.auth.getESignOptions());
      }

      EditForm(orgUnitId: string, employeeId: string, trackerId: string, formInfo: any): Observable<any> {
        console.log('Edit form:');
        return this.http.put(this.auth.baseurl + '/infotracker/orgunit/' + this.auth.getOrgUnitID() +
          '/employee/' + this.auth.getUserID() + '/track/' + trackerId + '/editform',
          formInfo, this.auth.getESignOptions());
      }

      GetUserCurrentFormStatus(orgUnitId: string, employeeId: string, userId: string,
      templateId: number, reportedDate: string ): Observable<any> {
        console.log('GetUserCurrentFormStatus');
        const url = this.auth.baseurl + '/infotracker/orgunit/' + this.auth.getOrgUnitID() +
        '/employee/' + this.auth.getUserID() + '/user/' + userId +
        '/formtemplate/' + templateId +   '/reporteddate/' + reportedDate + '/currentstatus';
      return this.http.get(url, this.auth.getESignOptions());
      }
}
