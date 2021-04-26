import { Injectable } from '@angular/core';
import{HttpClient , HttpHeaders, HttpErrorResponse} from '@angular/common/http'
import { Observable,throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskLevelComplianceService {
  baseURL ="http://localhost:8080/emmsLite/"

  constructor(private http:HttpClient) { }
  fetchTechnicianDetails():Observable<any>{
    const url = this.baseURL+'fetchTechnicianDetails'
    return this.http.get(url)
  }
  fetchTaskLevelCompliance(wo_id:any,userid:string):Observable<any>{
    const url = this.baseURL+'fetchTaskLevelComplianceDetails/'+wo_id
    return this.http.post(url,userid)
  }
}
