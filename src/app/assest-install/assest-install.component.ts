import { Component, OnInit, PipeTransform, Pipe  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { WorkorderService } from '../services/workorder.service';
import { PlanedAssestService } from '../services/planed-assest.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-assest-install',
  templateUrl: './assest-install.component.html',
  styleUrls: ['./assest-install.component.css']
})
@Pipe({
  name: 'search',
})
export class AssestInstallComponent implements OnInit,PipeTransform {
  assetInstallRemoveForm: FormGroup
  removeForm: FormGroup
  installForm: FormGroup
  id: any;
  index:any;
  searchvalue:any;
  closestatus: any;
  isShow: boolean = false
  isShow1: boolean = false
  isShow2: boolean = false
  isDisabled: boolean = false
  buildItemArray : any = []
  JobType = [{ id: "1", value: "12" }, { id: "2", value: "14" }]
  removalReason = [{ id: "1", value: "12" }, { id: "2", value: "14" }]
  buildItem = [{ id: "1", value: "12" }, { id: "2", value: "14" }]
  removalCondition = [{ id: "1", value: "12" }, { id: "2", value: "14" }]
  removalType = [{ id: "1", value: "12" }, { id: "2", value: "14" }]
  constructor(private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private workorderService: WorkorderService,
    private planedAssestService:PlanedAssestService,
    private bootstrapModel: NgbModal,
  ) { }
  transform(value:any, searchvalue: any): any {
    if (!value || !searchvalue) {
      return value;
    }
    return value.filter(item => {
      if(item.assetnum == undefined && item.workType == undefined){
        var filter =item.pm.toLowerCase().includes(searchvalue.toLowerCase()) || item.description.toLowerCase().includes(searchvalue.toLowerCase())
        return filter
      }
      if(item.assetnum == undefined && item.pm == undefined){
        var filter =item.workType.toLowerCase().includes(searchvalue.toLowerCase()) || item.description.toLowerCase().includes(searchvalue.toLowerCase()) 
        return filter
      }
      if(item.workType == undefined && item.pm == undefined){
        var filter =item.assetnum.toLowerCase().includes(searchvalue.toLowerCase()) || item.serialnumber.toLowerCase().includes(searchvalue.toLowerCase()) 
        return filter
      }   
    })
  }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(param => {
      this.id = param.id
      console.log('this.id', this.id)
    })
    this.assetInstallRemoveForm = this.fb.group({
      workorderNo: '',
      description: '',
      worktype: '',
      woStatus: '',
      assetdetails: this.fb.array([])

    })
    this.removeForm = this.fb.group({
      insRemId: '1',
      workorderId: '1',
      jobType: '1',
      buildItem: '1',
      lcn: '1',
      position: '1',
      partNo: '1',
      item: '1',
      removePartNo: '1',
      serialNo: '1',
      assetNo: '1',
      removedBy: '1',
      removalDate: '1',
      removalReason: '1',
      removalCond: '1',
      removalType: '1',
      remarks: '1',

    })
    this.installForm = this.fb.group({
      asset: '1',
      installedDate: '1',
      installedPartNo: '1',
      installedserialNo: '1',
      installedBy: '1',
      installedAssetCond: '1',
    })
    if (this.id == "null") {
      this.isDisabled = true
    }
    else {
      this.getExistingWO()

    }
  }

  addAssetDetailsFormGroup(): FormGroup {
    return this.fb.group({
      JobType: [""],
      Item: [""],
      BuildItem: [""],
      Position: [""],
      PartNo: [""],

    })
  }

  get assetDetailFunction() {
    return this.assetInstallRemoveForm.get('assetdetails') as FormArray
  }
  addNewRow() {
    this.assetDetailFunction.push(this.addAssetDetailsFormGroup())
  }
  addNewLine() {
    this.isShow = true
    this.isShow1 = true
    this.isShow2 = true

    console.log("here", this.isShow, this.isShow1)
  }
  onCheckedRemoved(event: any) {
    console.log(event.target.checked)
    if (event.target.checked == true) {

      this.isShow1 = true
      this.isShow2 = false
      console.log("sho1,sho2", this.isShow1, this.isShow2)
    }
    else {
      this.isShow2 = true
      this.isShow1 = true
    }

  }
  onCheckedInstalled(event: any) {
    if (event.target.checked == true) {
      this.isShow2 = true
      this.isShow1 = false
      console.log("sho1,sho2", this.isShow1, this.isShow2)

    }
    else {
      this.isShow2 = true
      this.isShow1 = true
    }

  }
  getExistingWO() {
    console.log('this.id++++', this.id)
    this.workorderService.getExistingWO(this.id).subscribe(data => {
      console.log('data', data)


      //this.date = (this.dataPipe.transform(data.closure_date,'yyyy-MM-dd') != null) ?  this.dataPipe.transform(data.closure_date,'yyyy-MM-dd') : "N/A"
      this.assetInstallRemoveForm.controls['workorderNo'].setValue(data.wo_num ? data.wo_num : "N/A")
      this.assetInstallRemoveForm.controls['woStatus'].setValue(data.wo_status ? data.wo_status : "N/A")
      this.assetInstallRemoveForm.controls['description'].setValue(data.wo_desc ? data.wo_desc : "N/A")
      this.assetInstallRemoveForm.controls['worktype'].setValue(data.work_type ? data.work_type : "N/A")

      this.closestatus = this.assetInstallRemoveForm.get('woStatus').value
      console.log("closestatu", this.closestatus)
      if (this.closestatus == 'CLOSE') {
        this.disabler()

      }
    })
  }
  disabler() {
    console.log("inside disabler")
    this.isDisabled = true
    this.closestatus = true
  }
  open(asset) {
    this.searchvalue = ''
    this.bootstrapModel.open(asset, { ariaDescribedBy: 'model-basic title' }).result.then((result) => {
      console.log('resultBuildItem', result)
      if (result == 'Save click') {
        //this.assetSave(this.index)
      }

    });
    this.buildItemArray=this.getAsset();
    
  }
  rReason(asset) {
    this.searchvalue = ''
    this.bootstrapModel.open(asset, { ariaDescribedBy: 'model-basic title' }).result.then((result) => {
      console.log('resultrReason', result)
      if (result == 'Save click') {
        //this.assetSave(this.index)
      }

    });
    this.buildItemArray=this.getAsset();
    
  }
  assetLookup(asset) {
    this.searchvalue = ''
    this.bootstrapModel.open(asset, { ariaDescribedBy: 'model-basic title' }).result.then((result) => {
      console.log('resultasset', result)
      if (result == 'Save click') {
        //this.assetSave(this.index)
      }

    });
    this.buildItemArray=this.getAsset();
    
  }
  assetSave(index) {
    this.index = index
    this.removeForm.controls['assetNo'].setValue(this.buildItemArray[this.index].assetnum)
    this.removeForm.controls['serialNo'].setValue(this.buildItemArray[this.index].serialnumber)
    //this.removeForm.controls['cmItem'].setValue(this.buildItemArray[this.index].cmitem)
  }
  getAsset() {
    let count = 0
    var assetData = []
    this.planedAssestService.getPlannedAsset().subscribe(data =>{
      console.log('data',data)
      data.map(el =>{
        assetData.push({
          "assetnum":el.assetnum ? el.assetnum : "N/A",
          "description":el.description ? el.description : "N/A",
          "status":el.status ? el.status : "N/A",
          "serialnumber":el.serialnum ? el.serialnum : "N/A",
          "cmitem":el.cmitem ? el.cmitem : "N/A",
          "indexCount":count++
        })
      })
    })
    return assetData
  }
  removedSave(){
    var workorderData = { 
      "insRemId":this.removeForm.controls['insRemId'].value,
     "workorderId":this.removeForm.controls['workorderId'].value,
     "jobType":this.removeForm.controls['jobType'].value,
     // status:this.removeForm.controls['woStatus'].value,
     "buildItem":this.removeForm.controls['buildItem'].value,
     "lcn":this.removeForm.controls['lcn'].value,
     "position":this.removeForm.controls['position'].value,
     "partNo":this.removeForm.controls['partNo'].value,
     "item":this.removeForm.controls['item'].value,
     "removePartNo":this.removeForm.controls['removePartNo'].value,
     "serialNo":this.removeForm.controls['serialNo'].value,
     "assetNo":this.removeForm.controls['assetNo'].value,
     "removedBy":this.removeForm.controls['removedBy'].value,
     "removalDate":this.removeForm.controls['removalDate'].value,
     "removalReason":this.removeForm.controls['removalReason'].value,
     "removalCond":this.removeForm.controls['removalCond'].value,
     "removalType":this.removeForm.controls['removalType'].value,
     "remarks":this.removeForm.controls['remarks'].value,
      }
  }
}
