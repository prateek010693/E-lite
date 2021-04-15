import { Routes } from '@angular/router';
import { TaskComplianceComponent } from '../task-compliance/task-compliance.component';
import { MeterComplianceComponent } from '../meter-compliance/meter-compliance.component';
import { ArmingDearmingComponent } from '../arming-dearming/arming-dearming.component';
import { AssestInstallComponent } from '../assest-install/assest-install.component';
import { WorkorderdetailsComponent } from '../workorderdetails/workorderdetails.component';
export const CreateWorkorderRoutes: Routes = [
    
    { path: 'workorderdetails', component: WorkorderdetailsComponent },
    { path: 'tasklevelcompliance', component: TaskComplianceComponent },
    { path: 'metercompliance', component: MeterComplianceComponent },
    { path: 'armingdearming', component: ArmingDearmingComponent },
    { path: 'assestinstallremove', component: AssestInstallComponent },
    
];
