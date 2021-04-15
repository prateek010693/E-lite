import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { FlbComponent } from '../../flb/flb.component';
import {PlannedAssetComponent} from '../../planned-asset/planned-asset.component';
import { SnagreportingComponent } from '../../snagreporting/snagreporting.component';
import { DueListComponent } from '../../due-list/due-list.component';
import { FscComponent } from '../../fsc/fsc.component';
import { SnagreportingdetailsComponent } from '../../snagreportingdetails/snagreportingdetails.component';
import { WorkorderComponent } from '../../workorder/workorder.component';
import { CreateWorkorderComponent } from '../../create-workorder/create-workorder.component';
import { AuthGuard } from '../../guard/auth.guard';
import { NavbarComponent } from '../../components/navbar/navbar.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'workorder', component: WorkorderComponent },
    { path: 'flb', component: FlbComponent },
    { path: 'plannedasset', component: PlannedAssetComponent },
    { path: 'snagreporting', component: SnagreportingComponent },
    { path: 'duelist', component: DueListComponent },
    { path: 'fsc', component: FscComponent },
    { path: 'snagreporting/snagreportingdetails/:id', component: SnagreportingdetailsComponent },
 
    { path: 'workorder/createworkorder/:id',
     component: CreateWorkorderComponent,
     children: [
        {
          path: '',
          loadChildren: '../../create-workorder/create-workorder.module#CreateWorkorderModule'
        }] 
    },
   
];
