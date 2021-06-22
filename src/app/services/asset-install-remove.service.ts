import { Injectable } from '@angular/core';
import{HttpClient , HttpHeaders, HttpErrorResponse} from '@angular/common/http'
import { Observable,throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetInstallRemoveService {
  baseURL ="http://localhost:8080/emmsLite/"
  constructor(private http:HttpClient) { }
  fetchExistingasset(woid):Observable<any>{
    const url = this.baseURL+'/viewAssetInsRem/'+woid
    return this.http.get(url)
  }
  saveAssetInsRem(woid,data:any):Observable<any>{
    const url = this.baseURL+'/createInsRemRow/'+woid
    return this.http.post(url,data)
  }
  removalReason():Observable<any>{
    const url = this.baseURL+'/viewRemReason'
    return this.http.get(url)
  }
  
}
