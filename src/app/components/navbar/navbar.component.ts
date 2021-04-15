import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { Router } from '@angular/router';
import Chart from 'chart.js';
import { LoginServiceService } from '../../services/login-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    // userName: string = "Prateek"
    userName =  localStorage['userName'];
    isShow : boolean = false
    constructor(private router: Router,private loginService: LoginServiceService,) {}

    ngOnInit(){
      if(this.userName == undefined || this.loginService.loginData['userid'] == ""){
        this.isShow = true;
      }
    }
    logout(){
      if(localStorage.removeItem('userName') == undefined && localStorage.removeItem('userPassword')== undefined){
        this.router.navigate(['/login'])
      }     
    }
}
