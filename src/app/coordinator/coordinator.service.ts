import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response, Http, Headers, RequestOptions } from '@angular/http';
import { CustomHttpService } from "../shared/default.header.service";
import { StorageService } from "../shared/storage.service";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
@Injectable()
export class CoordinatorService{

  private baseUrl: string = "";

  constructor(public http: CustomHttpService,private htttp:Http,
    public con: StorageService) {
    this.baseUrl = con.baseUrl + con.getData('user_roleInfo')[0].role;
  }

  public getOpiByDeptId(deptId:any){
    return this.http.get(this.baseUrl + "/department/"+deptId+"/result")
    .map(this.extractData)
    .catch(this.handleError);
  }

  public saveQuarterResult(data:any){
    return this.http.post(this.baseUrl + "/result",data)
    .map(this.extractData)
    .catch(this.handleError);
  }

  public saveQuarterWithInternship(quarterId:any,data:any){
    var options = new RequestOptions({
      headers: new Headers({
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      })
    });
    return this.htttp.post(this.baseUrl + "/quarter/"+quarterId+"/studentInternshipForm",data,options)
    .map(this.extractData)
    .catch(this.handleError);
  }

  updateQuarterResult(quarterId:any,data:any){
    return this.http.put(this.baseUrl + "/quarter/"+quarterId+"/lock",{})
    .map(this.extractData)
    .catch(this.handleError);
  }

  saveEvidence(data:any,quarterId:any){
    var options = new RequestOptions({
      headers: new Headers({
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      })
    });
    return this.htttp.post(this.baseUrl + "/quarter/"+quarterId+"/evidance",data,options)
    .map(this.extractData)
    .catch(this.handleError);
  }

  saveEvidenceForInternshipFile(data:any,id:any){
    var options = new RequestOptions({
      headers: new Headers({
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      })
    });
    return this.htttp.post(this.baseUrl + "/internship/"+id+"/evidance",data,options)
    .map(this.extractData)
    .catch(this.handleError);
  }

  deleteInternshipFile(internshipFileId:any){
    return this.http.delete(this.baseUrl + "/internship/"+ internshipFileId)
    .map(this.extractData)
    .catch(this.handleError)
  }

  deleteInternshipEvidence(evidenceId:any){
    return this.http.delete(this.baseUrl + "/internship/evidance/"+evidenceId)
    .map(this.extractData)
    .catch(this.handleError)
  }

  saveEvidenceForMou(data:any,id:any){
    var options = new RequestOptions({
      headers: new Headers({
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      })
    });
    return this.htttp.post(this.baseUrl + "/mous/"+id+"/evidance",data,options)
    .map(this.extractData)
    .catch(this.handleError);
  }

  deleteMou(mouResultId:any){
    return this.http.delete(this.baseUrl + "/mous/" + mouResultId)
    .map(this.extractData)
    .catch(this.handleError);
  }

  deleteMouEvidence(evidenceId:any){
    return this.http.delete(this.baseUrl + "/mous/evidance/"+evidenceId)
    .map(this.extractData)
    .catch(this.handleError);
  }

  deleteEvidence(evidenceId:any){
    return this.http.delete(this.baseUrl + "/evidance/"+evidenceId)
    .map(this.extractData)
    .catch(this.handleError);
  }

  saveQuarterResultWithMou(quarterId:any,data:any){
    return this.http.post(this.baseUrl + "/quarter/"+quarterId+"/mous",data)
    .map(this.extractData)
    .catch(this.handleError);
  }

  updateMou(mouId:any,mou:any){
    return this.http.put(this.baseUrl + "/mous/"+ mouId,mou)
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