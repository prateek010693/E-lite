import { Component, OnInit,PipeTransform, Pipe } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormGroup,FormBuilder,FormArray,Validators} from '@angular/forms'
import { ToastrService } from 'ngx-toastr';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { WorkorderService } from '../services/workorder.service';
 import { TaskLevelComplianceService } from '../services/task-level-compliance.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { element } from 'protractor';
import {DatePipe} from '@angular/common'
import { of } from 'rxjs';
import { data, error } from 'jquery';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-task-compliance',
  templateUrl: './task-compliance.component.html',
  styleUrls: ['./task-compliance.component.css']
})
@Pipe({
  name: 'searchTLC'
})
export class TaskComplianceComponent implements OnInit {
  id:any;

  searchvalue:any;
  closestatus:any; 
  userid:string = localStorage.getItem("userName")
  disableSaveButton:Boolean[] = []
  //SaveButtonCounter = 0;
  taskComplianceFrom :FormGroup;
  index;
  formArrayIndex;
  technicianIds =[];
  isSubmitted = false;
  isDisabled = false;
  alreadyAssignTech : any = []
  constructor(
    private workorderService:WorkorderService,
    private bootstrapModel: NgbModal,
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private fb:FormBuilder,
    private toastr: ToastrService,
    private tasklevelcomplianceservice : TaskLevelComplianceService,
    private Date: DatePipe
   ) {
      
     }
  ngOnInit(): void {
    
    this.activatedRoute.params.subscribe(param =>{
      this.id = param.id
     // console.log('this.id',this.id)
    })
    if(this.id == "null"){
      this.isDisabled=true
    }
    else{
      this.getExistingWO()
      
    }
    
    this.taskComplianceFrom =this.fb.group({
      workorderNo: '',
      description: '',
      worktype:'',
      woStatus:'',
      AddTechnician : this.fb.array([])
    })
     this.gettechnicianId()
    //console.log("ids",this.technicianIds)
    this.fetchTLC();
    //console.log("tlc",this.alreadyAssignTech)
    
    // this.demoTaskTech(this.alreadyAssignTech)
  }
  transform(value: any, searchvalue: any): any {
    // console.log("se",searchvalue)
    // console.log("se",value)
    var count =0
    if (!value || !searchvalue) {
      console.log("here")
      return value;
    }
    return value.filter(item => {
      var a=(
        item.servicenum.toLowerCase().includes(searchvalue.toLowerCase()) ||
        item.name.toLowerCase().includes(searchvalue.toLowerCase())
      )
     
      return a;
    })
  }
  fetchTLC(){
    const formArray = new FormArray([]);
    this.alreadyAssignTech = this.tasklevelcomplianceservice.fetchTaskLevelCompliance(this.id,this.userid).subscribe(element => {
      
      console.log("fetchtlc",this.disableSaveButton)
      element.map(el =>{
        
       // this.SaveButtonCounter = 0
        this.disableSaveButton.push(false)
        //this.SaveButtonCounter = this.SaveButtonCounter +1
        //console.log("counter",this.SaveButtonCounter)
        //console.log("date",this.Date.transform(el.complianceDte,'dd/MM/yyyy HH:mm'))

        formArray.push(
          this.fb.group({
          tlcId:el.tlcId,
          complianceDate:this.Date.transform(el.complianceDte,'dd/MM/yyyy HH:mm:ss'), 
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
    //console.log("addProductFormGroup",this.disableSaveButton)
    return this.fb.group({
      tlcId : [""],
      technicianId : ["",Validators.required],
      technicianName : [""],
      teskDiscription : ["",Validators.required],
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
  let count = 0
      var sampleData= []
    this.tasklevelcomplianceservice.fetchTechnicianDetails().subscribe(element =>{
      
      
      element.map(el =>{
        sampleData.push({
          "personId":el.personId ? el.personId : 'N/A',
          "name": el.name ? el.name : 'N/A',
          "servicenum": el.servicenum ? el.servicenum : 'N/A',
          "indexCount":count++
        })
      })
      
      //console.log('element+++',element)
    //  this.taskComplianceFrom.setControl('AddTechnician',this.demoTaskTech(this.alreadyAssignTech))
    })
    return sampleData
   }
  addProductButtonClick(){
    (<FormArray>this.taskComplianceFrom.get("AddTechnician")).push(
      this.addProductFormGroup()
    );
  }
  onCompliance(index){
    var count = index+1
    const qwe = (this.taskComplianceFrom.get('AddTechnician') as FormArray).at(index) as FormGroup
    const tlcid = qwe.get('tlcId').value
    this.tasklevelcomplianceservice.complyTaskLevelCompliance(tlcid,this.userid).subscribe(element =>{
     // console.log("element",element)
      qwe.get('complianceDate').patchValue(this.Date.transform(element.complianceDte,'dd/MM/yyyy HH:mm:ss'))
    })
    //console.log("AddTechnician Array",this.taskComplianceFrom.value["AddTechnician"][index])
    this.toastr.success("row : "+ count + " Task Compliance Done")
  }
  onDelete(index:any){
    var count = index+1;
    const qwe = (this.taskComplianceFrom.get('AddTechnician') as FormArray).at(index) as FormGroup
    (<FormArray>this.taskComplianceFrom.get("AddTechnician")).removeAt(index)
    //console.log('index',index)
    this.toastr.success("row : "+ count + " Task Compliance deleted")
    
    //console.log('index',qwe)
    const tlcid = qwe.get('tlcId').value
    //console.log('tlcid',tlcid)
    this.disableSaveButton.splice(index,1)
    //console.log("delete",this.disableSaveButton)
    this.tasklevelcomplianceservice.deleteTaskLevelCompliance(tlcid).subscribe(element =>{
      //console.log('TLCDelete',element)
    })
    
  }  
  abc(event : any){
    //console.log(event)
    
    //console.log((this.taskComplianceFrom.value["AddTechnician"][event]))
    const qwe =   (this.taskComplianceFrom.get('AddTechnician') as FormArray).at(event) as FormGroup
    //console.log("qweqerqrq",qwe.get('technicianId').value)
    const selectedvalue = (qwe.get('technicianId').value)
    var name:any;
    this.technicianIds.forEach(element => {
      if(selectedvalue === element.servicenum){
        name = element.name
      }
    })
    qwe.get('technicianName').patchValue(name); 
  }
  saveTLC(index:any){

    if(this.taskComplianceFrom.valid){
      
    const qwe =   (this.taskComplianceFrom.get('AddTechnician') as FormArray).at(index) as FormGroup
    //console.log("save",qwe)
    var TLCData = { 
      "technicianName":qwe.get('technicianName').value,
      "technicianServicenum":qwe.get('technicianId').value,
      "taskDesc":qwe.get('teskDiscription').value,
      "complianceDate":qwe.get('complianceDate').value,
      "tlcId":qwe.get('tlcId').value,
      "createdBy":this.userid
    }
    this.tasklevelcomplianceservice.createTaskLevelCompliance(this.id,TLCData).subscribe(
      (element) =>{
      console.log(element.status)
        if (element.status == 200) {
          this.disableSaveButton[index] = false
          this.toastr.success("saved Sucessfully")
        }
        qwe.get('tlcId').patchValue(element.body.tlcId)
      
      
    },(error) => {
      
      this.toastr.success("Some error occured")
    }
    )
  }
  else{
    this.isSubmitted = true
  }
  }
  getExistingWO(){ 
    console.log('this.id++++',this.id)
      this.workorderService.getExistingWO(this.id).subscribe(data =>{
        console.log('data',data)
        
        
        //this.date = (this.dataPipe.transform(data.closure_date,'yyyy-MM-dd') != null) ?  this.dataPipe.transform(data.closure_date,'yyyy-MM-dd') : "N/A"
        this.taskComplianceFrom.controls['workorderNo'].setValue(data.wo_num ? data.wo_num : "N/A") 
        this.taskComplianceFrom.controls['woStatus'].setValue(data.wo_status ? data.wo_status : "N/A")
        this.taskComplianceFrom.controls['description'].setValue(data.wo_desc ? data.wo_desc : "N/A")  
        this.taskComplianceFrom.controls['worktype'].setValue(data.work_type ? data.work_type : "N/A") 
        // data.map(el => {
        //   this.closestatus = el.wo_status
        //   console.log("this.closestatu",this.closestatus)
        //   })
        this.closestatus = this.taskComplianceFrom.get('woStatus').value
        console.log("closestatu",this.closestatus)
        if(this.closestatus == 'CLOSE'){
          this.disabler()

        }
      })
      
      // if(this.taskComplianceFrom.get('woStatus').value == 'CLOSE'){
         
     
  }
  disabler(){
    console.log("inside disabler")
    
      this.isDisabled = true
      this.closestatus = true
    
  }
  open(asset,index) {
    this.formArrayIndex = index
    this.searchvalue = ''
    this.bootstrapModel.open(asset, { ariaDescribedBy: 'model-basic title' }).result.then((result) => {
      console.log('result', result)
      if (result == 'Save click') {
        //this.assetSave(this.index)
      }

    });
    this.technicianIds=this.gettechnicianId();
    
  }
  assetSave(index){
    this.index = index
    const TechinicianGroup = (this.taskComplianceFrom.get('AddTechnician') as FormArray).at(this.formArrayIndex) as FormGroup
    TechinicianGroup.get('technicianId').setValue(this.technicianIds[this.index].servicenum)
    TechinicianGroup.get('technicianName').setValue(this.technicianIds[this.index].name)


  }
  
}
