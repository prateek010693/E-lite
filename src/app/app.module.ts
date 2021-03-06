import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import {CommonModule} from '@angular/common'
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import {DatePipe} from '@angular/common'
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { PlanedAssestService } from './services/planed-assest.service';
import { WorkorderService } from './services/workorder.service';
import { TaskLevelComplianceService } from './services/task-level-compliance.service';
import { LoaderService } from './services/loader.service';
import { InterceptorService } from './services/interceptor.service';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guard/auth.guard';
import { AdminLoginComponent } from './admin-login/admin-login.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule, 
    CommonModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      closeButton: true,
      positionClass: 'toast-top-right',
      preventDuplicates: true
    })
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    AdminLoginComponent,
  ],
  
  providers: [PlanedAssestService,WorkorderService,LoaderService,AuthGuard,TaskLevelComplianceService,DatePipe,
  {provide:HTTP_INTERCEPTORS, useClass: InterceptorService, multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
