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

  baseURL = "http://localhost:8080/emmsLite/flb/sorties/";

  // To retrieve all the sorties
  getSorties(recordId: any): Observable<any> {
    const url = this.baseURL + "all/" + recordId;
    return this.http.get(url, { observe: "response", responseType: "json" });
  }

  // To create new sortie
  createSortie(recordId: any, sortie: any): Observable<any> {
    const url = this.baseURL + "create/" + recordId;
    return this.http.post(url, sortie, { observe: "response" });
  }

  // To save all sorties
  saveSorties(recordId: any, sorties: Array<any>): Observable<any> {
    const url = this.baseURL + "save/" + recordId;
    return this.http.put(url, sorties, { observe: "response" });
  }
}
