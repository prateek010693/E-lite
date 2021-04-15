import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormGroup,FormBuilder,FormArray,Validator} from '@angular/forms'
import { ToastrService } from 'ngx-toastr';
import { TaskLevelComplianceService } from '../services/task-level-compliance.service';

@Component({
  selector: 'app-task-compliance',
  templateUrl: './task-compliance.component.html',
  styleUrls: ['./task-compliance.component.css']
})
export class TaskComplianceComponent implements OnInit {
  id:any;
  searchvalue1:any;
  taskComplianceFrom :FormGroup;
  technicianIds =[]
  alreadyAssignTech = [
    {
      technicianId : "1",
      technicianName :"abc",
      teskDiscription : "xyqwqwz",
      complianceDate : "sdsdsdsd"
    },
    {
      technicianId : "2",
      technicianName :"absdfhdgsfc",
      teskDiscription : "xyzldfjfkdfj",
      complianceDate : "sdsdsdsd"
    }
  ]
  constructor(
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private fb:FormBuilder,
    private toastr: ToastrService,
    private tasklevelcomplianceservice : TaskLevelComplianceService) {
      
     }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(param =>{
      console.log('param+++++++++',param)
    })
    this.taskComplianceFrom =this.fb.group({
      AddTechnician : this.fb.array([this.addProductFormGroup()])
    })
    this.gettechnicianId()
    this.taskComplianceFrom.setControl('AddTechnician',this.demoTaskTech(this.alreadyAssignTech))
    // this.demoTaskTech(this.alreadyAssignTech)
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
  gettechnicianId(){
    // return [
    //   { id : '1',name : '1'},
    //   { id : '2',name : '2'},
    //   { id : '3',name : '4'},
    //   { id : '5',name : '5'}
    // ]
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
    var arrayControl = this.taskComplianceFrom.get('AddTechnician') as FormArray
    var item = arrayControl.at(event)
    console.log("array=="+ item)
    //this.taskComplianceFrom.setControl('AddTechnician[event]',this.demoTaskTech(this.alreadyAssignTech))
  }
}
