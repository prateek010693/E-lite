import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
  //-------------End----------------------//\

  //-------------API for Save Meter----------------------//
  saveMeterDetails(wo_id,meterData):Observable<any>{
    console.log('sasasasa')
    const url = this.baseURL+'saveMeterDetails/'+wo_id
    return this.http
    .post(url,meterData,{observe : "response"})
    .pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error('err++++++++++++++',err);

        //Handle the error here

        return throwError(err);    //Rethrow it back to component
      })
    )  
  }
  //-------------End----------------------//

  //-------------API for Get Meter by Workorder Id----------------------//
  
  getMeterByWorkorderId(wo_id):Observable<any>{
    console.log('sasasasa')
    const url = this.baseURL+'getMeterByWorkOrderId/'+wo_id
    return this.http.get(url,{observe : "response"})
  }

   //-------------End----------------------//

   //-------------API for Get Meter by Workorder Id----------------------//
  
  deleteMeterBywometer(wo_meter):Observable<any>{
    console.log('sasasasa')
    const url = this.baseURL+'deleteMeterDetails/'+wo_meter
    return this.http.delete(url,{observe : "response"})
  }

   //-------------End----------------------//
}
