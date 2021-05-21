import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginServiceService } from '../services/login-service.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup
  forgotPasswordForm: FormGroup
  forgotPasswordQuestionForm : FormGroup
  generatePasswordForm: FormGroup
  changePasswordForm : FormGroup
  isSubmitted: boolean = false;
  isGeneratePass: boolean = false;
  loginData: any
  generatepass: any
  isShow: boolean = false;
  isShow1: boolean = false;
  forgotPasswordCheck : boolean = false;
  newPass: boolean = true
  confirmPass: boolean = true
  adminCheck: boolean = false
  reGexBool : boolean = false
  reGex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/)
  constructor(private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private bootstrapModel: NgbModal,
    private loginService: LoginServiceService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      serviceNumber: ['', Validators.required],
      password: ['', Validators.required],

    });
    this.forgotPasswordQuestionForm = this.fb.group({
      petName: ["",Validators.required],
      birthPlace: ["",Validators.required],
      motherTongue: ["",Validators.required],
    
    });
    this.forgotPasswordForm = this.fb.group({
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required],
    })
    this.generatePasswordForm = this.fb.group({
      petName: ['', Validators.required],
      birthPlace: ['', Validators.required],
      motherTongue: ['', Validators.required],
      newPassword: ['', [Validators.required]],
      confirmNewPassword: ['', Validators.required],
    });
    this.changePasswordForm = this.fb.group({
      currentPassword : ['',Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required],
    })

    console.log('this.loginForm', this.loginForm)
    if (localStorage.getItem('userName') != undefined) {
      console.log('dashboard')
      this.router.navigate(['/dashboard']);
    }
    else {
      console.log('login')

      this.router.navigate(['/login']);

    }
  }

  onChecked(e) {
    if (e.target.checked == true) {
      var checkuserId = this.loginForm.value['serviceNumber']
      this.loginService.checkUserAvailability(checkuserId).subscribe(element => {
        console.log('elemet', element)
        //User is not present in the system,pass is null
        if (element.code == 404) {
          this.toastr.error(element.loginStatus)
          console.log("404" + this.isShow + this.isShow1)
          this.uncheck(e)

        }
        //user is present and pass is null
        else if (element.code == 500) {
          this.toastr.warning(element.loginStatus + element.passwordStatus)
          this.isShow1 = true
          this.isShow = true

          //  console.log("500"+ this.isShow + this.isShow1)
        }
        else {
          this.isShow = true;
          console.log("202" + this.isShow + this.isShow1)

        }

      });
    }
    console.log("here " + this.isShow)


  }
  uncheck(e) {
    setTimeout(() => {
      e.target.checked = false
    }, 1000);

  }
  forgotPassword(forgotPass) {
    this.newPass = true
    this.confirmPass = true
    this.forgotPasswordCheck = false
    this.bootstrapModel.open(forgotPass, { ariaDescribedBy: 'model-basic title' }).result.then((result) => {
      console.log('result', result)
      if (result == 'Save click') {
        console.log('forgotPass')
        this.onForgotPassword()
      }
      this.forgotPasswordQuestionForm.reset();
      this.forgotPasswordForm.reset();
      this.isSubmitted = false;

    });

  }
  generatePassword(generatePass) {
    this.newPass = true
    this.confirmPass = true
    this.bootstrapModel.open(generatePass, { ariaDescribedBy: 'model-basic title' }).result.then((result) => {
      console.log('result', result)
      if (result == 'Save click') {
        this.setNewPassword()
      }
      // else{
      //   console.log("inside else")
      //   if(this.generatePasswordForm.value['newPassword'] == this.generatePasswordForm.value['confirmNewPassword']){
      //     this.isGeneratePass = true
      //   }
      // }

      this.generatePasswordForm.reset();
      this.isSubmitted = false;

    });
  }
  changePassword(changePass) {
    this.newPass = true
    this.confirmPass = true
    this.bootstrapModel.open(changePass, { ariaDescribedBy: 'model-basic title' }).result.then((result) => {
      console.log('result', result)
      if (result == 'Save click') {
        this.setchangePassword()
      }
      this.changePasswordForm.reset();
      this.isSubmitted = false;

    });
  }
  loginButton() {
    if (this.loginForm.valid) {
      console.log('this.loginForm++++++++++++', this.loginForm)
      // this.router.navigate(['/dashboard']);]
      this.loginData = {
        "userid": this.loginForm.value['serviceNumber'],
        "password": this.loginForm.value['password']
      }
      console.log('loginData', this.loginData)
      // var username=this.loginForm.value['serviceNumber']
      // var userpassword= this.loginForm.value['password']
      this.loginService.checkUserLogin(this.loginData).subscribe(element => {
        console.log('elemet', element)
        if (element.code == 200) {
          if (this.loginData.userid == 'admin') {
            this.router.navigate(['/admin']);
            this.toastr.success(this.loginData.userid + " Login Succesfully")
          }
          else {
            console.log('dashboard')
            this.router.navigate(['/dashboard']);
            this.toastr.success(this.loginData.userid + " user Login Succesfully")

          }

        }
        else if (element.code == 500) {
          this.toastr.error(element.loginStatus + " please contact administrator")
        }
        else if(element.code == 203){
          this.toastr.error(element.loginStatus)
        }
        else {
          console.log("Invalid User")
          this.toastr.error("Invalid User")
        }
      });

    }
    else {
      this.isSubmitted = true
      console.log('this.loginForm------', this.loginForm)
      console.log("Not valid");

    }

  }
  check(checker) {
    // var reGex = new RegExp(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/)
    if ((this.generatePasswordForm.value['newPassword'] == this.generatePasswordForm.value['confirmNewPassword'])) {
      if (this.generatePasswordForm.valid) {
        this.isGeneratePass = true
        console.log('this.isGeneratePass++++++++++', this.isGeneratePass)
      }
      else if (checker == ('confirmNewPassword' || 'newPassword') && this.generatePasswordForm.invalid) {
        this.isSubmitted = true
        this.toastr.error("All Fields are required")
      }
      
    }
    else if (checker === "confirmNewPassword") {
      this.toastr.error("Passwords does not match")
      this.isGeneratePass = false
    }
    else if(checker == 'newPassword'){
      this.reGexBool = false
      if(this.reGex.test(this.generatePasswordForm.value['newPassword'])){
        this.reGexBool = true
        return true
      }
      else{
        return false
      }
    } 
    else {
      this.isGeneratePass = false
    }
  }
  forgotcheck(checker) {
    // var reGex = new RegExp(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/)
    console.log(checker)
    console.log('this.forgotPasswordForm', this.forgotPasswordForm)
    if ((this.forgotPasswordForm.value['newPassword'] == this.forgotPasswordForm.value['confirmNewPassword'])) {
      if (this.forgotPasswordForm.valid) {
        this.isGeneratePass = true
      }
      else if (checker == ('confirmNewPassword' || 'newPassword') && this.forgotPasswordForm.invalid) {
        this.isSubmitted = true
        this.toastr.error("All Fields are required")
      }
      
    }
    else if (checker === "confirmNewPassword") {
      this.toastr.error("Passwords does not match")
      this.isGeneratePass = false
    }
    else if(checker == 'newPassword'){
      this.reGexBool = false
      if(this.reGex.test(this.forgotPasswordForm.value['newPassword'])){
        this.reGexBool = true
        return true
      }
      else{
        return false
      }
    } 
    else {
      this.isGeneratePass = false
    }
  }
  changecheck(checker) {
    // var reGex = new RegExp(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/)
    console.log(checker)
    console.log('this.changePasswordForm', this.changePasswordForm)
    if ((this.changePasswordForm.value['newPassword'] == this.changePasswordForm.value['confirmNewPassword'])) {
      if (this.changePasswordForm.valid) {
        this.isGeneratePass = true
      }
      else if (checker == ('confirmNewPassword' || 'newPassword') && this.changePasswordForm.invalid) {
        this.isSubmitted = true
        this.toastr.error("All Fields are required")
      }
      
    }
    else if (checker === "confirmNewPassword") {
      this.toastr.error("Passwords does not match")
      this.isGeneratePass = false
    }
    else if(checker == 'newPassword'){
      this.reGexBool = false
      if(this.reGex.test(this.changePasswordForm.value['newPassword'])){
        this.reGexBool = true
        return true
      }
      else{
        return false
      }
    } 
    else {
      this.isGeneratePass = false
    }
  }
  setNewPassword() {
    this.generatepass = {
      "userid" : this.loginForm.value['serviceNumber'],
      "answerOne": this.generatePasswordForm.value['petName'],
      "answerTwo": this.generatePasswordForm.value['birthPlace'],
      "answerThree": this.generatePasswordForm.value['motherTongue'],
      "updatePassword": this.generatePasswordForm.value['confirmNewPassword']
    }
    this.loginService.generatePassword(this.generatepass).subscribe(element => {
      console.log('element', element)
      if (element.code == 202) {
        this.toastr.success(element.status)
        this.isShow1 = false
      }
      else{
        this.toastr.error("Some error Occured")
      }
    });


  }
  adminUser(event) {
    if (event == this.loginForm.value['serviceNumber']) {
      this.adminCheck = true
      console.log('adminCheck', this.adminCheck)
    }
    else {
      this.adminCheck = false
    }
  }
  onQuestionChecked(){
    var validateQuestion = {
      "userid": this.loginForm.value['serviceNumber'],
      "answerOne":this.forgotPasswordQuestionForm.value['petName'],
      "answerTwo":this.forgotPasswordQuestionForm.value['birthPlace'],
      "answerThree":this.forgotPasswordQuestionForm.value['motherTongue']
    }
    
    if (this.forgotPasswordQuestionForm.valid){
      console.log('valid')
      this.loginService.forgotQuestionValidate(validateQuestion).subscribe(element =>{
        if(element.code == 200){
          this.toastr.success(element.status)
          this.forgotPasswordCheck = true
          console.log('this.isShow ',this.forgotPasswordCheck )
        }
        else if(element.code == 500) {
          this.toastr.success(element.status+". Atleast 2  correct answer required.")
          this.forgotPasswordCheck = false
        }
        else{
          this.forgotPasswordCheck = false
          this.toastr.error("Error Occured")
        }
      })
    } 
    else{
      this.isSubmitted = true
      console.log('not valid')
    }
  }
  onForgotPassword(){
    this.forgotPasswordCheck = false
    var newPassword = {
      "userid": this.loginForm.value['serviceNumber'],
      "updatePassword": this.forgotPasswordForm.value['confirmNewPassword']
    }
    this.loginService.forgotPasswordValidate(newPassword).subscribe(element =>{
      if(element.code == 200){
        this.toastr.success(element.passwordStatus)
        // console.log('this.isShow ',this.passwordStatus )
      }
      else{
        this.toastr.error("Error Occured")
      }
    })
  }
  setchangePassword(){
    this.forgotPasswordCheck = false
    var newPassword = {
      "userid": this.loginForm.value['serviceNumber'],
      "password":this.changePasswordForm.value['currentPassword'],
      "updatePassword":this.changePasswordForm.value['confirmNewPassword']
    }
    this.loginService.changePassword(newPassword).subscribe(element =>{
      if(element.code == 202){
        this.toastr.success(element.status)
        // console.log('this.isShow ',this.passwordStatus )
      }
      else{
        this.toastr.error(element.status)
      }
    })
  }
}
