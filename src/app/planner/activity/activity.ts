import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UniversityService } from "../../shared/UTI.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { StorageService } from "../../shared/storage.service";
import { Filters } from "../../shared/filters";
import * as alertify from 'alertifyjs';
import { LoaderService } from '../../shared/loader.service';


declare let $: any;

@Component({
  selector: 'activities',
  templateUrl: './activity.html',
  styleUrls: ['./activity.css', './../planner.component.css']
})
export class ActivityComponent extends Filters implements OnInit, AfterViewInit {
  public cycles: any[] = [];
  public activityForm: FormGroup;
  public quarter: any[] = ["Q1", "Q2", "Q3", "Q4"];
  public objectives: any[];
  public objectiveIndex: any[] = [];
  public initiatives: any[];
  public isUpdating: boolean = false;

  constructor(public orgService: UniversityService,
    public formBuilder: FormBuilder,
    public commonService: StorageService,
    private loaderService:LoaderService) {
    super();
    this.loaderService.display(true);
    this.getCycleWithChildren(false);
    this.activityForm = this.setActivity();
  }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }
  
  getCycleWithChildren(flag:any){
    this.orgService.getCycleWithChildren(flag).subscribe((response: any) => {
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
        if(!flag)
        this.getActivities();
      }
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
      this.loaderService.display(false);
    },(error:any)=>{
      this.loaderService.display(false);
    });
  }


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
    });
  }

  submitActivity() {
    delete this.activityForm.value["cycleId"];
    delete this.activityForm.value["objectiveId"];
    if (!this.isUpdating) {
      this.orgService.saveActivity(this.activityForm.value)
        .subscribe(response => {
          $("#add-activity").hide();
          alertify.notify("Saved successfully .,.");
          this.getActivities();
          this.activityForm.controls["activity"].reset();
        })
    } else {
      alertify.confirm("Are you sure you want to Update this Activity?",()=> {
      delete this.activityForm.value["initiativeId"];
      this.orgService.updateActivity(this.seletedActivity.activityId, this.activityForm.value).subscribe((res: any) => {
          this.getActivities();
          alertify.notify("Updated successfully .,.");        
          this.isUpdating = false;
          this.activityForm = this.setActivity();
        });
      });
  }
  }

  deleteActivity(activityId: any, activities: any[], index: any) {
    alertify.confirm("Are you sure you want to delete this Activity?",()=>{
      this.orgService.deleteActivity(activityId).subscribe((res: any) => {
        activities.splice(index, 1);
        alertify.notify("Deleted successfully .,.");        
      });
    })
  }
  seletedActivity: any;
  updateActivity(objective: any, initiative: any, activity: any,highlight:any) {
    $(".to-be-highlighted").removeClass("highlight");
    $(highlight).addClass("highlight");
    $("#add-activity").show();
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
  }

  closeForm(){
    this.enableFields();
    this.isUpdating = false;
    this.getCycleWithChildren(false);
  }

  enableFields() {
    this.activityForm.controls["cycleId"].enable();
    this.activityForm.controls["objectiveId"].enable();
    this.activityForm.controls["initiativeId"].enable();
    this.activityForm = this.setActivity();
    $("#add-activity").hide(); 
    $(".to-be-highlighted").removeClass("highlight");   
  }

  addNewActivity(){
    this.enableFields(); 
    this.isUpdating = false;
    $("#add-activity").show();
    $("#collapse1").collapse('show');
    this.getCycleWithChildren(true);
    this.activityForm = this.setActivity();
  }

  disable(event:any,activityId:any){
    if(event.srcElement.checked)
      alertify.confirm("Do you Really want to disable this Activity??",()=>{
        this.orgService.disableActivity(activityId).subscribe((response:any)=>{
          alertify.success("You disabled the Activity..");
          this.getActivities();
        },()=>{
          event.srcElement.checked = !event.srcElement.checked;
          alertify.error("Something went wrong..")
        })
      },()=>{
        event.srcElement.checked = !event.srcElement.checked;
        alertify.error("Action was not performed")
      });
    else
      alertify.confirm("Do you Really want to enable this Activity??",()=>{
        this.orgService.enableActivity(activityId).subscribe((response:any)=>{
          alertify.success("You enabled the Activity..");
          this.getActivities();
        },()=>{
          event.srcElement.checked = !event.srcElement.checked;
          alertify.error("Something went wrong..")
        })
      },()=>{
        event.srcElement.checked = !event.srcElement.checked;
        alertify.error("Action was not performed")
      });      
  }

  get(e){
    var promise = new Promise((resolve:any,reject:any)=>{     $(e)["0"].height = $(e)["0"].clientHeight;     resolve();    }) ;   
    return promise;
  }

}