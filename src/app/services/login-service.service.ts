import { Injectable } from '@angular/core';
import{HttpClient , HttpHeaders, HttpErrorResponse} from '@angular/common/http'
import { Observable,throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  constructor(private http:HttpClient) { }

  //------------- global URL for Access Backend API----------------------//
  baseURL ="http://192.168.10.224:8080/emmsLite/"
  loginData : object ={
    userid:"",
    password : ""
  }
  
  //-------------API for Check User Availbility----------------------//
  checkUserAvailability(userid: any):Observable<any>{
    const url =this.baseURL + "checkUserId/"+ userid
    return this.http.get(url)
  }
  //-------------End----------------------//

  //-------------API for User login----------------------//
  checkUserLogin(loginData : any):Observable<any>{
    const url =this.baseURL+"Login"
    console.log('ssssssss',loginData)
    // localStorage.setItem('userName',loginData.userId)
    // localStorage.setItem('userPassword',loginData.passWord )
    console.log('loginData.userId++++++',loginData['userid'])
    this.loginData ={
      userid : loginData['userid'],
      password : loginData['password']
    }
    if(loginData['userid'] == loginData.userid && loginData['password'] == loginData.password ){
      console.log('local storage ganerated')
      localStorage.setItem('userName',loginData.userid)
      localStorage.setItem('userPassword',loginData.password )
      
    }
    else{
      console.log('loginData.userId-----',loginData.userid)
      console.log('local storage not ganerated')
      console.log('Invalid User')
    }
    return this.http.post(url,loginData)
    
  }
  //-------------End----------------------//

  //-------------API for Generate Password----------------------//
  generatePassword(generatePass : any):Observable<any>{
    const url =this.baseURL + "generatePassword"

    console.log('generatePass',generatePass )
    return this.http.post(url,generatePass)
  }
  //-------------End----------------------//

  //-------------API for Reset Password by admin user----------------------//
  resetDefaultPassword(userid : any):Observable<any>{
    const url =this.baseURL + "resetByAdmin/"+userid
    return this.http.get(url)
  }
  //-------------End----------------------//

  //-------------API for Forgot Question API----------------------//
  forgotQuestionValidate(question : any):Observable<any>{
    const url =this.baseURL + "validateQuestion"
    return this.http.post(url,question)
  }
  //-------------End----------------------//

  //-------------API for Forgot Password API----------------------//
  forgotPasswordValidate(newPassword : any):Observable<any>{
    const url =this.baseURL + "forgetPassword"
    return this.http.post(url,newPassword)
  }
  //-------------End----------------------//

   //-------------API for Forgot Password API----------------------//
   changePassword(changePass : any):Observable<any>{
    const url =this.baseURL + "changePassword"
    return this.http.put(url,changePass)
  }
  //-------------End----------------------//
}
