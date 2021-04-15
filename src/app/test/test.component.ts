import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Renderer2 } from '@angular/core'
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  workorderTabs : any = ['Workorder','Task Level Compliance','Meter Compliance','Arming/Dearming','Assest Install/Remove'];
  selectedItem :any
  constructor(private router:Router ,private render:Renderer2) { }

  ngOnInit(): void {
  }
  // selectedworkorder(val,i){

  //   let valueTrim = val.toLowerCase().replace(/ +/g,"").replace('/','')
  //   if(valueTrim == "workorder"){
  //     console.log('valueTrim++++++++++',valueTrim)
  //     this.router.navigate(['workorder'])
  //   }
  //   else{
  //     console.log('valueTrim------',valueTrim)
  //     this.router.navigate(['workorder/'+valueTrim])
  //   }  
  // }
  selectedworkorder(event,val){
    console.log('val',val)
    this.selectedItem = val
  }
}
