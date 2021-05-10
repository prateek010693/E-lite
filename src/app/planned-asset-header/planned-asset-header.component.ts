import { Component, OnInit } from "@angular/core";
import { HeaderService } from "../services/header.service";

@Component({
  selector: "planned-asset-header",
  templateUrl: "./planned-asset-header.component.html",
  styleUrls: ["./planned-asset-header.component.css"],
})
export class PlannedAssetHeaderComponent implements OnInit {
  headerObject = {
    arcrftLoc: "",
    arcrftNum: "",
    dettLoc: "",
    dettLocBase: "",
    model: "",
    recordNum: "",
    returnDate: "",
    status: "",
    trnsfrDate: "",
    variation: "",
  };

  constructor(private headerService: HeaderService) {}

  ngOnInit(): void {
    this.headerService.getPlannedAssetHeader().subscribe(
      (res) => {
        console.log(res.body);
        this.headerObject = res.body;
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
