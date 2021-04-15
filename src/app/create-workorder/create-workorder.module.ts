import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { CreateWorkorderRoutes } from './create-workorder.routing';
import { TaskComplianceComponent } from '../task-compliance/task-compliance.component';
import { MeterComplianceComponent } from '../meter-compliance/meter-compliance.component';
import { ArmingDearmingComponent } from '../arming-dearming/arming-dearming.component';
import { AssestInstallComponent } from '../assest-install/assest-install.component';

import { WorkorderdetailsComponent } from '../workorderdetails/workorderdetails.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CreateWorkorderRoutes),
    FormsModule,
    ChartsModule,
    NgbModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      closeButton: true,
      positionClass: 'toast-top-right',
      preventDuplicates: true
    }),
    ReactiveFormsModule
  ],
  declarations: [
    TaskComplianceComponent,
    MeterComplianceComponent,
    ArmingDearmingComponent,
    AssestInstallComponent,
    WorkorderdetailsComponent
   
  ],
  exports : [RouterModule]
})

export class CreateWorkorderModule {
    constructor(){
        console.log('CreateWorkorderModule')
      }
}
