import { Injectable } from '@angular/core';
import{HttpClient , HttpHeaders, HttpErrorResponse} from '@angular/common/http'
import { Observable,throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArmingDearmingService {

  baseURL ="http://localhost:8080/emmsLite/"
  constructor(private http:HttpClient) { }
  fetchHPBuildItem():Observable<any>{
    const url = this.baseURL+'viewBuildItem'
    return this.http.get(url)
  }
  fetchGigNumber():Observable<any>{
    const url = this.baseURL+'viewArmamentItemDD'
    return this.http.get(url)
  }
  fetchCurrentQuant(woid:any,data:any):Observable<any>{
    const url = this.baseURL+'saveNewRowBuildItem/'+woid
    return this.http.post(url,data)
  }
  saveRow(woid:any,data:any):Observable<any>{
    const url = this.baseURL+'onLoadClick/'+woid
    return this.http.post(url,data)
  }
  fetchExistData(woid:any):Observable<any>{
    const url = this.baseURL+'viewWOArmDeArm/'+woid
    return this.http.get(url)
  }
  deleteExistingData(id:any):Observable<any>{
    const url = this.baseURL+'deleteBuildItemRow/'+id
    return this.http.get(url)
  }
}
