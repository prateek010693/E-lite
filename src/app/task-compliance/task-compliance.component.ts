import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormGroup,FormBuilder,FormArray,Validator} from '@angular/forms'
import { ToastrService } from 'ngx-toastr';
import { analyzeAndValidateNgModules } from '@angular/compiler';
 import { TaskLevelComplianceService } from '../services/task-level-compliance.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { element } from 'protractor';

@Component({
  selector: 'app-task-compliance',
  templateUrl: './task-compliance.component.html',
  styleUrls: ['./task-compliance.component.css']
})
export class TaskComplianceComponent implements OnInit {
  id:any;
  searchvalue1:any;
  userid:string = localStorage.getItem("userName")
  disableSaveButton:Boolean[] = []
  //SaveButtonCounter = 0;
  taskComplianceFrom :FormGroup;
  technicianIds =[];
  isDisabled = false;
  alreadyAssignTech : any = []
  constructor(
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private fb:FormBuilder,
    private toastr: ToastrService,
    private tasklevelcomplianceservice : TaskLevelComplianceService
   ) {
      
     }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(param =>{
      this.id = param.id
      console.log('this.id',this.id)
    })
    if(this.id == "null"){
      this.isDisabled=true

    }
    this.taskComplianceFrom =this.fb.group({
      AddTechnician : this.fb.array([])
    })
     this.gettechnicianId()
    //console.log("ids",this.technicianIds)
    this.fetchTLC();
    //console.log("tlc",this.alreadyAssignTech)
    
    // this.demoTaskTech(this.alreadyAssignTech)
  }
  fetchTLC(){
    const formArray = new FormArray([]);
    this.alreadyAssignTech = this.tasklevelcomplianceservice.fetchTaskLevelCompliance(this.id,this.userid).subscribe(element => {
      var sampledata = []
      var count = 0;
      console.log("counter222",this.disableSaveButton)
      element.map(el =>{
        
       // this.SaveButtonCounter = 0
        this.disableSaveButton.push(false)
        //this.SaveButtonCounter = this.SaveButtonCounter +1
        //console.log("counter",this.SaveButtonCounter)
        console.log(count++,this.disableSaveButton)
        formArray.push(
          this.fb.group({
          tlcId:el.tlcId,
          complianceDate:el.complianceDte, 
          teskDiscription:el.taskDesc, 
          technicianName:el.technicianName, 
          technicianId:el.technicianServicenum, 
          
        })
        )
        
      })
      console.log("el",element)
      console.log("ell",formArray)
      this.alreadyAssignTech = formArray
      this.taskComplianceFrom.setControl('AddTechnician',this.alreadyAssignTech)
      console.log("elll",this.alreadyAssignTech)
    })
    
  }
  addProductFormGroup(): FormGroup {
    this.disableSaveButton.push(true)
    //this.SaveButtonCounter = this.SaveButtonCounter +1
    //console.log("counter",this.SaveButtonCounter)
    console.log("counter1",this.disableSaveButton)
    return this.fb.group({
      tlcId : [""],
      technicianId : [""],
      technicianName : [""],
      teskDiscription : [""],
      complianceDate : [""],
      
    })
  }
  // demoTaskTech(assignTask) : FormArray{
  //   const formArray = new FormArray([]);
  //   assignTask.forEach(element => {
  //     formArray.push(
  //       this.fb.group({
  //         technicianId : element.technicianId,
  //         technicianName : element.technicianName,
  //         teskDiscription : element.teskDiscription,
  //         complianceDate : element.complianceDate
  //       })
  //     )
  //   });
  //   return formArray
  // }
  get technicians(): FormArray {
    return this.taskComplianceFrom.get('AddTechnician') as FormArray;
 } 
   gettechnicianId(){
  //  return [
  //    { id : '1',name : 'bhanu'},
  //    { id : '2',name : 'prateek'},
  //   { id : '3',name : 'ashu'},
  //  { id : '5',name : 'sarab'}
  //  ]
    this.tasklevelcomplianceservice.fetchTechnicianDetails().subscribe(element =>{
      let count = 0
      var sampleData= []
      
      element.map(el =>{
        sampleData.push({
          "personId":el.personId ? el.personId : 'N/A',
          "name": el.name ? el.name : 'N/A',
          "servicenum": el.servicenum ? el.servicenum : 'N/A',
          "indexCount":count++
        })
      })
      this.technicianIds = sampleData
      console.log('element+++',element)
    //  this.taskComplianceFrom.setControl('AddTechnician',this.demoTaskTech(this.alreadyAssignTech))
    })
   }
  addProductButtonClick(){
    (<FormArray>this.taskComplianceFrom.get("AddTechnician")).push(
      this.addProductFormGroup()
    );
  }
  onCompliance(index){
    var count = index+1

    console.log("AddTechnician Array",this.taskComplianceFrom.value["AddTechnician"][index])
    this.toastr.success("row : "+ count + " Task Compliance Done")
  }
  onDelete(index:any){
    var count = index+1;
    const qwe = (this.taskComplianceFrom.get('AddTechnician') as FormArray).at(index) as FormGroup
    (<FormArray>this.taskComplianceFrom.get("AddTechnician")).removeAt(index)
    console.log('index',index)
    this.toastr.success("row : "+ count + " Task Compliance deleted")
    
    console.log('index',qwe)
    const tlcid = qwe.get('tlcId').value
    console.log('tlcid',tlcid)
    this.tasklevelcomplianceservice.deleteTaskLevelCompliance(tlcid).subscribe(element =>{
      console.log('TLCDelete',element)
    })
    
  }  
  abc(event : any){
    console.log(event)
    
    console.log((this.taskComplianceFrom.value["AddTechnician"][event]))
    const qwe =   (this.taskComplianceFrom.get('AddTechnician') as FormArray).at(event) as FormGroup
    console.log("qweqerqrq",qwe.get('technicianId').value)
    const selectedvalue = (qwe.get('technicianId').value)
    var name:any;
    this.technicianIds.forEach(element => {
      if(selectedvalue === element.servicenum){
        name = element.name
      }
    })
    console.log("name",name)
    
    qwe.get('technicianName').patchValue(name);
    
    // [
      
    //   {technicianId : "1",technicianName :"abcd"}
    // ]
    //this.taskComplianceFrom.setControl('AddTechnician[event]',this.demoTaskTech(this.alreadyAssignTech))
  }
  saveTLC(index:any){
    this.disableSaveButton[index] = false
    const qwe =   (this.taskComplianceFrom.get('AddTechnician') as FormArray).at(index) as FormGroup
    console.log("save",qwe)
    var TLCData = { 
      "technicianName":qwe.get('technicianName').value,
      "technicianServicenum":qwe.get('technicianId').value,
      "taskDesc":qwe.get('teskDiscription').value,
      "complianceDate":qwe.get('complianceDate').value,
      "tlcId":qwe.get('tlcId').value
    }
    this.tasklevelcomplianceservice.createTaskLevelCompliance(this.id,TLCData).subscribe(
      (element) =>{
      if(element.status == 200){
      console.log('TLCSaved',element)
      }
    })
  }
}
