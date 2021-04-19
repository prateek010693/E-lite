import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-meter-compliance',
  templateUrl: './meter-compliance.component.html',
  styleUrls: ['./meter-compliance.component.css']
})
export class MeterComplianceComponent implements OnInit {
  meterComplianceForm : FormGroup
  id : any 
  isDisabled : boolean = false
  constructor(private fb : FormBuilder,
    private activatedRoute:ActivatedRoute,
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
