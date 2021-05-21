import { Component, OnInit,Pipe,PipeTransform } from '@angular/core';
import { FormBuilder, FormGroup, FormArray,Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { WorkorderService } from '../services/workorder.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ArmingDearmingService  } from '../services/arming-dearming.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-arming-dearming',
  templateUrl: './arming-dearming.component.html',
  styleUrls: ['./arming-dearming.component.css']
})
@Pipe({
name : 'searchAD',
})
export class ArmingDearmingComponent implements OnInit,PipeTransform {
  armingDearmingForm : FormGroup
  id : any;
  searchvalue : any
  formarrayindex : any
  index : any
  closestatus:any
  isDisabled : boolean = false
  hpBuildItem = []
  gigNo =[]
  isSubmitted = false

  constructor(private fb : FormBuilder,
    private activatedRoute:ActivatedRoute,
    private workorderService: WorkorderService,
    private bootstrapModel: NgbModal,
    private armingDearmingService: ArmingDearmingService,
    private toastr: ToastrService,
    ) { }
  transform(value: any, searchvalue: any): any {
    if (!value || !searchvalue) {
      return value;
    }
  }

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
      this.fetchExistingData()
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
      arm_id:[""],
      hardPointBuildItem: ["",Validators.required],
      stationNo: [""],
      armamentPosition: [""],
      armamentItem: ["",Validators.required],
      description: [""],
      partNo: ["",Validators.required],
      serial: ["",Validators.required],
      lotNo: ["",Validators.required],
      currentQuantity: [""],
      loadQuantity: ["",],
      unloadQuantity: [""],
      evaluatedQuantity: [""],
      remarks: [""],
      status:[""]
              
})
  }
  get ArmingDearminForm(){
    return this.armingDearmingForm.get('armamentdetails') as FormArray
  }
  addArmament(){
    
    this.ArmingDearminForm.push(this.addArmingDearmingFormGroup())
  }
  selectGig(event,formarrayindex){
    this.searchvalue = ''
    this.formarrayindex = formarrayindex
    this.bootstrapModel.open(event, { ariaDescribedBy: 'model-basic title' }).result.then((result) => {
      console.log('resultBuildItem', result)
      if (result == 'Save click') {
        this.gigSave()
      }

    });
    this.gigNo = this.getGigNo();

    
  }
  gigSave(){
      const formgroup = this.ArmingDearminForm.at(this.formarrayindex) as FormGroup
      formgroup.get('armamentItem').setValue(this.gigNo[this.index].armGigNo)
      formgroup.get('description').setValue(this.gigNo[this.index].armDesc)
  } 
  getGigNo(){
    let count = 0
    var sampledata = []
    
    
    this.armingDearmingService.fetchGigNumber().subscribe(data => {
      console.log('data',data)
      data.map(el => {
        sampledata.push({
        "armGigNo": el.armGigNo ? el.armGigNo : 'N/A',
        "armDesc": el.armDesc ? el.armDesc : 'N/A',
       
        "indexCount": count++
        })
      })

    })
    return sampledata
  }
  indexsetter(index){
    console.log("indexsetter",index)
    this.index = index
  }
  selectBuildItem(event,formarrayindex){
    this.searchvalue = ''
    this.formarrayindex = formarrayindex
    console.log("formarrayindex",formarrayindex)
    this.bootstrapModel.open(event, { ariaDescribedBy: 'model-basic title' }).result.then((result) => {
      console.log('resultBuildItem', result)
      if (result == 'Save click') {
        this.HPBuildItemSave()
      }

    });
    this.hpBuildItem = this.getBuildItem();

  }
  HPBuildItemSave(){
    console.log("HPBuildItemSave")
    const formgroup = this.ArmingDearminForm.at(this.formarrayindex) as FormGroup
    formgroup.get('hardPointBuildItem').setValue(this.hpBuildItem[this.index].builditemid)
    formgroup.get('stationNo').setValue(this.hpBuildItem[this.index].buildType)
    formgroup.get('armamentPosition').setValue(this.hpBuildItem[this.index].position)

  }
  getBuildItem(){
    let count = 0
    var buildItemData = []
    this.armingDearmingService.fetchHPBuildItem().subscribe(data => {
      console.log('data',data)
      data.map(el => {
        buildItemData.push({
        "builditemid": el.builditemid ? el.builditemid : 'N/A',
        "buildType": el.buildType ? el.buildType : 'N/A',
        "position": el.position ? el.position : 'N/A',
        "indexcount": count++
        })
      })

    })
    return buildItemData
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
      if (this.closestatus == 'CLOSE' || this.closestatus == 'CAN') {
        this.disabler()

      }
    })
  }
  disabler() {
    console.log("inside disabler")
    this.isDisabled = true
    this.closestatus = true
  }
  getCurrentQuan(index){
    const {armamentItem:armGIGNo,
      armamentPosition:armPosition,
      currentQuantity:currentQuant,
      description:armDescription,
      evaluatedQuantity:evaluatedQuant,
      hardPointBuildItem:buildItem,
      loadQuantity:loadQuant,
      lotNo:lotNo,
      partNo:partNo,
      remarks:armRemarks,
      serial:serialNo,
      stationNo:stationNo,
      unloadQuantity:unloadQuant,
      status:armStatus
      } = (this.ArmingDearminForm.at(index) as FormGroup).value
    console.log("loadQuant",loadQuant)
      var saveData = {
        "armPosition":armPosition ,
        "currentQuant":currentQuant ,
        "armGIGNo":armGIGNo,
        "armDescription":armDescription,
        "evaluatedQuant":evaluatedQuant,
        "buildItem":buildItem,
        "loadQuant":loadQuant,
        "lotNo":lotNo ,
        "partNo":partNo ,
        "armRemarks":armRemarks ,
        "serialNo":serialNo ,
        "stationNo":stationNo,
        "unloadQuant":unloadQuant,
        "armStatus":armStatus,
      }
      console.log("saveData",saveData)
    this.armingDearmingService.fetchCurrentQuant(this.id,saveData).subscribe((element)=>{
      console.log("save",element);
      (this.ArmingDearminForm.at(index) as FormGroup).get('status').setValue(element.armStatus);
      (this.ArmingDearminForm.at(index) as FormGroup).get('currentQuantity').setValue(element.currentQuant)
      

    })

  }
  saveRowArmDearm(index){
    
    const  {armamentItem:armGIGNo,
      armamentPosition:armPosition,
      currentQuantity:currentQuant,
      description:armDescription,
      evaluatedQuantity:evaluatedQuant,
      hardPointBuildItem:buildItem,
      loadQuantity:loadQuant,
      lotNo:lotNo,
      partNo:partNo,
      remarks:armRemarks,
      serial:serialNo,
      stationNo:stationNo,
      unloadQuantity:unloadQuant,
      status:armStatus
      } = (this.ArmingDearminForm.at(index) as FormGroup).value
      console.log("here",armGIGNo)

      var rowdata = {
        "armPosition":armPosition ,
        "currentQuant":currentQuant ,
        "armGIGNo":armGIGNo,
        "armDescription":armDescription,
        "evaluatedQuant":evaluatedQuant,
        "buildItem":buildItem,
        "loadQuant":loadQuant,
        "lotNo":lotNo ,
        "partNo":partNo ,
        "armRemarks":armRemarks ,
        "serialNo":serialNo ,
        "stationNo":stationNo,
        "unloadQuant":unloadQuant,
        "armStatus":status,
      }
      console.log("rdata",rowdata)
      this.armingDearmingService.saveRow(this.id,rowdata).subscribe((data)=>{
        console.log("data",data);
        (this.ArmingDearminForm.at(index) as FormGroup).get('arm_id').setValue(data.arm_id);
        (this.ArmingDearminForm.at(index) as FormGroup).get('status').setValue(data.armStatus);

      })
      
    
    // else{
    //   this.isSubmitted = true
    // }
  }
  fetchExistingData(){
    const existingData = new FormArray([])
    this.armingDearmingService.fetchExistData(this.id).subscribe((element)=>{
      console.log("element",element)
      element.map(el =>{
 
         existingData.push(
           this.fb.group({
             arm_id:el.arm_id,
            armamentItem:el.armGIGNo,
            armamentPosition:el.armPosition,
            currentQuantity:el.currentQuant,
            description:el.armDescription,
            evaluatedQuantity:el.evaluatedQuant,
            hardPointBuildItem:el.buildItem,
            loadQuantity:el.loadQuant,
            lotNo:el.lotNo,
            partNo:el.partNo,
            remarks:el.armRemarks,
            serial:el.serialNo,
            stationNo:el.stationNo,
            unloadQuantity:el.unloadQuant,
            status:el.armStatus
         })
         )
         
       })
       this.armingDearmingForm.setControl('armamentdetails',existingData)
    }

    )
  }
  deleteExistingData(index){
    var id = (this.ArmingDearminForm.at(index) as FormGroup).get('arm_id').value;
    (<FormArray>this.armingDearmingForm.get("armamentdetails")).removeAt(index);
    
    console.log("id",id)
    this.armingDearmingService.deleteExistingData(id).subscribe((element)=>{
      console.log("element",element)
      if(element.code === 202){
        this.toastr.success(`row :  ${index + 1}   Task Compliance deleted`)
      }
    })

  }
  alternator1(index){
    console.log("alternator1")
    this.ArmingDearminForm.at(index).get("loadQuantity").setValue("")

  }
  alternator2(index){
    console.log("alternator2")
    this.ArmingDearminForm.at(index).get("unloadQuantity").setValue("")

  }
}
