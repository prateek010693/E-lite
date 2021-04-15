import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { data } from 'jquery';
import { PlanedAssestService } from '../services/planed-assest.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-planned-asset',
  templateUrl: './planned-asset.component.html',
  styleUrls: ['./planned-asset.component.css']
})
export class PlannedAssetComponent implements OnInit {
   workorder_form : FormGroup
  // fileToUpload : File = null
  public formData = new FormData();
   ReqJson : any = {}
  finaldata : [];
  viewPlannedAsset : any = []
  constructor(private fb: FormBuilder,
    private planedAssetService:PlanedAssestService,
    private bootstrapModel: NgbModal,
    ) { 
    
  }

  ngOnInit(): void {
    this.getPlannedasset()

    this.workorder_form = this.fb.group({
      recordNumber: [""],
      aircraftNumber: [""],
      model: [""],
      variation: [""],
      locationOfAircraft: [""],
      dateOfTransfer: [""],
      dettLocation: [""],
      dettLocationBase: [""],
      status: [""],
    })


    // this.getXmlData()
  }
  // open(importXml) {
  //   this.bootstrapModel.open(importXml, { ariaDescribedBy: 'model-basic title' }).result.then((result) => {
  //     console.log('result', result)
  //     if (result == 'Save click') {
  //       this.getXmlData()
  //     }

  //   });
    
  // }
  exportData(){
  	console.log("exportData")
  }
  onUpload(){
    console.log('dsdsdfssdfddgdfgdf')
  }
  cancelRecord(){
    this.workorder_form.reset();
    // const abc = this.fileToUpload.nativeElemet;abc.onchange =() =>{};
    // abc.click()
  }
  // uploadFileToActivity(){
  //   this.importXmlService.postFile(this.fileToUpload).subscribe(data =>{

  //   })
  // }
  // uploadFiles(event : EventTarget){
  //   const eventObj: MSInputMethodContext = <MSInputMethodContext>event;
  //   const target : HTMLInputElement = <HTMLInputElement>eventObj.target
  //   const files : FileList = target.files;
  //   const formData : FormData = new FormData();
  //   console.log('formData Before',formData)
  //   formData.append('files',files[0])
  //   console.log('formData',formData)
  //   this.planedAssetService.importXml(formData).subscribe(data =>{
  //         console.log('data',data)
  //   })
  // }
  requestUpload(){
    this.ReqJson["REcordNo"]="1111111"
    console.log('this.ReqJson',this.ReqJson)
    this.formData.append('info',JSON.stringify(this.ReqJson))
    console.log('this.formData',this.formData)
    this.setFormValue();
  } 
  setFormValue(){
    this.workorder_form.controls['recordNumber'].setValue(this.ReqJson['REcordNo'])
  }
  // getXmlData(){
  //   this.planedAssetService.getXMLData().subscribe(data =>{
  //     console.log('data------',data)
  //   })
  // }

  getPlannedasset(){
    var sampleData= []
    this.planedAssetService.getPlannedAsset().subscribe(element =>{ 
      console.log('element',element)
      element.map(el =>{
        sampleData.push({
          "asset":el.assetnum ? el.assetnum : 'N/A',
          "description":el.description ? el.description : 'N/A',
          "serial":el.serialnum ? el.serialnum : 'N/A',
          "cmItem":el.cmitem ? el.cmitem : 'N/A',
          "model":el.model ? el.model : 'N/A',
          "currentValue":el.currentvalue ? el.currentvalue : 'N/A',
          "remainingValue":el.remainingvalue ? el.remainingvalue : 'N/A',
        })
      })
      this.viewPlannedAsset = sampleData
      console.log('element+++',element)
    })     
  }
}
