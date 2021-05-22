import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { threadId } from 'worker_threads';
import { WorkorderService } from '../services/workorder.service';

declare interface RouteInfo {
  path: string;
  title: string;
  class: string;
  role: Array<string>;
  work: Array<any>;
}
export const ROUTES: RouteInfo[] = [

  { path: 'workorderdetails', title: 'Workorder', role:['admin','user','technician'],work:[''],class: '' },
  { path: 'tasklevelcompliance', title: 'Task Level Compliance',work:[''],role:['admin','technician'], class: '' },
  { path: 'metercompliance', title: 'Meter Compliance',role:['admin','technician'],work:['Servicing'], class: '' },
  { path: 'armingdearming', title: 'Arming/Dearming',role:['admin'],work:[], class: '' },
  { path: 'assestinstallremove', title: 'Assest Install/Remove',work:[''],role:['admin'], class: '' },
];
@Component({
  selector: 'app-create-workorder',
  templateUrl: './create-workorder.component.html',
  styleUrls: ['./create-workorder.component.css']
})
export class CreateWorkorderComponent implements OnInit {
  userrole = 'admin'
  worktype;
  sidebarDrag: boolean = true
  workorderItems: any[];
  temp =[];
  id : any
  constructor(private router: Router,
    private activatedRoute:ActivatedRoute,
    private workorderService:WorkorderService,
    ) { }

  ngOnInit(): void {
    
     
    this.activatedRoute.params.subscribe(param =>{
      this.id = param.id
     // console.log('this.id',this.id)
    })
    if(this.id == "null"){
      console.log('new workorder')
      this.temp.push(ROUTES[0])
      // this.isDisabled=true
    }
    else{
      console.log('existing workorder')
      this.getExistingWO()
      
      
    }
  }
  getExistingWO(){ 
    this.workorderService.getExistingWO(this.id).subscribe(data =>{
      console.log('data in create workorder',data)
      const {work_type} = data
      this.abc(work_type)
    })
}
  abc(work_type){
    console.log("this.worktype",work_type)
    this.workorderItems = ROUTES.filter((menuItem) => {
      console.log("menuItem",menuItem)
      const {role,work} = menuItem
      console.log("role",role)
      console.log("work",work)
      role.forEach((ele)=>{
        if(ele == this.userrole){
          console.log('pushed')
          
          this.temp.push(menuItem)
        }
      });
      work.forEach((ele)=>{
        console.log("ele",ele)
        if(work_type!= "" && ele == work_type ){
          console.log('popped')
          this.temp.pop()
        }
      })
      console.log("temp",this.temp)
      return this.temp
    });
  }
  dragSidebar() {
    console.log('this.sidebarDrag', this.sidebarDrag)
    if (this.sidebarDrag == true) {
      this.sidebarDrag = false;
      console.log('this.sidebarDrag if', this.sidebarDrag)
    }
    else {
      this.sidebarDrag = true;
      console.log('this.sidebarDrag else', this.sidebarDrag)
    }
    console.log('something',)
  }
}
