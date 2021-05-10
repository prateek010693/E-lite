import { Component, OnInit, PipeTransform, Pipe } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { WorkorderService } from "../services/workorder.service";
import { AssetInstallRemoveService } from "../services/asset-install-remove.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MeterComplianceService } from "../services/meter-compliance.service";

@Component({
  selector: "app-assest-install",
  templateUrl: "./assest-install.component.html",
  styleUrls: ["./assest-install.component.css"],
})
@Pipe({
  name: "search",
})
export class AssestInstallComponent implements OnInit, PipeTransform {
  assetInstallRemoveForm: FormGroup;
  removeForm: FormGroup;
  installForm: FormGroup;
  id: any;
  index: any;
  searchvalue: any;
  closestatus: any;
  isShow: boolean = false;
  installedsave: boolean = false;
  removedsave: boolean = false;
  isSubmitted: boolean = false;
  isSubmitted1: boolean = false;
  isShow1: boolean = false;
  isShow2: boolean = false;
  isDisabled: boolean = false;
  buildItemArray: any = [];
  JobType = [
    { id: "Install", value: "Install" },
    { id: "Remove", value: "Remove" },
    { id: "Install & Remove", value: "Install & Remove" },
  ];
  removalReason = [];
  buildItem = [
    { id: "1", value: "12" },
    { id: "2", value: "14" },
  ];
  removalCondition = [
    { id: "CAT A", value: "CAT A" },
    { id: "CAT B", value: "CAT A" },
    { id: "CAT C", value: "CAT C" },
    { id: "CAT D", value: "CAT D" },
  ];
  removalType = [
    { id: "Scheduled", value: "Scheduled" },
    { id: "Unscheduled", value: "Unscheduled" },
  ];
  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private workorderService: WorkorderService,
    private meterComplianceService: MeterComplianceService,
    private assetInstallRemoveService: AssetInstallRemoveService,
    private bootstrapModel: NgbModal
  ) {}
  transform(value: any, searchvalue: any): any {
    if (!value || !searchvalue) {
      return value;
    }
    return value.filter((item) => {
      if (item.installedBy == undefined) {
        var filter =
          item.assetnum.toLowerCase().includes(searchvalue.toLowerCase()) ||
          item.description.toLowerCase().includes(searchvalue.toLowerCase());
        return filter;
      }
      if (item.assetnum == undefined && item.pm == undefined) {
        var filter =
          item.workType.toLowerCase().includes(searchvalue.toLowerCase()) ||
          item.description.toLowerCase().includes(searchvalue.toLowerCase());
        return filter;
      }
      if (item.workType == undefined && item.pm == undefined) {
        var filter =
          item.assetnum.toLowerCase().includes(searchvalue.toLowerCase()) ||
          item.serialnumber.toLowerCase().includes(searchvalue.toLowerCase());
        return filter;
      }
    });
  }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
      this.id = param.id;
      console.log("this.id", this.id);
    });
    this.assetInstallRemoveForm = this.fb.group({
      workorderNo: [""],
      description: [""],
      worktype: [""],
      woStatus: [""],
      assetdetails: this.fb.array([]),
    });
    this.removeForm = this.fb.group({
      insRemId: [""],
      workorderId: [""],
      jobType: ["", Validators.required],
      buildItem: ["", Validators.required],
      lcn: [""],
      position: [""],
      partNo: [""],
      item: [""],
      removePartNo: [""],
      serialNo: [""],
      assetNo: [""],
      removedBy: [""],
      removalDate: [""],
      removalReason: ["", Validators.required],
      removalCond: ["", Validators.required],
      removalType: ["", Validators.required],
      remarks: [""],
    });

    this.installForm = this.fb.group({
      insRemId: [""],
      insAssetNo: ["", Validators.required],
      remInsDate: [""],
      insPartNo: [""],
      insSerialNo: [""],
      installedBy: [""],
      remarks: [""],
      insCond: [""],
    });
    if (this.id == "null") {
      this.isDisabled = true;
    } else {
      this.getExistingWO();
      this.fetchExistingAsset();
    }
  }

  addAssetDetailsFormGroup(): FormGroup {
    return this.fb.group({
      JobType: [""],
      Item: [""],
      BuildItem: [""],
      Position: [""],
      PartNo: [""],
    });
  }

  get assetDetailFunction() {
    return this.assetInstallRemoveForm.get("assetdetails") as FormArray;
  }
  addNewRow() {
    this.assetDetailFunction.push(this.addAssetDetailsFormGroup());
  }
  addNewLine() {
    this.isShow = true;
    this.isShow1 = true;
    this.isShow2 = true;
    document.getElementById("IRdiv").scrollIntoView();
    console.log("here", this.isShow, this.isShow1);
  }
  onCheckedRemoved(event: any) {
    console.log(event.target.checked);
    if (event.target.checked == true) {
      this.isShow1 = true;
      this.isShow2 = false;
      this.removedsave = true;
      console.log("sho1,sho2", this.isShow1, this.isShow2);
    } else {
      this.isShow2 = true;
      this.isShow1 = true;
      this.removedsave = false;
      this.isSubmitted = false;
    }
  }
  onCheckedInstalled(event: any) {
    if (event.target.checked == true) {
      this.isShow2 = true;
      this.isShow1 = false;
      this.installedsave = true;
      console.log("sho1,sho2", this.isShow1, this.isShow2);
    } else {
      this.isShow2 = true;
      this.isShow1 = true;
      this.installedsave = false;
      this.isSubmitted1 = false;
    }
  }
  getExistingWO() {
    console.log("this.id++++", this.id);
    this.workorderService.getExistingWO(this.id).subscribe((data) => {
      console.log("workorderdata", data);

      //this.date = (this.dataPipe.transform(data.closure_date,'yyyy-MM-dd') != null) ?  this.dataPipe.transform(data.closure_date,'yyyy-MM-dd') : "N/A"
      this.assetInstallRemoveForm.controls["workorderNo"].setValue(
        data.wo_num ? data.wo_num : "N/A"
      );
      this.assetInstallRemoveForm.controls["woStatus"].setValue(
        data.wo_status ? data.wo_status : "N/A"
      );
      this.assetInstallRemoveForm.controls["description"].setValue(
        data.wo_desc ? data.wo_desc : "N/A"
      );
      this.assetInstallRemoveForm.controls["worktype"].setValue(
        data.work_type ? data.work_type : "N/A"
      );

      this.closestatus = this.assetInstallRemoveForm.get("woStatus").value;
      console.log("closestatu", this.closestatus);
      if (this.closestatus == "CLOSE") {
        this.disabler();
      }
    });
  }
  disabler() {
    console.log("inside disabler");
    this.isDisabled = true;
    this.closestatus = true;
  }
  open(asset) {
    this.searchvalue = "";
    this.bootstrapModel
      .open(asset, { ariaDescribedBy: "model-basic title" })
      .result.then((result) => {
        console.log("resultBuildItem", result);
        if (result == "Save click") {
          //this.assetSave(this.index)
        }
      });
    this.buildItemArray = this.getAsset();
  }
  rReason(asset) {
    this.searchvalue = "";
    this.bootstrapModel
      .open(asset, { ariaDescribedBy: "model-basic title" })
      .result.then((result) => {
        console.log("resultrReason", result);
        if (result == "Save click") {
          //this.assetSave(this.index)
        }
      });
    this.removalReason = this.getRemReason();
  }
  iAsset(asset) {
    this.searchvalue = "";
    this.bootstrapModel
      .open(asset, { ariaDescribedBy: "model-basic title" })
      .result.then((result) => {
        console.log("resultrReason", result);
        if (result == "Save click") {
          //this.assetSave(this.index)
        }
      });
    this.buildItemArray = this.getAsset();
  }
  assetSave(index) {
    this.index = index;
    this.removeForm.controls["assetNo"].setValue(
      this.buildItemArray[this.index].assetnum
    );
    this.removeForm.controls["buildItem"].setValue(
      this.buildItemArray[this.index].buildItem
    );
    this.removeForm.controls["serialNo"].setValue(
      this.buildItemArray[this.index].serialnumber
    );
    this.removeForm.controls["lcn"].setValue(
      this.buildItemArray[this.index].lcn
    );
    this.removeForm.controls["position"].setValue(
      this.buildItemArray[this.index].position
    );
    this.removeForm.controls["partNo"].setValue(
      this.buildItemArray[this.index].cmitem
    );
  }
  rassetSave(index) {
    this.index = index;
    this.removeForm.controls["removalReason"].setValue(
      this.removalReason[this.index].desc
    );

    //this.removeForm.controls['cmItem'].setValue(this.buildItemArray[this.index].cmitem)
  }
  iassetSave(index) {
    this.index = index;
    this.installForm.controls["insAssetNo"].setValue(
      this.buildItemArray[this.index].assetnum
    );
    //this.installForm.controls['remInsDate'].setValue(this.buildItemArray[this.index].serialnumber)
    this.installForm.controls["insSerialNo"].setValue(
      this.buildItemArray[this.index].serialnumber
    );
    this.installForm.controls["insPartNo"].setValue(
      this.buildItemArray[this.index].cmitem
    );
    //this.installForm.controls['lcn'].setValue(this.buildItemArray[this.index].lcn)
    //this.installForm.controls['position'].setValue(this.buildItemArray[this.index].position)
    //this.removeForm.controls['cmItem'].setValue(this.buildItemArray[this.index].cmitem)
  }
  getAsset() {
    let count = 0;
    var assetData = [];
    this.meterComplianceService.getAssetAndMeter().subscribe((data) => {
      console.log("dataofasset", data);
      data.map((el) => {
        assetData.push({
          assetnum: el.assetId_assetLookup ? el.assetId_assetLookup : "N/A",
          description: el.assetDescription_assetLookup
            ? el.assetDescription_assetLookup
            : "N/A",
          meterdescription: el.partDescription_meterLookup
            ? el.partDescription_meterLookup
            : "N/A",
          status: el.statusString ? el.statusString : "N/A",
          serialnumber: el.serialNum ? el.serialNum : "N/A",
          position: el.position ? el.position : "N/A",
          lcn: el.lcn ? el.lcn : "N/A",
          assetNum_meterLookup: el.assetNum_meterLookup
            ? el.assetNum_meterLookup
            : "N/A",
          cmitem: el.partNumber_meterLookup ? el.partNumber_meterLookup : "N/A",
          buildItem: el.buildItem ? el.buildItem : "N/A",
          indexCount: count++,
        });
      });
    });
    return assetData;
  }
  getRemReason() {
    let count = 0;
    var assetData = [];
    this.assetInstallRemoveService.removalReason().subscribe((data) => {
      console.log("dataofremreason", data);
      data.map((el) => {
        assetData.push({
          alndomainId: el.alndomainId ? el.alndomainId : "N/A",
          domainId: el.domainId ? el.domainId : "N/A",
          value: el.value ? el.value : "N/A",
          desc: el.desc ? el.desc : "N/A",
          siteId: el.siteId ? el.siteId : "N/A",
          orgId: el.orgId ? el.orgId : "N/A",
          indexCount: count++,
        });
      });
    });
    return assetData;
  }
  removedSave() {
    if (this.removeForm.valid) {
      var workorderData = {
        insRemId: this.removeForm.controls["insRemId"].value,
        workorderId: this.removeForm.controls["workorderId"].value,
        jobType: this.removeForm.controls["jobType"].value,
        buildItem: this.removeForm.controls["buildItem"].value,
        lcn: this.removeForm.controls["lcn"].value,
        position: this.removeForm.controls["position"].value,
        partNo: this.removeForm.controls["partNo"].value,
        item: this.removeForm.controls["item"].value,
        removePartNo: this.removeForm.controls["removePartNo"].value,
        serialNo: this.removeForm.controls["serialNo"].value,
        assetNo: this.removeForm.controls["assetNo"].value,
        removedBy: this.removeForm.controls["removedBy"].value,
        removalDate: this.removeForm.controls["removalDate"].value,
        removalReason: this.removeForm.controls["removalReason"].value,
        removalCond: this.removeForm.controls["removalCond"].value,
        removalType: this.removeForm.controls["removalType"].value,
        remarks: this.removeForm.controls["remarks"].value,
      };
      this.assetInstallRemoveService
        .saveAssetInsRem(this.id, workorderData)
        .subscribe((data) => {
          console.log("dataofnewasset", data);

          const abc = this.fb.group({
            insRemId: data.insRemId,
            workorderId: data.workorderId,
            jobType: data.jobType,
            buildItem: data.buildItem,
            lcn: data.lcn,
            position: data.position,
            partNo: data.partNo,
            item: data.item,
            removePartNo: data.removePartNo,
            serialNo: data.serialNo,
            assetNo: data.assetNo,
            removedBy: data.removedBy,
            removalDate: data.removalDate,
            removalReason: data.removalReason,
            removalCond: data.removalCond,
            removalType: data.removalType,
            remarks: data.remarks,
          });

          this.assetDetailFunction.push(abc);

          this.reset();
        });
      this.isSubmitted = false;
    } else {
      this.isSubmitted = true;
    }
  }

  installedSave() {
    if (this.installForm.valid) {
      var workorderData = {
        insRemId: this.installForm.controls["insRemId"].value,
        insAssetNo: this.installForm.controls["insAssetNo"].value,
        remInsDate: this.installForm.controls["remInsDate"].value,
        insPartNo: this.installForm.controls["insPartNo"].value,
        insSerialNo: this.installForm.controls["insSerialNo"].value,
        installedBy: this.installForm.controls["installedBy"].value,
        remarks: this.installForm.controls["remarks"].value,
        insCond: this.installForm.controls["insCond"].value,
      };
      this.assetInstallRemoveService
        .saveAssetInsRem(this.id, workorderData)
        .subscribe((data) => {
          console.log("dataofnewasseti", data);

          const abc = this.fb.group({
            insRemId: data.insRemId,
            insAssetNo: data.insAssetNo,
            remInsDate: data.remInsDate,
            insPartNo: data.insPartNo,
            insSerialNo: data.insSerialNo,
            installedBy: data.installedBy,
            remarks: data.remarks,
            insCond: data.insCond,
            jobType: data.jobType,
            item: data.item,
            buildItem: data.buildItem,
            position: data.position,
          });

          this.assetDetailFunction.push(abc);

          this.reset();
        });
      this.isSubmitted1 = false;
    } else {
      this.isSubmitted1 = true;
    }
  }

  fetchExistingAsset() {
    const formArray = new FormArray([]);
    this.assetInstallRemoveService
      .fetchExistingasset(this.id)
      .subscribe((data) => {
        console.log("dataofexistingasset", data);
        data.map((el) => {
          formArray.push(
            this.fb.group({
              insRemId: el.insRemId,
              workorderId: el.workorderId,
              jobType: el.jobType,
              buildItem: el.buildItem,
              lcn: el.lcn,
              position: el.position,
              partNo: el.partNo,
              item: el.item,
              removePartNo: el.removePartNo,
              serialNo: el.serialNo,
              assetNo: el.assetNo,
              removedBy: el.removedBy,
              removalDate: el.removalDate,
              removalReason: el.removalReason,
              removalCond: el.removalCond,
              removalType: el.removalType,
              remarks: el.remarks,
            })
          );
          this.assetInstallRemoveForm.setControl("assetdetails", formArray);
        });
        console.log("alreadyassinged", formArray);
      });
  }
  reset() {
    this.isShow = false;
    this.installedsave = false;
    this.removedsave = false;
    this.isShow1 = false;
    this.isShow2 = false;
  }
}
