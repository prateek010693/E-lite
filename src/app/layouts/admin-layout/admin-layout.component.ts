import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Router} from '@angular/router';

@Component({
    selector: 'app-admin-layout',
    templateUrl: './admin-layout.component.html',
    styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
    sidebarDrag : boolean = true

    constructor(public location: Location, private router: Router) { }

    ngOnInit() { }
    dragSidebar() {
        console.log('this.sidebarDrag',this.sidebarDrag )
        if(this.sidebarDrag == true){
            this.sidebarDrag = false;
            console.log('this.sidebarDrag if',this.sidebarDrag)
        }
        else{
            this.sidebarDrag = true;
            console.log('this.sidebarDrag else',this.sidebarDrag)
        }
        console.log('something',)
    }

}
