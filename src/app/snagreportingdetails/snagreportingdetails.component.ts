import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-snagreportingdetails',
  templateUrl: './snagreportingdetails.component.html',
  styleUrls: ['./snagreportingdetails.component.css']
})
export class SnagreportingdetailsComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }
  back(){
    this.router.navigate(['/snagreporting'])
  }
}
