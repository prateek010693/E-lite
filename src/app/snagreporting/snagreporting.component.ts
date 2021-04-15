import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-snagreporting',
  templateUrl: './snagreporting.component.html',
  styleUrls: ['./snagreporting.component.css']
})
export class SnagreportingComponent implements OnInit {
  id :string = "A-123456"
  constructor(public router:Router) {
   }

  ngOnInit(): void {
  }
  snagId(id){
  	this.router.navigate(['snagreporting/snagreportingdetails/'+id])
  	console.log('snag')
  }
}
