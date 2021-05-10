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

  private handleError(error: HttpErrorResponse): Observable<any> {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.log(error.status);
      console.error("An error occurred:", error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(error);
  }

  // To create new sortie
  createSortie(recordId: any, sortie: any): Observable<any> {
    const url = this.baseURL + "create/" + recordId;
    return this.http.post(url, sortie, { observe: "response" });
  }
}
