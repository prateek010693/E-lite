import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeterComplianceService {
 
//------------- global URL for Access Backend API----------------------//
 baseURL ="http://localhost:8080/emmsLite/"
  constructor(private http:HttpClient) { }
  
  //-------------API for View Asset----------------------//
  getAssetAndMeter():Observable<any>{
    console.log('sasasasa')
    const url = this.baseURL+'getAssetLookup'
    return this.http.get(url)
  }
  //-------------End----------------------//
}
