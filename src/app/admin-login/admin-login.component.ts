import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginServiceService } from '../services/login-service.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  userName =  localStorage['userName'];
  adminForm : FormGroup
  isSubmitted: boolean = false;
  constructor(private fb : FormBuilder,
    private loginService: LoginServiceService,
    private toastr : ToastrService) { }

  ngOnInit(): void {
    this.adminForm = this.fb.group({
      serviceNumber : ['',Validators.required]
    })  
  }
  loginButton(serviceNo){
    if(this.adminForm.valid){
      serviceNo = this.adminForm.value['serviceNumber']
      console.log('serviceNo',serviceNo)
      this.loginService.resetDefaultPassword(serviceNo).subscribe(element =>{
        console.log('element',element)
        if(element.code  == 200){
          this.toastr.success(element.status + ' for this Service Number ' + serviceNo)
        }
        else{
          this.toastr.success(element.status)
        }
      })
    }
    else{
      this.isSubmitted = true;
      console.log("Not valid");
    }
  }
}
