import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FlbService } from "../services/flb.service";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { HeaderService } from "../services/header.service";

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
  headerObject = {
    recordNum: "",
    arcrftNum: "",
    status: "",
    model: "",
    dettLoc: "",
  };
  // Fetch using api
  fltTypeDomain = [
    { id: 1, name: "ABCD" },
    { id: 2, name: "WXYZ" },
    { id: 3, name: "PQRS" },
  ];
  initialStatuses = [];
  initialFltTypes = [];
  sortieNums = [];

  constructor(
    private flbService: FlbService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private headerService: HeaderService
  ) {}

  ngOnInit(): void {
    this.getSorties();
    this.getHeaders();
    this.flbService
      .getSortieNum(this.statusDomain.accept, this.recordId)
      .subscribe(
        (res) => {
          console.log("This is sortieNum response", res.body);
          this.sortieNums = res.body;
        },
        (err) => {
          console.log(err);
        }
      );

    this.getPostFlightData();

    this.flbForm = this.formBuilder.group({
      sorties: this.formBuilder.array([]),
      postFlight: this.formBuilder.array([]),
    });
  }

  getHeaders() {
    this.headerService.getPlannedAssetHeader().subscribe(
      (res) => {
        console.log("This is header response", res.body);
        this.headerObject = res.body;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  /*--------Functions for Sortie Accept reject-------*/
  // This Function fetches all the sorties and calls functions to push them to form
  getSorties() {
    this.flbService.getSorties(this.recordId).subscribe(
      (res) => {
        console.log("Fetching all sorties...");
        if (res.status == 200) {
          console.log("These are the sorties returned: ", res.body);
          res.body.forEach((sortie) => {
            this.initialStatuses.push(sortie.status);
            this.initialFltTypes.push(sortie.fltType);
            console.log(this.initialFltTypes);
            if (sortie.duration != null)
              sortie.duration = this.toHHMM(sortie.duration);
            this.addSortieRow(sortie);
          });
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
          this.initialStatuses.push(res.body.status);
          console.log(this.initialStatuses);
          if (res.status == 200) {
            this.addSortieRow(res.body);
            this.toastr.success("New sortie row added");
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
      status: [sortie?.status],
      statusDate: [sortie?.statusDate],
      changedBy: [sortie?.changedBy],
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
    if (this.flbForm.valid) {
      const sorties = data.value.sorties;
      sorties.forEach((sortie) => {
        sortie.duration = this.toSeconds(sortie.duration);
      });
      this.flbService.saveSorties(this.recordId, sorties).subscribe(
        (res) => {
          console.log(res);
          var i = 0;
          sorties.forEach((sortie) => {
            this.initialStatuses[i++] = sortie.status;
          });
          this.toastr.success("Sorties saved");
        },
        (err) => {
          this.toastr.warning("Sortie not saved due to " + err.error.message);
          console.error(err);
        }
      );
    }
  }

  // Change sortie status
  changeStatus(desiredStatus, index) {
    console.log("This is desired status", desiredStatus);
    const control = <FormArray>this.flbForm.controls["sorties"];
    const currentStatus = control.at(index).value.status;
    if (currentStatus === this.statusDomain.pending) {
      const currentValues = control.at(index).value;
      console.log("inside change status");
      for (var key in this.statusDomain) {
        console.log("Inside this for loop");
        if (this.statusDomain[key] === desiredStatus) {
          console.log("status matched");
          control.at(index).patchValue({
            ...currentValues,
            status: this.statusDomain[key],
            changedBy: this.currentUser,
            statusDate: this.toYYYY_MM_dd(new Date()),
          });
          this.toastr.success("Sortie status changed to " + desiredStatus);
          break;
        }
      }
    }
  }

  toYYYY_MM_dd(date: Date) {
    let year: any = date.getFullYear();
    let month: any = date.getMonth() + 1;
    let day: any = date.getDate();

    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }

    return year + "-" + month + "-" + day;
  }

  isSortieDate(index) {
    const sortieDate = this.getValueOf("sortieDate", index);
    return sortieDate != null;
  }

  isReasonFilled(index) {
    const reason = this.getValueOf("reason", index);
    return reason != null && reason != "";
  }

  getValueOf(key, index) {
    const value = (<FormArray>this.flbForm.controls["sorties"]).at(index).value[
      key
    ];
    return value;
  }

  resetEtdDate(index) {
    const control = <FormArray>this.flbForm.controls["sorties"];
    const currentValues = control.at(index).value;
    const sDate = new Date(currentValues.sortieDate);
    const eDate = new Date(currentValues.etdDate);
    if (eDate < sDate)
      control.at(index).patchValue({ ...currentValues, etdDate: "" });
  }

  getSortieDate(index) {
    const sortieDate = (<FormArray>this.flbForm.controls["sorties"]).at(index)
      .value.sortieDate;
    return sortieDate;
  }
  /*--------End of Functions for Sortie Accept reject-------*/

  /*--------Functions for Post Flight Data-------*/
  getPostFlightData() {
    this.flbService.getPostFlight(this.recordId).subscribe(
      (res) => {
        console.log(res);
        res.body.forEach((postFlight) => {
          console.log(this.initialFltTypes);
          this.addPostFlightRow(postFlight);
        });
      },
      (err) => {
        console.error(err);
      }
    );
  }

  // This function initializes a form group for postFlight Rows
  initPostFlight(postFlight = null) {
    return this.formBuilder.group({
      postFltId: [postFlight?.postFltId],
      fltType: [postFlight?.fltType],
      fltDate: [postFlight?.fltDate],
      flbStatus: [postFlight?.flbStatus],
      sortieNum: [postFlight?.sortieNum],
      departureTime: [postFlight?.departureTime],
      arrivalTime: [postFlight?.arrivalTime],
      fltHours: [postFlight?.fltHours],
    });
  }

  // This function pushes new postFlight row in the postFlight form array
  addPostFlightRow(postFlight = null) {
    const control = <FormArray>this.flbForm.controls["postFlight"];
    control.push(this.initPostFlight(postFlight));
  }
  /*--------Functions for Post Flight Data-------*/

  /*-----------Utility Functions----------*/
  // Convert seconds to HH:mm:ss
  toHHMM(seconds) {
    let hours: any = Math.floor(seconds / 3600);
    let minutes: any = Math.floor((seconds - hours * 3600) / 60);

    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    return hours + ":" + minutes;
  }
  // Convert HH:mm:ss to seconds
  toSeconds(duration) {
    if (duration == null) return null;
    let [hours, minutes] = duration.split(":");
    return parseInt(hours) * 60 * 60 + parseInt(minutes) * 60;
  }
  /*-----------End of Utility functions-----------*/
}
