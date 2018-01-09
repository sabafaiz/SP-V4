import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UniversityService } from "../../shared/UTI.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { StorageService } from "../../shared/storage.service";
import { Filters } from "../../shared/filters";

declare let $: any;

@Component({
  selector: 'activities',
  templateUrl: './activity.html',
  styleUrls: ['./activity.css', './../planner.component.css']
})
export class ActivityComponent extends Filters implements OnInit, AfterViewInit {
  // [x: string]: any;
  public cycles: any[] = [];
  // public goals: any[] = [];
  // public goalsCopy: any[] = [];

  public activityForm: FormGroup;
  public quarter: any[] = ["Q1", "Q2", "Q3", "Q4"];
  public objectives: any[];
  public objectiveIndex: any[] = [];
  public initiatives: any[];
  public isUpdating: boolean = false;

  constructor(public orgService: UniversityService,
    public formBuilder: FormBuilder,
    public commonService: StorageService) {
    super();
    this.orgService.getCycleWithChildren().subscribe((response: any) => {
      if (response.status == 204) {
        this.cycles = [];
        this.objectives = [];
      } else {
        this.cycles = response;
        this.cycles.forEach(element => {
          if (element.defaultCycle) {
            this.defaultCycle = element.cycleId;
          }
        });
        this.getActivities();
      }
    });
    this.activityForm = this.setActivity();
  }

  ngOnInit() {
    // this.getActivities();
  }

  ngAfterViewInit() {
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }

  getObjective(cycleId: any) {
    this.cycles.forEach(element => {
      if (element.cycleId == cycleId) {
        this.objectives = element.goals;
        return;
      }
    });
  }
  defaultCycle: any;
  getActivities() {
    this.orgService.getActivitiesByCycleId(this.defaultCycle).subscribe((response: any) => {
      if (response.status == 204) {
        this.goals = [];
        this.goalsCopy = [];
      } else {
        this.goals = response;
        this.goalsCopy = response;
        this.initFilters(response);
      }
    });
  }

  // emptySearchResult:any;
  // search(key:any){
  //   this.goals = this.goalsCopy;
  //   let val = key.target.value;
  //   if (val && val.trim() != '') {
  //     this.emptySearchResult = false;
  //     this.goals = this.goalsCopy.filter((item: any) => {
  //       return (item.goal.toLowerCase().indexOf(val.toLowerCase()) > -1);
  //     })
  //     if (this.goals.length === 0)
  //       this.emptySearchResult = true;
  //     else
  //       this.emptySearchResult = false;
  //   }
  // }

  getInitiative(objId: any) {
    if (objId) {
      this.objectives.forEach((element: any) => {
        if (element.goalId == objId) {
          this.initiatives = element.initiatives;
          return;
        }
      });
    } else {
      this.initiatives = [];
    }
  }

  setActivity() {
    return this.formBuilder.group({
      "cycleId": [this.defaultCycle, [Validators.required]],
      "objectiveId": ['', [Validators.required]],
      "initiativeId": ['', [Validators.required]],
      "activity": ['', [Validators.required]],
      // "measures": this.formBuilder.array([this.setMeasure()])
    });
  }
  // setMeasure() {
  //   return this.formBuilder.group({
  //     "measure": ['', [Validators.required]],
  //     "frequencyId": [1, [Validators.required]],
  //     "measureUnit": ['', [Validators.required]],
  //     "currentLevel": ['', [Validators.required]],
  //     "direction": ['', [Validators.required]],
  //     "annualTarget": this.formBuilder.array(this.setAnnualTarget())
  //   });
  // }
  // setAnnualTarget() {
  //   const annualTarget:any[] = [];
  //   this.commonService.getData('org_info').cycle.forEach((element:any) => {
  //     annualTarget.push(this.inItTargetIn(element));
  //   });
  //   return annualTarget;
  // }
  // inItTargetIn(year:any) {
  //   return this.formBuilder.group({
  //     "year": [year, [Validators.required]],
  //     "levels": this.formBuilder.array([this.inItLevels(this.quarter[0])]),
  //     "estimatedCost": ['', [Validators.required]]
  //   });
  // }

  // inItLevels(q:any) {
  //   return this.formBuilder.group({
  //     "quarter": [q],
  //     "startDate": ["2017-04-01"],
  //     "endDate":["2018-04-15"],
  //     "estimatedTargetLevel": ['', [Validators.required]]
  //   });
  // }

  submitActivity() {
    delete this.activityForm.value["cycleId"];
    delete this.activityForm.value["objectiveId"];
    if (!this.isUpdating) {
      this.orgService.saveActivity(this.activityForm.value)
        .subscribe(response => {
          $("#add-activity").hide();
          $('#activityModal').modal('show');
          this.getActivities();
          this.activityForm.controls["activity"].reset();
        });
    } else if (confirm("Are you sure you want to Update this Activity?")) {
      delete this.activityForm.value["initiativeId"];
      this.orgService.updateActivity(this.seletedActivity.activityId, this.activityForm.value).subscribe((res: any) => {
        this.getActivities();
        $('#activityModal').modal('show');
        this.isUpdating = false;
        this.activityForm = this.setActivity();
      });
    }
  }

  deleteActivity(activityId: any, activities: any[], index: any) {
    if (confirm("Are you sure you want to delete this Activity?"))
      this.orgService.deleteActivity(activityId).subscribe((res: any) => {
        console.log(res);
        activities.splice(index, 1);
      })
  }
  seletedActivity: any;
  updateActivity(objective: any, initiative: any, activity: any) {
    $("#collapse1").collapse('show');
    this.isUpdating = true;
    this.seletedActivity = activity;
    this.activityForm.controls["cycleId"].disable();
    this.activityForm.controls["objectiveId"].disable();
    this.activityForm.controls["initiativeId"].disable();
    this.activityForm.patchValue({
      cycleId: this.defaultCycle,
      objectiveId: objective.goalId,
      initiativeId: initiative.initiativeId,
      activity: activity.activity
    });
    $("#add-activity").show();    
  }

  enableFields() {
    this.activityForm.controls["cycleId"].enable();
    this.activityForm.controls["objectiveId"].enable();
    this.activityForm.controls["initiativeId"].enable();
    this.activityForm = this.setActivity();
    $("#add-activity").hide();    
  }

  getRowSpan(array: any[]) {
    var rowSpan = 1;
    rowSpan += array.length;
    array.forEach((element) => {
      rowSpan += element.activities.length;
      // element.activities.forEach((innerElement:any) => {
      //   rowSpan += innerElement.measures.length;
      // });
    });
    if (rowSpan == 1)
      return rowSpan + 1;
    return rowSpan;
  }

  getRowSpanOfIni(array: any[]) {
    var rowSpan = 1;
    rowSpan += array.length * 2;
    // array.forEach((innerElement:any) => {
    //   rowSpan += innerElement.measures.length;
    // });
    return rowSpan;
  }

  addNewActivity(){
    this.enableFields(); 
    this.isUpdating = false;
    $("#add-activity").show();
    $("#collapse1").collapse('show');
    this.activityForm = this.setActivity();

  }

  get(e){
    var promise = new Promise((resolve:any,reject:any)=>{     $(e)["0"].height = $(e)["0"].clientHeight;     resolve();    }) ;   
    return promise;
  }

}