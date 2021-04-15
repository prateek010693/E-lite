import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

 
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from './loader.service';
@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor{
private requests: HttpRequest<any>[] =[];
removeRequest(req: HttpRequest<any>){
  const i = this.requests.indexOf(req);
  if(i >=0){
    this.requests.splice(i,1);
  }
  this._loaderservice.isLoading.next(this.requests.length > 0);

}
  constructor(private _loaderservice:LoaderService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.requests.push(req);
    console.log("requests-->" + this.requests.length);
    this._loaderservice.isLoading.next(true);
    return Observable.create(observer => {
      const subscription = next.handle(req)
      .subscribe(
        event => {
          if(event instanceof HttpResponse){
            this.removeRequest(req);
            observer.next(event);
          }
        },
        () => {
          this.removeRequest(req);
          observer.complete();
        }
      );
      return () => {
        this.removeRequest(req);
        subscription.unsubscribe();
      }
    });
  }
}
