import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminLayoutRoutes } from "./admin-layout.routing";
import { DashboardComponent } from "../../dashboard/dashboard.component";
import { FlbComponent } from "../../flb/flb.component";
import { PlannedAssetComponent } from "../../planned-asset/planned-asset.component";
import { ChartsModule } from "ng2-charts";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxPaginationModule } from "ngx-pagination";
import { ToastrModule } from "ngx-toastr";
import { SnagreportingComponent } from "../../snagreporting/snagreporting.component";
import { DueListComponent } from "../../due-list/due-list.component";
import { FscComponent } from "../../fsc/fsc.component";
import { SnagreportingdetailsComponent } from "../../snagreportingdetails/snagreportingdetails.component";
import { CreateWorkorderComponent } from "../../create-workorder/create-workorder.component";
import { WorkorderComponent } from "../../workorder/workorder.component";
import { PlannedAssetHeaderComponent } from "../../planned-asset-header/planned-asset-header.component";
// import {Ng2SearchPipeModule} from 'ng2-search-filter'

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ChartsModule,
    NgbModule,
    NgxPaginationModule,
    // Ng2SearchPipeModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      closeButton: true,
      positionClass: "toast-top-right",
      preventDuplicates: true,
    }),
  ],
  declarations: [
    DashboardComponent,
    FlbComponent,
    PlannedAssetComponent,
    SnagreportingComponent,
    DueListComponent,
    FscComponent,
    SnagreportingdetailsComponent,
    WorkorderComponent,
    PlannedAssetHeaderComponent,
    CreateWorkorderComponent,
  ],
  exports: [RouterModule],
})
export class AdminLayoutModule {
  constructor() {
    console.log("AdminLayoutModule");
  }
}
