import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Response, Http, Headers, RequestOptions } from '@angular/http';
import { CustomHttpService } from "../shared/default.header.service";
import { StorageService } from "../shared/storage.service";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class AdminService {

  private baseUrl: string = "";

  constructor(public http: CustomHttpService,
    public htttp: Http,
    public con: StorageService) {
      this.baseUrl = con.baseUrl + con.getData('user_roleInfo')[0].role;
  }
  getDepartments() {
    return this.http.get(this.baseUrl + "/department")
      .map(this.extractData)
      .catch(this.handleError);
  }

  getRoles() {
    return this.http.get(this.baseUrl + "/role")
      .map(this.extractData)
      .catch(this.handleError);
  }

  getUniversity() {
    return this.http.get(this.baseUrl + "/university")
      .map(this.extractData)
      .catch(this.handleError);
  }

  public addUniversity(data: any) {
    return this.http.post(this.baseUrl + "/university", data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public addDepartment(department: any) {
    return this.http.post(this.baseUrl + "/department", department)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public addEmployee(employee: any) {
    return this.http.post(this.baseUrl + "/employee", employee)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public getEmployee() {
    return this.http.get(this.baseUrl + "/employee")
      .map(this.extractData)
      .catch(this.handleError);
  }

  public addRole(role: any) {
    return this.http.post(this.baseUrl + "/role", role)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    if (res.status === 204) { return res; }
    let body = res.json();
    return body || {};
  }


  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      if (error.status === 0) {
        errMsg = `${error.status} - "Something is wrong.."`;
      }
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }
}