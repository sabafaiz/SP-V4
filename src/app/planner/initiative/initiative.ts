import {Component} from '@angular/core';
import { UniversityService } from "../../shared/UTI.service";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { StorageService } from "../../shared/storage.service";
import { Filters } from "../../shared/filters";

declare let $:any;

@Component({
  selector:'initiatives',
  templateUrl:'./initiative.html',
  styleUrls:['./initiative.css','./../planner.component.css']
})
export class InitiativeComponent extends Filters{
  public cycles:any[]=[];
  // public goals:any[]=[];
  // public goalsCopy:any[]=[];
  public objectives:any[]=[];
  public initiativeForm: FormGroup;
  public isUpdating:boolean = false;
  public quarter:any[] = ["Q1","Q2","Q3","Q4"];
  constructor(public orgService:UniversityService, 
              public formBuilder: FormBuilder,
              public commonService:StorageService){
                super();
              this.getCycleWithChildren();              
              this.initiativeForm = this.initForm();
  }

  getCycleWithChildren(){
    this.orgService.getCycleWithChildren().subscribe((response:any)=>{
      if(response.status == 204){
        this.cycles = [];
      }else{
        this.cycles = response;
        this.cycles.forEach(element => {
          if(element.defaultCycle)
            this.defaultCycle = element.cycleId;
        });
        this.getInitiative();
      }
    })
  }

  getObjective(cycleId:any){
    this.cycles.forEach(element => {
      if(element.cycleId == cycleId){
        this.objectives = element.goals;
        return;
      }
    });
  }
  defaultCycle:any;
  getInitiative(){
    this.orgService.getInitiativesByCycleId(this.defaultCycle).subscribe((response:any)=>{
      if(response.status == 204){
        this.goals = [];
        this.goalsCopy = [];  
      }else{
        this.goals = response;
        this.goalsCopy = response;
        this.initFilters(response);
      }      
    });
  }

  initForm(){
    return this.formBuilder.group({
      "cycleId":[this.defaultCycle,[Validators.required]],
      "goalId":['',[Validators.required]],
      "initiative": ['', [Validators.required]],
      // "totalCost": ['', [Validators.required]],
      // "activities": this.formBuilder.array([this.setActivity()])
    });
  }
  // setActivity() {
  //   return this.formBuilder.group({
  //     "activity": ['', [Validators.required]],
  //     "measures": this.formBuilder.array([this.setMeasure()])
  //   });
  // }
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

  // addActivity(form:any) {
  //   const control = <FormArray>form.controls['activities'];
  //   control.push(this.setActivity());
  // }
  // removeActivity(form:any, i:any) {
  //   const control = <FormArray>form.controls['activities'];
  //   control.removeAt(i);
  // }
  // addMeasure(form:any) {
  //   const control = <FormArray>form.controls['measures'];
  //   control.push(this.setMeasure());
  // }
  // removeMeasure(form:any, j:any) {
  //   const control = <FormArray>form.controls['measures'];
  //   control.removeAt(j);
  // }

  // setTargetTable(form:any, e:any) {
  //   for (var index = 0; index < this.commonService.getData('org_info').cycle.length; index++) {
  //     form[index].controls['levels'] = this.formBuilder.array([]);
  //     const levels = <FormArray>form[index].controls['levels'];
  //     for (var i = 0; i < e; i++) {
  //       levels.push(this.inItLevels(this.quarter[i]));
  //     }
  //   }
  // }

  submitInitiative() {
    delete this.initiativeForm.value["cycleId"];
    if(!this.isUpdating)
      this.orgService.addInitiative(this.initiativeForm.value).subscribe((res:any) => {
        this.getInitiative();
        $("#add-initiative").hide();
        $('#initiativeModal').modal('show');      
        this.initiativeForm.controls["initiative"].reset();
      }, err => {
        console.log(err);
      });
    else
      if(confirm("Are you sure you want to update this Initiative?"))
      this.orgService.updateInitiative(this.selectedInitiative.initiativeId,this.initiativeForm.value).subscribe((res:any)=>{
        $("#add-initiative").hide();        
        this.getInitiative();
        $('#initiativeModal').modal('show');
        this.isUpdating=false;
      })
  }

  deleteInitiative(initiativeId:any,initiatives:any[],index:any){
    if(confirm("Are you sure you want to delete this Initiative?"))
    this.orgService.deleteInitiative(initiativeId).subscribe((res:any)=>{
      console.log(res);
      initiatives.splice(index,1);
      this.getInitiative();
    })
  }

  selectedInitiative:any;
  updateInitiative(goalId:any,initiative:any){
    this.isUpdating=true;
    this.initiativeForm.controls["cycleId"].disable();
    this.initiativeForm.controls["goalId"].disable();
    this.selectedInitiative = initiative;
    this.initiativeForm.patchValue({cycleId:this.defaultCycle, 
                                    goalId:goalId, 
                                    initiative:initiative.initiative});
    $("#add-initiative").show();                                       
  }

  enableFields(){
    $("#add-initiative").hide();                                        
    this.initiativeForm.controls["cycleId"].enable();
    this.initiativeForm.controls["goalId"].enable();
    this.initiativeForm = this.initForm();
  }

  addNewInitiative(){
    $("#add-initiative").show();                                            
    this.isUpdating=false;
    $("#collapse1").collapse('show');
    this.initiativeForm = this.initForm();

  }

  get(e){
    var promise = new Promise((resolve:any,reject:any)=>{     $(e)["0"].height = $(e)["0"].clientHeight;     resolve();    });    
    return promise;
  }
}