import { ActivatedRoute, Router } from "@angular/router";
import { WorkorderService } from "../services/workorder.service";
import { Component, OnInit, PipeTransform, Pipe } from "@angular/core";
import { NgxPaginationModule } from "ngx-pagination";
import { FormBuilder, FormGroup, FormArray } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
// import {Ng2SearchPipeModule} from 'ng2-search-filter'

import { LoaderService } from "../services/loader.service";
import { PlanedAssestService } from "../services/planed-assest.service";
@Component({
  selector: "app-workorder",
  templateUrl: "./workorder.component.html",
  styleUrls: ["./workorder.component.css"],
})
@Pipe({
  name: "search",
})
export class WorkorderComponent implements OnInit, PipeTransform {
  workorder_form: FormGroup;
  //id: any;
  isShow: boolean;
  index: any = [];
  assetArray: any = [];
  searchvalue: any = "";
  totalrecs: any;
  page = 1;
  editdata: any;
  id: string = "";
  finaldatas: [];

  viewWorkorder: any = [];
  constructor(
    private router: Router,

    private workOrderService: WorkorderService,

    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private bootstrapModel: NgbModal,
    private workorderService: WorkorderService,
    public _loderservice: LoaderService,
    private planedAssestService: PlanedAssestService
  ) {}
  transform(value: any, searchvalue: any): any {
    // console.log("se",searchvalue)
    // console.log("se",value)
    var count = 0;
    if (!value || !searchvalue) {
      console.log("here");
      return value;
    }
    return value.filter((item) => {
      var a =
        item.wo.toLowerCase().includes(searchvalue.toLowerCase()) ||
        item.description.toLowerCase().includes(searchvalue.toLowerCase()) ||
        item.workType.toLowerCase().includes(searchvalue.toLowerCase()) ||
        item.asset.toLowerCase().includes(searchvalue.toLowerCase()) ||
        item.status.toLowerCase().includes(searchvalue.toLowerCase()) ||
        item.pm.toLowerCase().includes(searchvalue.toLowerCase()) ||
        item.pm_desc.toLowerCase().includes(searchvalue.toLowerCase());

      if (a) {
        count++;
      }
      if (count <= 6) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
      console.log("a-------", count, this.isShow);
      return a;
    });
  }

  ngOnInit(): void {
    this.getWorkorder();
    this.workorder_form = this.fb.group({
      recordNumber: [""],
      aircraftNumber: [""],
      dettLocation: [""],
    });
  }
  createWorkorder(id) {
    if (id == "") {
      id = null;
      this.router.navigate([
        "workorder/createworkorder/" + id + "/workorderdetails",
      ]);
    } else {
      this.router.navigate([
        "workorder/createworkorder/" + id + "/workorderdetails",
      ]);
    }
  }

  getWorkorder() {
    this.workOrderService.getWorkOrder().subscribe((element) => {
      var count = 0;
      var sampleData = [];
      element.map((el) => {
        count++;
        console.log("hereel", el);
        sampleData.push({
          wo_id: el.workorder_id ? el.workorder_id : "N/A",
          wo: el.wo_num ? el.wo_num : "N/A",
          description: el.wo_desc ? el.wo_desc : "N/A",
          workType: el.work_type ? el.work_type : "N/A",
          asset: el.asset_num ? el.asset_num : "N/A",
          status: el.wo_status ? el.wo_status : "N/A",
          pm: el.pm ? el.pm : "N/A",
          pm_desc: el.pm_desc ? el.pm_desc : "N/A",
        });
      });
      this.viewWorkorder = sampleData;
      this.totalrecs = count;
      if (count <= 6) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }

      console.log("count is:", count);
      console.log("element+++", element);
    });
  }
  editWorkorder(id) {
    // console.log()
    this.router.navigate([
      "workorder/createworkorder/" + id + "/workorderdetails",
    ]);
  }
  Search() {
    console.log("here", this.searchvalue);
    if ((this.searchvalue = "")) {
      console.log("here1");
      this.getWorkorder;
    } else {
      console.log("here3");
      this.viewWorkorder = this.viewWorkorder.filter((value) => {
        return value.wo.toLowerCase().includes(this.searchvalue.toLowerCase());
      });
    }
  }
}
