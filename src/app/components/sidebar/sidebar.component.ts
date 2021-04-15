import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
  
    { path: '/plannedasset', title: 'Planned Asset',  icon: 'files_single-copy-04', class: '' },
    { path: '/workorder', title: 'Workorder',  icon: 'ui-2_settings-90', class: '' },
    { path: '/flb', title: 'FLB',  icon: 'tech_watch-time', class: '' },
    // { path: '/duelist', title: 'Due List',  icon: 'design_app', class: '' },
    // { path: '/fsc', title: 'FSC',  icon: 'design_app', class: '' },
    { path: '/snagreporting', title: 'Snag Reporting',  icon: 'loader_gear', class: '' },
    


];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor(private router:Router) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ( window.innerWidth > 991) {
          return false;
      }
      return true;
  };
  dashboard(){
    this.router.navigate(['/dashboard'])
  }
}
