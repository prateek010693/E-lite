import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-meter-compliance',
  templateUrl: './meter-compliance.component.html',
  styleUrls: ['./meter-compliance.component.css']
})
export class MeterComplianceComponent implements OnInit {

  meterComplianceForm : FormGroup
  constructor(private fb : FormBuilder) { }

  ngOnInit(): void {
    this.meterComplianceForm = this.fb.group({
      workorderNo: '',
      description: '',
      worktype:'',
      woStatus:'',
      meterdetails: this.fb.array([this.addMeterComplianceFormGroup(),this.addMeterComplianceFormGroup()])
                
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


  get meterDetailForm(){
    return this.meterComplianceForm.get('meterdetails') as FormArray
  }
  addMeter(){
    for(var  i=0;i<5;i++){
    this.meterDetailForm.push(this.addMeterComplianceFormGroup())
    }
  }
  

}
