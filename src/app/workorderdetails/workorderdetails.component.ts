import { Component, OnInit, PipeTransform, Pipe } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common'
import { WorkorderService } from '../services/workorder.service';
import { LoaderService } from '../services/loader.service';
import { PlanedAssestService } from '../services/planed-assest.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-workorderdetails',
  templateUrl: './workorderdetails.component.html',
  styleUrls: ['./workorderdetails.component.css']
})
@Pipe({
  name: 'search',
})
export class WorkorderdetailsComponent implements OnInit, PipeTransform {
  workOrderDetailForm: FormGroup
  id: any;
  index: any=[];
  assetArray : any = []
  searchvalue: any;
  editdata: any;
  isEditable : boolean = true;
  date : any;
  statusArray :any = [];
  statusChangeIndex : boolean = true;
  workTypeArray : any = [];
  pmArray : any = []
  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private bootstrapModel: NgbModal,
    private workorderService:WorkorderService,
    public _loderservice:LoaderService,
    private planedAssestService:PlanedAssestService,
    private dataPipe:DatePipe,
    private toastr:ToastrService) { }

  transform(value:any, searchvalue: any): any {
    if (!value || !searchvalue) {
      return value;
    }
    return value.filter(item => {
      if(item.assetnum == undefined && item.workType == undefined){
        var filter =item.pm.toLowerCase().includes(searchvalue.toLowerCase()) || item.description.toLowerCase().includes(searchvalue.toLowerCase())
        return filter
      }
      if(item.assetnum == undefined && item.pm == undefined){
        var filter =item.workType.toLowerCase().includes(searchvalue.toLowerCase()) || item.description.toLowerCase().includes(searchvalue.toLowerCase()) 
        return filter
      }
      if(item.workType == undefined && item.pm == undefined){
        var filter =item.assetnum.toLowerCase().includes(searchvalue.toLowerCase()) || item.serialnumber.toLowerCase().includes(searchvalue.toLowerCase()) 
        return filter
      }   
    })
  }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(param => {
      this.id = param['id']
    })
    this.workOrderDetailForm = this.fb.group({
      woNumber: [""],
      description: [""],
      worktype: [""],
      woStatus: ["APPR"],
      asset: [""],
      serial: [""],
      pmNumber: [""],
      statusDate: [""],
      cmItem: [""],
      pmDescription: [""],
      closedBy: [""],
      //LookUp Controller
      
    })
    if(this.id != "null"){
      this.isEditable = false
      this.getExistingWO();
    }
    else{
      this.getWorkorderNo()
    }
  }
  getAsset() {
    let count = 0
    var assetData = []
    this.planedAssestService.getPlannedAsset().subscribe(data =>{
      console.log('data',data)
      data.map(el =>{
        assetData.push({
          "assetnum":el.assetnum ? el.assetnum : "N/A",
          "description":el.description ? el.description : "N/A",
          "status":el.status ? el.status : "N/A",
          "serialnumber":el.serialnum ? el.serialnum : "N/A",
          "cmitem":el.cmitem ? el.cmitem : "N/A",
          "indexCount":count++
        })
      })
    })
    return assetData
  }
  getWorkType(){
    var count = 0
    var workTypeData = []
    this.workorderService.getWorkType().subscribe(data =>{
      console.log('data',data)
      data.map(el =>{
        workTypeData.push({
          "workType":el.wrkTyp ? el.wrkTyp : "N/A",
          "description":el.wrkTypDesc ? el.wrkTypDesc : "N/A",
          "indexCount":count++
        })
      })
    })
    return workTypeData
  }
  getPM(){
    var count = 0
    var pmData = []
    this.workorderService.getPM().subscribe(data =>{
      console.log('data',data)
      data.map(el =>{
        pmData.push({
          "pm":el.pmNum ? el.pmNum : "N/A",
          "description":el.pmDesc ? el.pmDesc : "N/A",
          "indexCount":count++
        })
      })
    })
    return pmData
  }
  getStatus(){
    return [
      {
        indexCount:"1",
        status : "CAN"
      },
      {
        indexCount:"2",
        status : "CLOSE"
      }
    ]
  }
  open(asset) {
    this.searchvalue = ''
    this.bootstrapModel.open(asset, { ariaDescribedBy: 'model-basic title' }).result.then((result) => {
      console.log('result', result)
      if (result == 'Save click') {
        this.assetSave(this.index)
      }

    });
    this.assetArray=this.getAsset();
    
  }
  woStatus(wostatus) {
    this.searchvalue = ''
    this.bootstrapModel.open(wostatus, { ariaDescribedBy: 'model-basic title' }).result.then((result) => {
      console.log('result', result)
      if (result == 'Save click') {
        this.saveStatus()       
      }
    });
    this.statusArray = this.getStatus()
  }
  workType(worktype) {
    this.searchvalue = ''
    this.bootstrapModel.open(worktype, { ariaDescribedBy: 'model-basic title' }).result.then((result) => {
      console.log('result', result)
      if (result == 'Save click') {
        this.worktypeSave(this.index)  
      }
    });
    this.workTypeArray = this.getWorkType() 
  }
  pmItem(pmitem) {
    this.searchvalue = ''
    this.bootstrapModel.open(pmitem, { ariaDescribedBy: 'model-basic title' }).result.then((result) => {
      console.log('result', result)
      if (result == 'Save click') {
        this.pmSave(this.index)     
      }
    });
    this.pmArray = this.getPM()
  }
  assetSave(index) {
    this.index = index
    this.workOrderDetailForm.controls['asset'].setValue(this.assetArray[this.index].assetnum)
    this.workOrderDetailForm.controls['serial'].setValue(this.assetArray[this.index].serialnumber)
    this.workOrderDetailForm.controls['cmItem'].setValue(this.assetArray[this.index].cmitem)
  }
  worktypeSave(index){
    this.index = index
    this.workOrderDetailForm.controls['worktype'].setValue(this.workTypeArray[this.index].workType)
  }
  pmSave(index){
    this.index = index
    this.workOrderDetailForm.controls['pmNumber'].setValue(this.pmArray[this.index].pm)
    this.workOrderDetailForm.controls['pmDescription'].setValue(this.pmArray[this.index].description)

  }
  statusSave(index){
    this.index = index
  }
  saveStatus(){
    var statuschange ={} 
    this.statusArray.map(element =>{
      console.log('element',element)
      if(element.indexCount == this.index){
        this.statusChangeIndex = false
        statuschange = {
          wo_status: element.status
        }
      }
    })
    this.workorderService.changeStatus(this.id,statuschange).subscribe(data =>{
      console.log(data)
      if(data.code = 200){ 
        this.getExistingWO()
        this.toastr.success("Status Chnage Successfully.")
      }
    })
    console.log('this.index ',this.index )
  }
  cancelworkorder() {
    this.router.navigate(['workorder'])
  }
  saveworkorder(id) {
    var date = this.workOrderDetailForm.controls['statusDate'].value
    console.log('date',typeof date,date)
    console.log('id+++++',typeof id,id)   
    if(id == "null"){
      console.log("new Workorder")
      var workorderData = { 
         "wo_num":this.workOrderDetailForm.controls['woNumber'].value,
        "wo_desc":this.workOrderDetailForm.controls['description'].value,
        "work_type":this.workOrderDetailForm.controls['worktype'].value,
        // status:this.workOrderDetailForm.controls['woStatus'].value,
        "asset_num":this.workOrderDetailForm.controls['asset'].value,
        "serial_num":this.workOrderDetailForm.controls['serial'].value,
        "cm_item":this.workOrderDetailForm.controls['cmItem'].value,
        "pm":this.workOrderDetailForm.controls['pmNumber'].value,
        "pm_desc":this.workOrderDetailForm.controls['pmDescription'].value,
        
      }
      this.workorderService.createWO(workorderData).subscribe(element =>{
        console.log('element',element)
      })

    }
    console.log('this.workOrderDetailForm', this.workOrderDetailForm)
    this.router.navigate(['workorder'])
  }
  getExistingWO(){ 
    console.log('this.id++++',this.id)
      this.workorderService.getExistingWO(this.id).subscribe(data =>{
        console.log('data',data)
        if(data.wo_status =="CAN" || data.wo_status =="CLOSE"){
          this.statusChangeIndex = false
        }
        this.date = (this.dataPipe.transform(data.closure_date,'yyyy-MM-dd') != null) ?  this.dataPipe.transform(data.closure_date,'yyyy-MM-dd') : "N/A"
        this.workOrderDetailForm.controls['woNumber'].setValue(data.wo_num ? data.wo_num : "N/A") 
        this.workOrderDetailForm.controls['woStatus'].setValue(data.wo_status ? data.wo_status : "N/A")
        this.workOrderDetailForm.controls['description'].setValue(data.wo_desc ? data.wo_desc : "N/A")  
        this.workOrderDetailForm.controls['asset'].setValue(data.asset_num ? data.asset_num : "N/A") 
        this.workOrderDetailForm.controls['serial'].setValue(data.serial_num ? data.serial_num : "N/A") 
        this.workOrderDetailForm.controls['pmNumber'].setValue(data.pm ? data.pm : "N/A") 
        this.workOrderDetailForm.controls['statusDate'].setValue(data.closure_date ? data.closure_date  : "N/A") 
        this.workOrderDetailForm.controls['cmItem'].setValue(data.cm_item ? data.cm_item : "N/A") 
        this.workOrderDetailForm.controls['pmDescription'].setValue(data.pm_desc ? data.pm_desc : "N/A") 
        this.workOrderDetailForm.controls['closedBy'].setValue(data.closed_by ? data.closed_by : "N/A") 
        this.workOrderDetailForm.controls['worktype'].setValue(data.work_type ? data.work_type : "N/A") 
      })
  }
  getWorkorderNo(){
    console.log('fdfdfdfd')
    this.workorderService.getWorkorderNo().subscribe(data =>{
      console.log('data',data)
      this.workOrderDetailForm.controls['woNumber'].setValue(data.wonum)
    })
  }
}

