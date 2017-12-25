import {Component, AfterViewInit} from '@angular/core';
import { UniversityService } from "../../shared/UTI.service";
import { FormBuilder, Validators, FormGroup, FormArray } from "@angular/forms";
import { StorageService } from "../../shared/storage.service";
import { Filters } from "../../shared/filters";

declare let $:any;

@Component({
  selector:'strategic-goal',
  templateUrl:'./goal.html',
  styleUrls:['./goal.css','./../planner.component.css']
})
export class GoalComponent extends Filters implements AfterViewInit{
  public goalForm: FormGroup;
  public isUpdating:boolean = false;
  // public goals:any[]=[];
  // public goalsCopy:any[]=[];
  public cycles:any[]=[];
  emptySearchResult:any;
  check:any[]=[];

  constructor(public orgService:UniversityService,
              public formBuilder: FormBuilder,
              public commonService:StorageService){
                super();
              this.getCycles();
              this.initObjectiveForm();              
  }

  ngAfterViewInit(){
    
  }

  getCycles(){
    this.orgService.getCycles().subscribe((response:any)=>{
      if(response.status == 204){
        this.cycles = [];
      }else{
        this.cycles = response;
        this.cycles.forEach(element => {
          if(element.defaultCycle)
            this.defaultCycle = element.cycleId;
        });
        this.getGoals();
      }
    })
  }

  defaultCycle:any;
  getGoals(){
    this.orgService.getObjectivesByCycleId(this.defaultCycle).subscribe((response:any)=>{
      if(response.status == 204){
        this.goals = [];
        this.goalsCopy = [];  
      }else{
      this.goals = response;
      this.goalsCopy = response;
    }
    })
  }
  
  initObjectiveForm() {
    this.goalForm = this.formBuilder.group({
      "cycleId":['',[Validators.required]],
      "goal": ['', [Validators.required]],
      // "totalCost": ['', [Validators.required]],
      // "spis": this.formBuilder.array([this.inItSpi()]),
    });
  }
  // inItSpi() {
  //   return this.formBuilder.group({
  //     "spi": ['', [Validators.required]],
  //     "measureUnit": ['', [Validators.required]],
  //     "currentLevel": ['', [Validators.required]],
  //     "frequencyId":[1],
  //     "targetDigital": this.formBuilder.array(this.inItTarget())
  //   });
  // }  
  // inItTarget() {
  //   const fa:any[] = [];
  //   this.commonService.getData('org_info').cycle.forEach((element:any) => {
  //     fa.push(this.inItTargetDigital(element));
  //   });
  //   return fa;
  // }

  // inItTargetDigital(year:any) {
  //   return this.formBuilder.group({
  //     "year": [year, [Validators.required]],
  //     "expectedLevel": ['', [Validators.required]],
  //   });
  // }

  // addSpi(form:any) {
  //   const control = <FormArray>form.controls['spis'];
  //   control.push(this.inItSpi());
  // }

  // removeSpi(form:any, index:any) {
  //   const control = <FormArray>form.controls['spis'];
  //   control.removeAt(index);
  // }

  disable(event:any,e2:any){

  }

  onSubmit() {
    // this.goalForm.value["cycleId"] = this.commonService.getData('org_info').cycles[0].cycleId;/
    console.log(this.goalForm.value);
    if(!this.isUpdating){
      this.orgService.addObjective(this.goalForm.value).subscribe((response:any) => {
        $('#objectModal').modal('show');
        // this.returnedObject = response;
        // this.goals.push(this.returnedObject);
        // this.initObjectiveForm();
        this.goalForm.controls["goal"].reset();
        this.getGoals();
      }, (error:any) => {
        console.log(error);
      });
    }
    
    if(this.isUpdating){
      if(confirm("Are you sure you want to Update this Goal?"))
      this.orgService.updateObjective(this.selectedObjective.goalId,this.goalForm.value).subscribe((res:any)=>{
        console.log(res);
        $('#objectModal').modal('show');
        this.goalForm.reset();
        this.getGoals();
        this.isUpdating=false;
      })
    }
    
  }
  deleteGoal(goalId:any,goals:any[],index:any){
    if(confirm("Are you sure you want to delete this Goal?"))
    this.orgService.deleteObjective(goalId).subscribe((res:any)=>{
      console.log(res);
      goals.splice(index,1);
    })
  }
  selectedObjective:any;
  updateGoal(goal:any){
    this.selectedObjective = goal;
    this.isUpdating=true;
    this.goalForm.patchValue({goal:goal.goal,cycleId:this.defaultCycle});  
  }
}
