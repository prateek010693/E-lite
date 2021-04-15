
import { ActivatedRoute, Router } from '@angular/router';
import { WorkorderService } from '../services/workorder.service';
import { Component, OnInit, PipeTransform, Pipe } from '@angular/core';

import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { LoaderService } from '../services/loader.service';
import { PlanedAssestService } from '../services/planed-assest.service';

@Component({
  selector: 'app-workorder',
  templateUrl: './workorder.component.html',
  styleUrls: ['./workorder.component.css']
})
@Pipe({
  name: 'search'
})
export class WorkorderComponent implements OnInit {
  workorder_form: FormGroup
  //id: any;
  index: any=[];
  assetArray : any = []
  searchvalue: any;
  editdata: any 
  id: string = "";
  finaldatas : [];
  viewWorkorder : any = []
  constructor(private router:Router,
    
    private workOrderService:WorkorderService,
    
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private bootstrapModel: NgbModal,
    private workorderService:WorkorderService,
    public _loderservice:LoaderService,
    private planedAssestService:PlanedAssestService) { }

  
  ngOnInit(): void {
    this.getWorkorder() 
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
  }
  createWorkorder(id){
    if(id == ""){
      id=null;
      this.router.navigate(['workorder/createworkorder/'+id+'/workorderdetails'])
    }
    else{
      this.router.navigate(['workorder/createworkorder/'+id+'/workorderdetails'])
    }
  } 
  getWorkorder(){
    this.workOrderService.getWorkOrder().subscribe(element =>{
      var sampleData= []
      element.map(el =>{
        sampleData.push({
          "wo_id": el.workorder_id ? el.workorder_id : "N/A",
          "wo":el.wo_num ? el.wo_num : 'N/A',
          "description":el.wo_desc ? el.wo_desc : 'N/A',
          "workType":el.work_type ? el.work_type : 'N/A',
          "asset":el.asset_num ? el.asset_num : 'N/A',
          "status":el.wo_status ? el.wo_status : 'N/A',
        })
      })
      this.viewWorkorder = sampleData
      console.log('element+++',element)
    })
  } 
  editWorkorder(id){
    // console.log()
    this.router.navigate(['workorder/createworkorder/'+id+'/workorderdetails'])

  }
}
