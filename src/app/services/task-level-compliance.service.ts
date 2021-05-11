import { Injectable } from '@angular/core';
import{HttpClient , HttpHeaders, HttpErrorResponse} from '@angular/common/http'
import { Observable,throwError } from 'rxjs';
import {catchError} from 'rxjs/operators'

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
  createTaskLevelCompliance(wo_id:any, object:any):Observable<any>{
    console.log("inside createTaskLevelCompliance")
    const url = this.baseURL+'createTaskLevelCompliance/'+wo_id
    return this.http.post<any>(url,object,{observe:'response'}).pipe(catchError(this.handleError))
  }
  deleteTaskLevelCompliance(tlcid:string):Observable<any>{
    console.log("inside deleteTaskLevelCompliance")
    const url = this.baseURL+'deleteTaskLevelCompliance/'+tlcid
    return this.http.get(url,{observe:'response'})
  }
  complyTaskLevelCompliance(tlcid:string,userid:string):Observable<any>{
    console.log("inside complyTaskLevelCompliance")
    const url = this.baseURL+'complyTaskLevelCompliance/'+tlcid
    return this.http.put(url,userid,{observe:'response'})
  }
  handleError(error){
    console.log("error")
    return throwError(error.message || 'Some error occured')
  }
}
