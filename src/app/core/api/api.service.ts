import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { pocolog } from 'pocolog';
import { EsignStateSelector } from '../../esign/service/esign.state.selector';
import { AbstractStateSelector } from '../states/abstract.state.selector';

@Injectable()
export class ApiService {
  private _apiUrl: string = environment.apiLink;
  private readonly HEADER_DOMAIN_IDENTITY: string = 'EL-Domain-Identity';
  private readonly HEADER_RESOUCE_IDENTITY: string = 'EL-Resource-Identity';

  constructor(private http: HttpClient, private esignstate: AbstractStateSelector) { }

  private _getJwtAccessToken() {
    let auth: any = this.esignstate.getAuthData();

    if (auth) {
      // console.log(token);
      return auth.accessToken;
    } else {
      pocolog.error("Failed to get access token from cache.");
      return null;
    }
  }

  private _getRooOUId() {
    let curorg: any = this.esignstate.getCurrentOrg();

    if (!curorg) { pocolog.error("Failed to retrieve root ou id from cache."); }

    return curorg.rootOrgUnitId;
  }

  private _buildJwtAuthHeader(accessToken: string, resourceId?: string): HttpHeaders {
    let header: HttpHeaders = new HttpHeaders();
    let rootOuId: string = this._getRooOUId();
    header = header.append('Content-Type', 'application/json');
    if (!accessToken) { return header; }

    header = header.append('Accept', 'application/json');
    header = header.append('Authorization', 'Bearer ' + accessToken);

    if (rootOuId) {
      header = header.append(this.HEADER_DOMAIN_IDENTITY, rootOuId);
    }

    if (resourceId) {
      header = header.append(this.HEADER_RESOUCE_IDENTITY, resourceId);
    }
    return header;
  }

  private _buildParams(data?: any) {
    const params = new HttpParams();
    if (!data) { return params; }
    // tslint:disable-next-line:forin
    for (const k in data) {
      params.set(k, data[k]);
    }
    return params;
  }


  getUrl<T>(url: string, params?: any, elResourceIdentity?: string) {

    const options = {
      headers: this._buildJwtAuthHeader(this._getJwtAccessToken(), elResourceIdentity),
      params: this._buildParams(params)
    };
    // console.log(options);
    return this.http.get<T>(url, options);
  }


  get<T>(endpoint: string, params?: any, elResourceIdentity?: string) {

    const options = {
      headers: this._buildJwtAuthHeader(this._getJwtAccessToken(), elResourceIdentity),
      params: this._buildParams(params)
    };
    // console.log(options);
    return this.http.get<T>(this._apiUrl + '/' + endpoint, options);
  }

  getAysnc<T>(endpoint: string, params?: any, elResourceIdentity?: string) {
    return this.get<T>(endpoint, params, elResourceIdentity).toPromise();
  }

  getAsyncWithJwtToken<T>(endpoint: string, JWTAuthToken: any, params?: any, elResourceIdentity?: string) {
    let options = {
      headers: this._buildJwtAuthHeader(JWTAuthToken, elResourceIdentity)
    };

    return this.get<T>(endpoint, params, elResourceIdentity).toPromise();
  }


  post<T>(endpoint: string, body: any, removeContentType?: boolean, elResourceIdentity?: string, headerParams?: any) {

    let options = {
      headers: this._buildJwtAuthHeader(this._getJwtAccessToken(), elResourceIdentity)
    };
    if (headerParams) {
      options = headerParams;
      options.headers = this._buildJwtAuthHeader(this._getJwtAccessToken(), elResourceIdentity)
    }

    if (removeContentType) {
      options.headers = options.headers.delete('Content-Type');
    }

    return this.http.post<T>(this._apiUrl + '/' + endpoint, body, options)
  }

  postAsync<T>(endpoint: string, body: any, elResourceIdentity?: string, headerParams?: any) {
    return this.post<T>(endpoint, body, false, elResourceIdentity, headerParams).toPromise();
  }

  postAsyncWithJwtToken<T>(endpoint: string, JWTAuthToken: any, body: any, elResourceIdentity?: string) {
    let options = {
      headers: this._buildJwtAuthHeader(JWTAuthToken, elResourceIdentity)
    };

    return this.http.post<T>(this._apiUrl + '/' + endpoint, body, options).toPromise();
  }

  postAsyncFile<T>(endpoint: string, body: any, elResourceIdentity?: string, headerParams?: any) {
    return this.post<T>(endpoint, body, true, elResourceIdentity, headerParams).toPromise();
  }

  put<T>(endpoint: string, body: any, elResourceIdentity?: string) {

    const options = {
      headers: this._buildJwtAuthHeader(this._getJwtAccessToken(), elResourceIdentity)
    };

    return this.http.put<T>(this._apiUrl + '/' + endpoint, body, options);
  }

  putAsync<T>(endpoint: string, body: any, elResourceIdentity?: string) {
    return this.put<T>(endpoint, body, elResourceIdentity).toPromise();
  }

  delete<T>(endpoint: string, params?: any, elResourceIdentity?: string) {

    const options = {
      headers: this._buildJwtAuthHeader(this._getJwtAccessToken(), elResourceIdentity),
      body: params
    };

    return this.http.delete<T>(this._apiUrl + '/' + endpoint, options);
  }

  deleteAsync<T>(endpoint: string, params?: any, elResourceIdentity?: string) {
    return this.delete<T>(endpoint, params, elResourceIdentity).toPromise();
  }


  handleError(error: any) {
    pocolog.error(error);
    if (error && error.error) {
    } else {
      error.error = { code: 'error', error: error.statusText, status: error.status };
    }
    if (error.error.status) {
      error.error.status = error.status;
    }
  }
}
