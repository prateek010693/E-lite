import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FlbService } from "../services/flb.service";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ValueConverter } from "@angular/compiler/src/render3/view/template";

@Component({
  selector: "app-flb",
  templateUrl: "./flb.component.html",
  styleUrls: ["./flb.component.css"],
})
export class FlbComponent implements OnInit {
  currentUser = localStorage.getItem("userName");
  flbForm: FormGroup;
  recordId = "1001";
  currentDate = new Date();
  statusDomain = {
    accept: "ACCEPTED",
    reject: "REJECTED",
    pending: "PENDING",
    closed: "CLOSED",
  };
  fltTypeDomain = [
    { id: 1, name: "AIR TEST" },
    { id: 2, name: "ROUTINE" },
  ];

  constructor(
    private flbService: FlbService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.flbForm = this.formBuilder.group({
      sorties: this.formBuilder.array([]),
    });
    this.getSorties();
  }

  /*--------Functions for Sortie Accept reject-------*/
  // This Function fetches all the sorties and calls functions to push them to form
  getSorties() {
    this.flbService.getSorties(this.recordId).subscribe(
      (res) => {
        console.log("Fetching all sorties...");
        if (res.status == 200) {
          console.log("These are the sorties returned: ", res.body);
          res.body.forEach((sortie) => this.addSortieRow(sortie));
        }
      },
      (error: HttpErrorResponse) => {
        console.error("Error message from backend: ", error.error.message);
        console.log("this is error status", error.status);
        if (error.status == 400) {
          console.log("The status of this error is 400");
        }
      }
    );
  }

  // This function creates a new sortie and pushes it to the form array
  createNewSortie() {
    console.log(this.currentUser);
    this.flbService
      .createSortie(this.recordId, { changedBy: this.currentUser })
      .subscribe(
        (res) => {
          console.log(res.body);
          console.log(res.status);
          if (res.status == 200) {
            this.addSortieRow(res.body);
          }
        },
        (error) => {
          console.log("Am i here or not");
          console.log(error);
        }
      );
  }

  // This function initializes a form group for sortie Rows
  initSortie(sortie = null) {
    return this.formBuilder.group({
      sortieId: [sortie?.sortieId],
      recordId: [sortie?.recordId],
      sortieNum: [sortie?.sortieNum, Validators.required],
      sortieDate: [sortie?.sortieDate, Validators.required],
      etdDate: [sortie?.etdDate, Validators.required],
      etd: [sortie?.etd, Validators.required],
      duration: [sortie?.duration, Validators.required],
      fltType: [sortie?.fltType],
      status: [sortie?.status, Validators.required],
      statusDate: [sortie?.statusDate, Validators.required],
      changedBy: [sortie?.changedBy, Validators.required],
      remarks: [sortie?.remarks],
      reason: [sortie?.reason],
    });
  }

  // This function pushes new sorite row in the sortie form array
  addSortieRow(sortie = null) {
    const control = <FormArray>this.flbForm.controls["sorties"];
    control.push(this.initSortie(sortie));
  }

  // Save the sorties in backend
  save(data) {
    const sorties = data.value.sorties;
    this.flbService.saveSorties(this.recordId, sorties).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  changeStatus(desiredStatus, index) {
    console.log(desiredStatus);
    const control = <FormArray>this.flbForm.controls["sorties"];
    const currentStatus = control.at(index).value.status;
    if (currentStatus === this.statusDomain.pending) {
      const currentValues = control.at(index).value;
      if (desiredStatus === this.statusDomain.reject) {
      } else {
        console.log(
          control
            .at(index)
            .patchValue({ ...currentValues, status: desiredStatus })
        );
      }
    }
  }

  isSortieDate(index) {
    const sortieDate = (<FormArray>this.flbForm.controls["sorties"]).at(index)
      .value.sortieDate;
    return sortieDate != null;
  }

  isReasonFilled(index) {
    const reason = (<FormArray>this.flbForm.controls["sorties"]).at(index).value
      .reason;
    return reason;
  }
  /*--------End of Functions for Sortie Accept reject-------*/

  /*--------Functions for Post Flight Data-------*/
  /*--------Functions for Post Flight Data-------*/
}
