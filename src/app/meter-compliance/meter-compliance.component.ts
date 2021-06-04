import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MeterComplianceService } from '../services/meter-compliance.service';
import { WorkorderService } from '../services/workorder.service';

@Component({
  selector: 'app-meter-compliance',
  templateUrl: './meter-compliance.component.html',
  styleUrls: ['./meter-compliance.component.css']
})
export class MeterComplianceComponent implements OnInit {
  meterComplianceForm: FormGroup
  id: any
  isDisabled: boolean = false;
  index: any = [];
  assetArray: any = []
  meterArray: any = [];
  formArrayIndex: any;
  assetRadio: boolean = false;
  assetAndMeterLookup: boolean = true
  savedMeterArray: any = [];
  isdisable: boolean[] = []
  userid: string = localStorage.getItem("userName");
  isSubmitted: boolean = false;
  meterType : string
  // meterType : string = "characterstic";
  // meterType : string = "continous"
  // meterType: string = "gauge"
  guageflag: boolean = false;
  charactersticflag: boolean = false;
  continousflag: boolean = false;
  reGexDecimal = new RegExp(/^\d*(\.\d{0,2})?$/);
  reGexTime = new RegExp(/^(?:(?:(\d*):)?([0-5]?\d):)?([0-5]?\d)(?:\.(\d+))?$/);
  reGexBoolInitialGuage: boolean[] = [];
  reGexBoolFinalGuage: boolean[] = [];
  reGexBoolInitialCon : boolean[] = []
  reGexBoolFinalCon : boolean[] = []
  constructor(private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private bootstrapModel: NgbModal,
    private meterComplianceService: MeterComplianceService,
    private workorderService: WorkorderService,
    private toastr: ToastrService,

  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(param => {
      this.id = param.id
      console.log('this.id', this.id)
    })
    if (this.id == "null") {
      this.isDisabled = true
    }
    else {
      this.getExistingWO()
      this.getMeterByWorkorderId()
    }
    this.meterComplianceForm = this.fb.group({
      workorderNo: '',
      description: '',
      worktype: '',
      woStatus: '',
      assetno: [""],
      assetdec: [""],
      meterdetails: this.fb.array([])

    })
    console.log('userid', this.userid)
  }

