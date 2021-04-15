import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-arming-dearming',
  templateUrl: './arming-dearming.component.html',
  styleUrls: ['./arming-dearming.component.css']
})
export class ArmingDearmingComponent implements OnInit {
  armingDearmingForm : FormGroup

  constructor(private fb : FormBuilder) { }

  ngOnInit(): void {
    this.armingDearmingForm = this.fb.group({
      workorderNo: '',
      description: '',
      worktype:'',
      woStatus:'',
      armamentdetails: this.fb.array([this.addArmingDearmingFormGroup()])
                
    })
  }
  addArmingDearmingFormGroup(): FormGroup {
    return this.fb.group({
      hardPointBuildItem:[""],
              stationNo:[""],
              armamenrPosition:[""],
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
              status:[""],
})
  }
  get ArmingDearminForm(){
    return this.armingDearmingForm.get('armamentdetails') as FormArray
  }
  addArmament(){
    
    this.ArmingDearminForm.push(this.addArmingDearmingFormGroup())
  }

}
