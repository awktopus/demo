import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { EsignAuthService } from '../../esign/service/esignauth.service';
import { EZSignDocResource } from '../../esign/beans/ESignCase';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class InfoTrackerService  {

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


}