  addMeterComplianceFormGroup(): FormGroup {
    return this.fb.group({
      wometerId: [""],
      asset: ["", Validators.required],
      description: [""],
      partNo: [""],
      serial: [""],
      buildItem: [""],
      meter: ["", Validators.required],
      meterDescription: [""],
      // initialValueChar: ["", Validators.required],
      // finalValueChar: ["", Validators.required],
      // initialValueCon: ["", Validators.required],
      // finalValueCon: ["", Validators.required],
      initialValue: ["",Validators.required],
      finalValue: ["",Validators.required],
      // initialValueGuage: ["", Validators.required],
      // finalValueGuage: ["", Validators.required],
      readingDate: ["", Validators.required],
      updatedBy: [this.userid],
      updatedDate: [""],
    })
  }
  getExistingWO() {
    console.log('this.id++++', this.id)
    this.workorderService.getExistingWO(this.id).subscribe(data => {
      console.log('data', data)
      if (data.wo_status == "CAN" || data.wo_status == "CLOSE") {
        this.isDisabled = true
      }
      //this.date = (this.dataPipe.transform(data.closure_date,'yyyy-MM-dd') != null) ?  this.dataPipe.transform(data.closure_date,'yyyy-MM-dd') : "N/A"
      this.meterComplianceForm.controls['workorderNo'].setValue(data.wo_num ? data.wo_num : "N/A")
      this.meterComplianceForm.controls['woStatus'].setValue(data.wo_status ? data.wo_status : "N/A")
      this.meterComplianceForm.controls['description'].setValue(data.wo_desc ? data.wo_desc : "N/A")
      this.meterComplianceForm.controls['worktype'].setValue(data.work_type ? data.work_type : "N/A")
      this.meterComplianceForm.controls['assetno'].setValue(data.asset_num ? data.asset_num : "N/A")
      this.meterComplianceForm.controls['assetdec'].setValue(data.asset_desc ? data.asset_desc : "N/A")
    })
  }
  getAsset() {
    let count = 0
    var assetData = []
    this.meterComplianceService.getAssetAndMeter().subscribe(data => {
      data.map(el => {
        assetData.push({
          "assetnum": el.assetId_assetLookup ? el.assetId_assetLookup : "N/A",
          "description": el.assetDescription_assetLookup ? el.assetDescription_assetLookup : "N/A",
          "partnumber": el.partNumber_meterLookup ? el.partNumber_meterLookup : "N/A",
          "serialnumber": el.serialNum ? el.serialNum : "N/A",
          "builditem": el.buildItem ? el.buildItem : "N/A",
          "indexCount": count++
        })
      })
    })
    return assetData
  }
  getMeter(assetNum) {
  console.log('assetnum='+assetNum)
    let count = 0
    var assetData = []
    this.meterComplianceService.getMeterLookUp(assetNum).subscribe(data => {
      data.map(el => {
        assetData.push({
          "meternum": el.meterName ? el.meterName : "N/A",
          "description": el.meterDescription ? el.meterDescription : "N/A",
          "indexCount": count++
        })
      })
    })
    return assetData
  }
  selectAsset(asset, formArrayIndex) {
    // this.searchvalue = ''
    this.formArrayIndex = formArrayIndex;
    console.log('this.formArrayIndex', this.formArrayIndex)
    this.bootstrapModel.open(asset, { ariaDescribedBy: 'model-basic title' }).result.then((result) => {
      if (result == 'Save click') {
        this.assetSave(this.index)
      }

    });
    this.assetArray = this.getAsset();
    const meterFormGroup = <FormArray>this.meterComplianceForm.get('meterdetails');
    if (meterFormGroup.value[this.formArrayIndex]['asset'] == "" || meterFormGroup.value[this.formArrayIndex]['meter'] == "") {
      this.assetRadio = false
    }
  }
  selectMeter(meter, formArrayIndex,asset) {
 
    // this.searchvalue = ''
    this.formArrayIndex = formArrayIndex;
    this.bootstrapModel.open(meter, { ariaDescribedBy: 'model-basic title' }).result.then((result) => {
      if (result == 'Save click') {
        this.meterSave(this.index)
      }

    });

    const meterFormGroup = <FormArray>this.meterComplianceForm.get('meterdetails');
   console.log('assetNum=',meterFormGroup.value[this.formArrayIndex]['asset'])
   //meterFormGroup.controls[this.formArrayIndex].value('asset');
// meterFormGroup.value[[this.formArrayIndex]['asset']]

    this.meterArray = this.getMeter(meterFormGroup.value[this.formArrayIndex]['asset']);

  }
  initialCharactersticMeter(initialCharacterstic, formArrayIndex) {
    // this.searchvalue = ''
    this.formArrayIndex = formArrayIndex;
    this.bootstrapModel.open(initialCharacterstic, { ariaDescribedBy: 'model-basic title' }).result.then((result) => {
      if (result == 'Save click') {
        // this.meterSave(this.index)
      }

    });
    // this.meterArray = this.getMeter();

  }
  finalCharactersticMeter(finalCharacterstic, formArrayIndex) {
    // this.searchvalue = ''
    this.formArrayIndex = formArrayIndex;
    this.bootstrapModel.open(finalCharacterstic, { ariaDescribedBy: 'model-basic title' }).result.then((result) => {
      if (result == 'Save click') {
        // this.meterSave(this.index)
      }

    });
    // this.meterArray = this.getMeter();

  }
  get meterDetailForm() {
    return this.meterComplianceForm.get('meterdetails') as FormArray
  }
  addMeter() {
    this.meterDetailForm.push(this.addMeterComplianceFormGroup())
    this.isdisable.push(true)
  }
  assetSave(index) {
    this.index = index
    const meterFormGroup = <FormArray>this.meterComplianceForm.get('meterdetails');
    meterFormGroup.controls[this.formArrayIndex].get('asset').setValue(this.assetArray[this.index].assetnum)
    meterFormGroup.controls[this.formArrayIndex].get('description').setValue(this.assetArray[this.index].description)
    meterFormGroup.controls[this.formArrayIndex].get('partNo').setValue(this.assetArray[this.index].partnumber)
    meterFormGroup.controls[this.formArrayIndex].get('serial').setValue(this.assetArray[this.index].serialnumber)
    meterFormGroup.controls[this.formArrayIndex].get('buildItem').setValue(this.assetArray[this.index].builditem)
  }
  meterSave(index) {
    this.index = index
    const meterFormGroup = <FormArray>this.meterComplianceForm.get('meterdetails');
    meterFormGroup.controls[this.formArrayIndex].get('meter').setValue(this.meterArray[this.index].meternum)
    meterFormGroup.controls[this.formArrayIndex].get('meterDescription').setValue(this.meterArray[this.index].description)
    if (this.meterType == "characterstic") {
      this.charactersticflag = true
      console.log('meterType c', this.meterType)
    }
    else if (this.meterType == "gauge") {
      this.guageflag = true;
      this.continousflag = true;
      console.log('meterType g', this.meterType)
    }
  }
  checkInitialGuageMeter(index) {
    this.reGexBoolInitialGuage[index] = false
    const meterFormGroup = <FormArray>this.meterComplianceForm.get('meterdetails');
    if (this.reGexDecimal.test(meterFormGroup.controls[index].value['initialValue'])) {
      this.reGexBoolInitialGuage[index] = true
      console.log('valid')
      return true
    }
    else {
      console.log('invalid')
      return false
    }
  }
  checkFinalGuageMeter(index) {
    this.reGexBoolFinalGuage[index] = false
    const meterFormGroup = <FormArray>this.meterComplianceForm.get('meterdetails');
    if (this.reGexDecimal.test(meterFormGroup.controls[index].value['finalValue'])) {
      this.reGexBoolFinalGuage[index] = true
      console.log('valid')
      return true
    }
    else {
      console.log('invalid')
      return false
    }
  }
  checkInitialConMeter(index) {
    this.reGexBoolInitialCon[index] = false
    const meterFormGroup = <FormArray>this.meterComplianceForm.get('meterdetails');
    if (this.reGexTime.test(meterFormGroup.controls[index].value['initialValue'])) {
      this.reGexBoolInitialCon[index] = true
      console.log('valid')
      return true
    }
    else {
      console.log('invalid')
      return false
    }
  }
  checkFinalConMeter(index){
    this.reGexBoolFinalCon[index] = false
    const meterFormGroup = <FormArray>this.meterComplianceForm.get('meterdetails');
    if (this.reGexTime.test(meterFormGroup.controls[index].value['finalValue'])) {
      this.reGexBoolFinalCon[index] = true
      console.log('valid')
      return true
    }
    else {
      console.log('invalid')
      return false
    }
  }
  saveMeter(index) {
    if (this.meterComplianceForm.valid) {
      // this.isDisabled=false
      const savedAssetMeterIndex = index;
      const count = index + 1
      this.isdisable[index] = false
      const meterFormGroup = <FormArray>this.meterComplianceForm.get('meterdetails');
      if (meterFormGroup.value[this.formArrayIndex]['asset'] != "" || meterFormGroup.value[this.formArrayIndex]['meter'] != "") {
        this.assetRadio = true
      }
      else {
        this.assetRadio = false
      }
      var saveMeterData = {
        assetId: meterFormGroup.value[savedAssetMeterIndex]['asset'],
        description: meterFormGroup.value[savedAssetMeterIndex]['description'],
        partNum: meterFormGroup.value[savedAssetMeterIndex]['partNo'],
        serialNum: meterFormGroup.value[savedAssetMeterIndex]['serial'],
        buildItem: meterFormGroup.value[savedAssetMeterIndex]['buildItem'],
        assetNum: meterFormGroup.value[savedAssetMeterIndex]['meter'],
        meterName: meterFormGroup.value[savedAssetMeterIndex]['meterDescription'],
        initialValue: meterFormGroup.value[savedAssetMeterIndex]['initialValue'],
        finalValue: meterFormGroup.value[savedAssetMeterIndex]['finalValue'],
        readingDate: meterFormGroup.value[savedAssetMeterIndex]['readingDate'],
        updatedBy: this.userid
      }

      this.meterComplianceService.saveMeterDetails(this.id, saveMeterData).subscribe(response => {
        if (response.body.statusCode == 200) {
          this.toastr.success("row : " + count + " " + response.body.statusString)
          this.getMeterByWorkorderId()
        }
        // console.log('response-------',response.status)
      })
    }
    else {
      this.isSubmitted = true
      console.log('this.meterComplianceForm------', this.meterComplianceForm)
      console.log("Not valid");
    }
    setTimeout(() => {
      var length = this.isdisable.length / 2;
      this.isdisable.splice(0, length)
    }, 500);
  }
  getMeterByWorkorderId() {
    this.meterComplianceService.getMeterByWorkorderId(this.id).subscribe(response => {
      if (response.status == 200) {
        this.savedMeterArray = response.body;
        console.log(' this.savedMeterArray', this.savedMeterArray)
        this.meterComplianceForm.setControl('meterdetails', this.viewMeterDetails(this.savedMeterArray))

      }
      else {
        this.toastr.error(response.statusText)
      }
    })
  }
  viewMeterDetails(savedMeter): FormArray {
    const formArray = new FormArray([]);
    savedMeter.forEach(element => {
      console.log('element', element)
      this.isdisable.push(false)
      formArray.push(
        this.fb.group({
          wometerId: element.woMeterId ? element.woMeterId : "N/A",
          asset: element.assetId ? element.assetId : "N/A",
          description: element.description ? element.description : "N/A",
          partNo: element.partNum ? element.partNum : "N/A",
          serial: element.serialNum ? element.serialNum : "N/A",
          buildItem: element.buildItem ? element.buildItem : "N/A",
          meter: element.assetNum ? element.assetNum : "N/A",
          meterDescription: element.meterName ? element.meterName : "N/A",
          initialValue: element.initialValue ? element.initialValue : "N/A",
          finalValue: element.finalValue ? element.finalValue : "N/A",
          readingDate: element.readingDate ? element.readingDate : "N/A",
          updatedBy: element.updatedBy ? element.updatedBy : "N/A",
          updatedDate: element.updatedDate ? element.updatedDate : "N/A",
        })
      )

    });
    return formArray
  }
  deleteMeter(index) {
    var count = index + 1;
    const meterFormGroup = <FormArray>this.meterComplianceForm.get('meterdetails');
    const wometerId = meterFormGroup.value[index]['wometerId']
    this.meterComplianceService.deleteMeterBywometer(wometerId).subscribe(response => {
      if (response.body.statusCode == 200) {
        this.toastr.success("row : " + count + " Deleted Sucessfully.");
        (<FormArray>this.meterComplianceForm.get("meterdetails")).removeAt(index)
      }
      else {
        this.toastr.error(response.statusText)
      }
    })
    this.isdisable.pop()
  }
  rowDelete(index) {
    var count = index + 1;
    this.toastr.success("row : " + count + " Deleted Sucessfully.");
    (<FormArray>this.meterComplianceForm.get("meterdetails")).removeAt(index)
  }
}
