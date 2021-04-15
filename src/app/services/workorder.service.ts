import { Injectable } from '@angular/core';
import{HttpClient , HttpHeaders, HttpErrorResponse} from '@angular/common/http'
import { Observable,throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class WorkorderService {

  //------------- global URL for Access Backend API----------------------//
  baseURL ="http://192.168.10.224:8080/emmsLite/"
  constructor(private http:HttpClient) { }

  //-------------API for Get Assest Details----------------------//
  getAssetDetail():Observable<any>{
    const url ="http://192.168.10.67:8080/lookup"
    return this.http.get(url)
  }
  //-------------End----------------------//

  //-------------API for Get Workorder Details----------------------//
  getWorkOrder():Observable<any>{
    const url = this.baseURL+'viewWO'
    return this.http.get(url)
  }
  //-------------End----------------------//

  //-------------API for Edit Workorder Details----------------------//
  editWorkorder(data : any):Observable<any>{
    console.log('data',data)
    const url = this.baseURL+'editWO/'+data.id
    return this.http.put(url,data)
  }
  //-------------End----------------------//

  //-------------API for Existing Workorder Details----------------------//
  getExistingWO(id):Observable<any>{
    const url = this.baseURL+'getWO/'+id
    return this.http.get(url)
  }
  //-------------End----------------------//

  //-------------API for Create Workorder Details----------------------//
  createWO(data : any):Observable<any>{
    console.log('inside service---->data',data)
    const url = this.baseURL+'createWO'
    return this.http.post(url,data)
  }
  //-------------End----------------------//

 //-------------API for Get Workorder Number----------------------//
 getWorkorderNo():Observable<any>{
  const url = this.baseURL+'genWO'
  return this.http.get(url)
}
//-------------End----------------------//

//-------------API for Change Status----------------------//
changeStatus(id,status:any):Observable<any>{
  const url = this.baseURL+'editWO/'+id
  return this.http.put(url,status)
}
//-------------End----------------------//

//-------------API for Get Work Type----------------------//
getWorkType():Observable<any>{
  const url = this.baseURL+'viewWT'
  return this.http.get(url)
}
//-------------End----------------------//

//-------------API for Get PM----------------------//
getPM():Observable<any>{
  const url = this.baseURL+'viewPM'
  return this.http.get(url)
}
//-------------End----------------------//
}
