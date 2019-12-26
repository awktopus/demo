import { Injectable } from '@angular/core';
import { BehaviorSubject ,  Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from '../../core/localStorage/local-storage.service';
import { environment } from '../../../environments/environment';
import { EsignAuthService } from '../../esign/service/esignauth.service';
import { EZSignDocResource } from '../../esign/beans/ESignCase';

@Injectable()
export class EzsigndataService {
  // public baseurl = environment.apiEsignLink;
  // this is pass along the ezsign document information between components
  private _ezsignDocHistory: BehaviorSubject<EZSignDocResource> = new BehaviorSubject((new EZSignDocResource()));
  public readonly cur_ezsignDocHistory: Observable<EZSignDocResource> = this._ezsignDocHistory.asObservable();

  constructor(private http: HttpClient, public auth: EsignAuthService) {
  }

  newEzSignDocHistory(ezSignDocHistory: EZSignDocResource) {
    console.log('inside Ezsigndataservice');
    console.log(ezSignDocHistory);
    this._ezsignDocHistory.next(ezSignDocHistory);
  }

  getEZSignDocuments() {
    const url = this.auth.baseurl + '/ezsign/orgunit/' + this.auth.getOrgUnitID() + '/sender/'
    + this.auth.getUserID() + '/alldocuments';
    return this.http.get(url, this.auth.getESignOptions());
  }

  createNewEZSignDocument() {
    return this.http.post(this.auth.baseurl + '/ezsign/orgunit/' + this.auth.getOrgUnitID() +
    '/sender/'  + this.auth.getUserID() + '/document', null, this.auth.getESignOptions());
  }

  deleteEZSignDocument(trackingId: string) {
    return this.http.delete(this.auth.baseurl + '/ezsign/orgunit/' + this.auth.getOrgUnitID() +
    '/sender/'  + this.auth.getUserID() +
    '/tracking/'  + trackingId + '/delete', this.auth.getESignOptions());
  }
}

