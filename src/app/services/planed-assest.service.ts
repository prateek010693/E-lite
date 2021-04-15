import { Injectable } from '@angular/core';
import{HttpClient , HttpHeaders, HttpErrorResponse} from '@angular/common/http'
import { Observable,throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PlanedAssestService {


 //------------- global URL for Access Backend API----------------------//
  baseURL ="http://192.168.10.224:8080/emmsLite/"
  constructor(private http:HttpClient) { }
  
  
  // importXml(file:any):Observable<any>{
  //   const url ="http://192.168.10.5:8081/emmsLite/importXml"
  //   return this.http.post(url,file)
  // }
  // getXMLData():Observable<any>{
  //   const url ="prateek"
  //   console.log('url',url)
  //   return this.http.get(url)
  // }

  //-------------API for View Asset----------------------//
  getPlannedAsset():Observable<any>{
    const url = this.baseURL+'viewAsset'
    return this.http.get(url)
  }
  //-------------End----------------------//
}
