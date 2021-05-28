import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class FlbService {
  constructor(private http: HttpClient) {}

  baseURL = "http://localhost:8080/emmsLite/flb";
  sorties = "/sorties/";
  postFlight = "/postFlight/";

  /*-------------------------------Sortie API calls-------------------------------------*/
  // To retrieve all the sorties
  getSorties(recordId: any): Observable<any> {
    const url = this.baseURL + this.sorties + "all/" + recordId;
    return this.http.get(url, { observe: "response", responseType: "json" });
  }

  // To create new sortie
  createSortie(recordId: any, sortie: any): Observable<any> {
    const url = this.baseURL + this.sorties + "create/" + recordId;
    return this.http.post(url, sortie, { observe: "response" });
  }

  // To save all sorties
  saveSorties(recordId: any, sorties: Array<any>): Observable<any> {
    const url = this.baseURL + this.sorties + "save/" + recordId;
    return this.http.put(url, sorties, { observe: "response" });
  }

  // Get Sorties with given status
  getSortieNum(status, recordId): Observable<any> {
    const url = this.baseURL + this.sorties + "/num/" + status + "/" + recordId;
    return this.http.get(url, { observe: "response" });
  }
  /*-------------------------------End of Sortie API calls-------------------------------------*/

  /*-------------------------------Post Flight API calls-------------------------------------*/
  getPostFlight(recordId: any): Observable<any> {
    const url = this.baseURL + this.postFlight + "all/" + recordId;
    return this.http.get(url, { observe: "response", responseType: "json" });
  }

  /*-------------------------------End of Post Flight API calls-------------------------------------*/
}
