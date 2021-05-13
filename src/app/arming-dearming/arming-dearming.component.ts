import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { WorkorderService } from '../services/workorder.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-arming-dearming',
  templateUrl: './arming-dearming.component.html',
  styleUrls: ['./arming-dearming.component.css']
})
export class ArmingDearmingComponent implements OnInit {
  armingDearmingForm : FormGroup
  id : any;
  searchvalue : any
  closestatus:any
  isDisabled : boolean = false
  hpBuildItem = []
  gigNo =[]

  constructor(private fb : FormBuilder,
    private activatedRoute:ActivatedRoute,
    private workorderService: WorkorderService,
    private bootstrapModel: NgbModal,
    ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(param =>{
      this.id = param.id
      console.log('this.id',this.id)
    })
    if(this.id == "null"){
      this.isDisabled=true

    }
    else{
      this.getExistingWO()
    }
    this.armingDearmingForm = this.fb.group({
      workorderNo: '',
      description: '',
      worktype:'',
      woStatus:'',
      armamentdetails: this.fb.array([])
                
    })
  }
  addArmingDearmingFormGroup(): FormGroup {
    return this.fb.group({
      hardPointBuildItem:[""],
              stationNo:[""],
              armamentPosition:[""],
              armamentItem:[""],
              description:[""],
              partNo:[""],
              serial:[""],
              lotNo:[""],
              currentQuantity:[""],
              loadQuantity:[""],
              unloadQuantity:[""],
              evaluatedQuantity:[""],
              remarks:[""],
              
})
  }
  get ArmingDearminForm(){
    return this.armingDearmingForm.get('armamentdetails') as FormArray
  }
  addArmament(){
    
    this.ArmingDearminForm.push(this.addArmingDearmingFormGroup())
  }
  selectGig(event){
    this.searchvalue = ''
    this.bootstrapModel.open(event, { ariaDescribedBy: 'model-basic title' }).result.then((result) => {
      console.log('resultBuildItem', result)
      if (result == 'Save click') {
        //this.assetSave(this.index)
      }

    });
    this.gigNo = this.getGigNo();

    
  }
  getGigNo(){
    let count = 0
    var assetData = []
    // this.meterComplianceService.getAssetAndMeter().subscribe(data => {
    //   console.log('dataofasset', data)
    //   data.map(el => {
    //     assetData.push({
    //       "assetnum": el.assetId_assetLookup ? el.assetId_assetLookup : "N/A",
    //       "description": el.assetDescription_assetLookup ? el.assetDescription_assetLookup : "N/A",
    //       "meterdescription": el.partDescription_meterLookup ? el.partDescription_meterLookup : "N/A",
    //       "status": el.statusString ? el.statusString : "N/A",
    //       "serialnumber": el.serialNum ? el.serialNum : "N/A",
    //       "position": el.position ? el.position : "N/A",
    //       "lcn": el.lcn ? el.lcn : "N/A",
    //       "assetNum_meterLookup": el.assetNum_meterLookup ? el.assetNum_meterLookup : "N/A",
    //       "cmitem": el.partNumber_meterLookup ? el.partNumber_meterLookup : "N/A",
    //       "buildItem": el.buildItem ? el.buildItem : "N/A",
    //       "indexCount": count++
    //     })
    //   })
    // })
    return assetData
  }

  selectBuildItem(event){
    this.searchvalue = ''
    this.bootstrapModel.open(event, { ariaDescribedBy: 'model-basic title' }).result.then((result) => {
      console.log('resultBuildItem', result)
      if (result == 'Save click') {
        //this.assetSave(this.index)
      }

    });
    this.hpBuildItem = this.getBuildItem();

  }
  getBuildItem(){
    let count = 0
    var assetData = []
    // this.meterComplianceService.getAssetAndMeter().subscribe(data => {
    //   console.log('dataofasset', data)
    //   data.map(el => {
    //     assetData.push({
    //       "assetnum": el.assetId_assetLookup ? el.assetId_assetLookup : "N/A",
    //       "description": el.assetDescription_assetLookup ? el.assetDescription_assetLookup : "N/A",
    //       "meterdescription": el.partDescription_meterLookup ? el.partDescription_meterLookup : "N/A",
    //       "status": el.statusString ? el.statusString : "N/A",
    //       "serialnumber": el.serialNum ? el.serialNum : "N/A",
    //       "position": el.position ? el.position : "N/A",
    //       "lcn": el.lcn ? el.lcn : "N/A",
    //       "assetNum_meterLookup": el.assetNum_meterLookup ? el.assetNum_meterLookup : "N/A",
    //       "cmitem": el.partNumber_meterLookup ? el.partNumber_meterLookup : "N/A",
    //       "buildItem": el.buildItem ? el.buildItem : "N/A",
    //       "indexCount": count++
    //     })
    //   })
    // })
    return assetData
  }
  getExistingWO() {
    console.log('this.id++++', this.id)
    this.workorderService.getExistingWO(this.id).subscribe(data => {
      console.log('workorderdata', data)


      //this.date = (this.dataPipe.transform(data.closure_date,'yyyy-MM-dd') != null) ?  this.dataPipe.transform(data.closure_date,'yyyy-MM-dd') : "N/A"
      this.armingDearmingForm.controls['workorderNo'].setValue(data.wo_num ? data.wo_num : "N/A")
      this.armingDearmingForm.controls['woStatus'].setValue(data.wo_status ? data.wo_status : "N/A")
      this.armingDearmingForm.controls['description'].setValue(data.wo_desc ? data.wo_desc : "N/A")
      this.armingDearmingForm.controls['worktype'].setValue(data.work_type ? data.work_type : "N/A")

      this.closestatus = this.armingDearmingForm.get('woStatus').value
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

}
