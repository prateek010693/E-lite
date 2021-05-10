import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FlbService } from "../services/flb.service";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-flb",
  templateUrl: "./flb.component.html",
  styleUrls: ["./flb.component.css"],
})
export class FlbComponent implements OnInit {
  sortieForm: FormArray;
  sorties = [];
  createForm() {
    this.sortieForm = this.formBuilder.array(this.sorties);
  }

  constructor(
    private flbService: FlbService,
    private formBuilder: FormBuilder
  ) {}
  recordId = "1001";

  ngOnInit(): void {
    this.flbService.getSorties(this.recordId).subscribe(
      (res) => {
        console.log("Fetching all sorties...");
        if (res.status == 200) {
          this.sorties = res.body;
          console.log(res);
        }
      },
      (error: HttpErrorResponse) => {
        console.log("finally I caught the error:", error.error.message);
        console.log("this is error status", error.status);
        if (error.status == 400) {
          console.log("The status of this error is 400");
        }
      }
    );
  }

  createNewSortie() {
    this.flbService.createSortie(this.recordId, {}).subscribe(
      (res) => {
        console.log(res.body);
        console.log(res.status);
        if (res.status == 200) {
          this.sorties = [...this.sorties, res.body];
          console.log(this.sorties);
        }
      },
      (error) => {
        console.log("Am i here or not");
        console.log(error);
      }
    );
  }

  addNewRow(row: object, targetArray: FormArray) {
    targetArray.push(this.formBuilder.control(row));
  }
}
