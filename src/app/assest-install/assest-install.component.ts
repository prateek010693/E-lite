import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-assest-install',
  templateUrl: './assest-install.component.html',
  styleUrls: ['./assest-install.component.css']
})
export class AssestInstallComponent implements OnInit {
  id: any;
  isDisabled : boolean = false
  constructor(private activatedRoute:ActivatedRoute,
    ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(param =>{
      this.id = param.id
      console.log('this.id',this.id)
    })
    if(this.id == "null"){
      this.isDisabled=true

    }
  }

}
