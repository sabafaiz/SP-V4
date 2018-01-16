import { Component, AfterViewInit } from '@angular/core';
import { UniversityService } from "../../shared/UTI.service";
import { FormBuilder, Validators, FormGroup, FormArray } from "@angular/forms";
import { StorageService } from "../../shared/storage.service";
import { Filters } from "../../shared/filters";

import * as alertify from 'alertifyjs';
import { LoaderService } from '../../shared/loader.service';

declare let $: any;

@Component({
  selector: 'strategic-goal',
  templateUrl: './goal.html',
  styleUrls: ['./goal.css', './../planner.component.css']
})
export class GoalComponent extends Filters implements AfterViewInit {
  public goalForm: FormGroup;
  public isUpdating: boolean = false;
  // public goals:any[]=[];
  // public goalsCopy:any[]=[];
  public cycles: any[] = [];
  emptySearchResult: any;
  check: any[] = [];

  constructor(public orgService: UniversityService,
    public formBuilder: FormBuilder,
    public commonService: StorageService,
    private loaderService:LoaderService) {
    super();
    this.getCycles();
    this.goalForm = this.initObjectiveForm();
  }
  

  ngAfterViewInit() {

  }

  getCycles() {
    this.loaderService.display(true);
    this.orgService.getCycles().subscribe((response: any) => {
      if (response.status == 204) {
        this.cycles = [];
      } else {
        this.cycles = response;
        this.cycles.forEach(element => {
          if (element.defaultCycle)
            this.defaultCycle = element.cycleId;
        });
        this.getGoals();
      }
    });
  }

  defaultCycle: any;
  getGoals() {
    this.orgService.getObjectivesByCycleId(this.defaultCycle).subscribe((response: any) => {
      if (response.status == 204) {
        this.goals = [];
        this.goalsCopy = [];
      } else {
        this.goals = response;
        this.goalsCopy = response;
      }
      this.loaderService.display(false);      
    },(error:any)=>{
      this.loaderService.display(false);            
    })
  }

  initObjectiveForm() {
    return this.formBuilder.group({
      "cycleId": [this.defaultCycle, [Validators.required]],
      "goal": ['', [Validators.required]],
      // "totalCost": ['', [Validators.required]],
      // "spis": this.formBuilder.array([this.inItSpi()]),
    });
  }

  onSubmit() {
    if (!this.isUpdating) {
      this.orgService.addObjective(this.goalForm.value).subscribe((response: any) => {
        // $('#objectModal').modal('show');
        alertify.notify('You have successfully added a new Goal.', 'success', 5, function(){  console.log('dismissed'); });
        $("#add-plan").hide();
        this.goalForm.controls["goal"].reset();
        this.getGoals();
      }, (error: any) => {
        alertify.alert("Something went wrong..");
      });
    }

    if (this.isUpdating) {
      alertify.confirm("Are you sure you want to Update this Goal?",()=>{
        this.orgService.updateObjective(this.selectedObjective.goalId, this.goalForm.value).subscribe((res: any) => {
          // $('#objectModal').modal('show');
          alertify.notify('You have successfully added a new Goal.', 'success', 5, function(){  console.log('dismissed'); });
          this.goalForm =  this.initObjectiveForm()
          this.getGoals();
          this.isUpdating = false;
        },(error:any)=>{      
          alertify.alert("Something went wrong..");
        });
      });        
    }

  }
  deleteGoal(goalId: any, goals: any[], index: any) {
    alertify.confirm("Are you sure you want to delete this Goal?",()=>{
      this.orgService.deleteObjective(goalId).subscribe((res: any) => {
        goals.splice(index, 1);
      },(error:any)=>{      
        alertify.alert("Something went wrong..");
      });
    })
      
  }
  selectedObjective: any;
  updateGoal(goal: any) {
    this.selectedObjective = goal;
    this.isUpdating = true;
    this.goalForm.patchValue({ goal: goal.goal, cycleId: this.defaultCycle });
    $("#add-plan").show();
    $("#collapse1").collapse('show');
  }

  addNewGoal() {
    $("#add-plan").show();    
    this.isUpdating = false;
    $("#collapse1").collapse('show');
    this.goalForm =  this.initObjectiveForm()

  }

  disable(event:any,goalId:any){
    if(event.srcElement.checked)
      alertify.confirm("Do you Really want to disable this Goal??",()=>{
        this.orgService.disableGoal(goalId).subscribe((response:any)=>{
          alertify.success("You disabled the Goal..");
          this.getGoals();
        },()=>{
          event.srcElement.checked = !event.srcElement.checked;
          alertify.error("Something went wrong..")
        })
      },()=>{
        event.srcElement.checked = !event.srcElement.checked;
        alertify.error("Action was not performed")
      });
    else
      alertify.confirm("Do you Really want to enable this Goal??",()=>{
        this.orgService.enableGoal(goalId).subscribe((response:any)=>{
          alertify.success("You enabled the Goal..");
          this.getGoals();
        },()=>{
          event.srcElement.checked = !event.srcElement.checked;
          alertify.error("Something went wrong..")
        })
      },()=>{
        event.srcElement.checked = !event.srcElement.checked;
        alertify.error("Action was not performed")
      });      
  }

  closeForm(){
    $("#add-plan").hide();
  }
}
