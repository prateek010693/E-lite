import { Injectable } from '@angular/core';
import{HttpClient , HttpHeaders, HttpErrorResponse} from '@angular/common/http'
import { Observable,throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetInstallRemoveService {
  baseURL ="http://localhost:8080/emmsLite/"
  constructor(private http:HttpClient) { }
  
}
