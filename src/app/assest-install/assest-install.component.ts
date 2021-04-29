import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-assest-install',
  templateUrl: './assest-install.component.html',
  styleUrls: ['./assest-install.component.css']
})
export class AssestInstallComponent implements OnInit {
  assetInstallRemoveForm : FormGroup
  id: any;
  isDisabled : boolean = false
  constructor(private activatedRoute:ActivatedRoute,
    private fb : FormBuilder,
    ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(param =>{
      this.id = param.id
      console.log('this.id',this.id)
    })
    this.assetInstallRemoveForm = this.fb.group({
      workorderNo: '',
      description: '',
      worktype:'',
      woStatus:'',
      assetdetails: this.fb.array([])
                
    })
    if(this.id == "null"){
      this.isDisabled=true}
  }
  addAssetDetailsFormGroup(): FormGroup {
    return this.fb.group({
      JobType: [""], 
      Item:[""],
      BuildItem:[""],
      Position:[""],
      PartNo:[""],
      
})
  }

  get assetDetailFunction(){
    return this.assetInstallRemoveForm.get('assetdetails') as FormArray
}
addNewRow(){
  this.assetDetailFunction.push(this.addAssetDetailsFormGroup())
}

}
