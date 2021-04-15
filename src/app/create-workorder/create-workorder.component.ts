import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare interface RouteInfo {
  path: string;
  title: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [

  { path: 'workorderdetails', title: 'Workorder', class: '' },
  { path: 'tasklevelcompliance', title: 'Task Level Compliance', class: '' },
  { path: 'metercompliance', title: 'Meter Compliance', class: '' },
  { path: 'armingdearming', title: 'Arming/Dearming', class: '' },
  { path: 'assestinstallremove', title: 'Assest Install/Remove', class: '' },




];
@Component({
  selector: 'app-create-workorder',
  templateUrl: './create-workorder.component.html',
  styleUrls: ['./create-workorder.component.css']
})
export class CreateWorkorderComponent implements OnInit {
  sidebarDrag: boolean = true
  workorderItems: any[];
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.workorderItems = ROUTES.filter(menuItem => menuItem);
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
