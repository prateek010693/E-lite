import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormGroup,FormBuilder,FormArray,Validator} from '@angular/forms'
import { ToastrService } from 'ngx-toastr';
import { analyzeAndValidateNgModules } from '@angular/compiler';
 import { TaskLevelComplianceService } from '../services/task-level-compliance.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-task-compliance',
  templateUrl: './task-compliance.component.html',
  styleUrls: ['./task-compliance.component.css']
})
export class TaskComplianceComponent implements OnInit {
  id:any;
  searchvalue1:any;
  userid:string = localStorage.getItem("userName")
  
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
      AddTechnician : this.fb.array([this.addProductFormGroup()])
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
      
      element.map(el =>{
        formArray.push(
          this.fb.group({
          tlcId:el.tlcId,
          complianceDate:el.complianceDte, 
          teskDiscription:el.taskDesc, 
          technicianName:el.technicianName, 
          technicianId:el.technicianServicenum, 
        }))
        
      })
      console.log("el",element)
      console.log("ell",formArray)
      this.alreadyAssignTech = formArray
      this.taskComplianceFrom.setControl('AddTechnician',this.alreadyAssignTech)
      console.log("elll",this.alreadyAssignTech)
    })
    
  }
  addProductFormGroup(): FormGroup {
    return this.fb.group({
      technicianId : [""],
      technicianName : [""],
      teskDiscription : [""],
      complianceDate : [""]
    })
  }
  demoTaskTech(assignTask) : FormArray{
    const formArray = new FormArray([]);
    assignTask.forEach(element => {
      formArray.push(
        this.fb.group({
          technicianId : element.technicianId,
          technicianName : element.technicianName,
          teskDiscription : element.teskDiscription,
          complianceDate : element.complianceDate
        })
      )
    });
    return formArray
  }
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
  onDelete(index){
    var count = index+1;
    (<FormArray>this.taskComplianceFrom.get("AddTechnician")).removeAt(index)
    console.log('index',index)
    this.toastr.success("row : "+ count + " Task Compliance deleted")
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
}
