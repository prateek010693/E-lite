import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class HeaderService {
  constructor(private http: HttpClient) {}

  getPlannedAssetHeader(): Observable<any> {
    return this.http.get(
      "http://localhost:8080/emmsLite/headers/plannedAsset",
      {
        observe: "response",
        responseType: "json",
      }
    );
  }
}
