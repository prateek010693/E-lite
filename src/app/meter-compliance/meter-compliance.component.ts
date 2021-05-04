import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MeterComplianceService } from '../services/meter-compliance.service';

@Component({
  selector: 'app-meter-compliance',
  templateUrl: './meter-compliance.component.html',
  styleUrls: ['./meter-compliance.component.css']
})
export class MeterComplianceComponent implements OnInit {
  meterComplianceForm : FormGroup
  id : any 
  isDisabled : boolean = false;
  index : any =[];
  assetArray : any = []
  meterArray : any = [];
  meterDetails: boolean = false;
  formArrayIndex : any;
  assetRadio : boolean = false
  constructor(private fb : FormBuilder,
    private activatedRoute:ActivatedRoute,
    private bootstrapModel: NgbModal,
    private meterComplianceService:MeterComplianceService,

    ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(param =>{
      this.id = param.id
      console.log('this.id',this.id)
    })
    if(this.id == "null"){
      this.isDisabled=true

    }
    this.meterComplianceForm = this.fb.group({
      workorderNo: '',
      description: '',
      worktype:'',
      woStatus:'',
      meterdetails: this.fb.array([])
                
    })
  }
  addMeterComplianceFormGroup(): FormGroup {
    return this.fb.group({
      asset: [""], 
      description:[""],
      partNo:[""],
      serial:[""],
      buildItem:[""],
      meter:[""],
      meterDescription:[""],
      initialValue:[""],
      finalValue:[""],
      readingDate:[""],
      updatedBy:[""],
      updatedDate:[""],
    })
  }
  getAsset() {
    let count = 0
    var assetData = []
    this.meterComplianceService.getAssetAndMeter().subscribe(data =>{
      data.map(el =>{
        assetData.push({
          "assetnum":el.assetId_assetLookup ? el.assetId_assetLookup : "N/A",
          "description":el.assetDescription_assetLookup ? el.assetDescription_assetLookup : "N/A",
          "partnumber":el.partNumber_meterLookup ? el.partNumber_meterLookup : "N/A",
          "serialnumber":el.serialNum ? el.serialNum : "N/A",
          "builditem":el.buildItem ? el.buildItem : "N/A",
          "indexCount":count++
        })
      })
    })
    return assetData
  }
  getMeter() {
    let count = 0
    var assetData = []
    this.meterComplianceService.getAssetAndMeter().subscribe(data =>{
      data.map(el =>{
        assetData.push({
          "meternum":el.assetNum_meterLookup ? el.assetNum_meterLookup : "N/A",
          "description":el.partDescription_meterLookup ? el.partDescription_meterLookup : "N/A",
          "indexCount":count++
        })
      })
    })
    return assetData
  }
  selectAsset(asset,formArrayIndex) {
    // this.searchvalue = ''
    this.formArrayIndex = formArrayIndex;
    console.log('this.formArrayIndex',this.formArrayIndex)
    this.bootstrapModel.open(asset, { ariaDescribedBy: 'model-basic title' }).result.then((result) => {
      if (result == 'Save click') {
        this.assetSave(this.index)
      }

    });
    this.assetArray=this.getAsset();
    const meterFormGroup = <FormArray> this.meterComplianceForm.get('meterdetails');
    if(meterFormGroup.value[this.formArrayIndex]['asset'] == "" || meterFormGroup.value[this.formArrayIndex]['meter'] == ""){
      this.assetRadio = false
    }
  }
  selectMeter(meter,formArrayIndex) {
    // this.searchvalue = ''
    this.formArrayIndex = formArrayIndex;
    this.bootstrapModel.open(meter, { ariaDescribedBy: 'model-basic title' }).result.then((result) => {
      if (result == 'Save click') {
        this.meterSave(this.index)
      }

    });
    this.meterArray=this.getMeter();
 
  }
  get meterDetailForm(){
    return this.meterComplianceForm.get('meterdetails') as FormArray
  }
  addMeter(){
    this.meterDetailForm.push(this.addMeterComplianceFormGroup())
  }
  assetSave(index) {
    this.index = index
    const meterFormGroup = <FormArray> this.meterComplianceForm.get('meterdetails');
    meterFormGroup.controls[this.formArrayIndex].get('asset').setValue(this.assetArray[this.index].assetnum)
    meterFormGroup.controls[this.formArrayIndex].get('description').setValue(this.assetArray[this.index].description)
    meterFormGroup.controls[this.formArrayIndex].get('partNo').setValue(this.assetArray[this.index].partnumber)
    meterFormGroup.controls[this.formArrayIndex].get('serial').setValue(this.assetArray[this.index].serialnumber)
    meterFormGroup.controls[this.formArrayIndex].get('buildItem').setValue(this.assetArray[this.index].builditem)
  }
  meterSave(index) {
    this.index = index
    console.log('this.index',this.index )
    const meterFormGroup = <FormArray> this.meterComplianceForm.get('meterdetails');
    meterFormGroup.controls[this.formArrayIndex].get('meter').setValue(this.meterArray[this.index].meternum)
    meterFormGroup.controls[this.formArrayIndex].get('meterDescription').setValue(this.meterArray[this.index].description)
  }
  saveMeter(){
    // this.isDisabled=false
    const meterFormGroup = <FormArray> this.meterComplianceForm.get('meterdetails');
    if(meterFormGroup.value[this.formArrayIndex]['asset'] != ""  || meterFormGroup.value[this.formArrayIndex]['meter'] != ""){
      this.assetRadio = true

    }
    else{
      this.assetRadio = false
    }
    
  }
}
