import {Component} from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { StorageService } from "../../shared/storage.service";
import { UniversityService } from "../../shared/UTI.service";

declare let $:any;

@Component({
  selector:'strategic-plan',
  templateUrl:'./plan.html',
  styleUrls:['./../planner.component.css']
})
export class PlanComponent{
  selectedCycle: any;
  isUpdating: boolean;
  title:string = "Strategic Plan";
  cycleForm:FormGroup;
  cycles:any[]=[];
  status:any[]=[];
  constructor(public ss:StorageService,public orgService:UniversityService){
    this.cycleForm = new FormGroup({
      "universityId":new FormControl(this.ss.getData('org_info').universityId),
      "description":new FormControl('',[Validators.required]),
      "planYear":new FormControl('',[Validators.required]),
      "startYear":new FormControl('',[Validators.required]),
      "endYear":new FormControl('',[Validators.required]),
      "active":new FormControl(false,[Validators.required])
    });  
    this.getCycles();
  }

  getCycles(){
    this.orgService.getCycles().subscribe((response:any)=>{
      if(response.status == 204){
        this.cycles = [];
      }else{
        this.cycles = response;
        console.log(this.cycles);
      }
    }) 
  }

  editCycle(c:any){
    this.isUpdating = true;
    this.selectedCycle = c;
    this.cycleForm.patchValue(c);
    $("#collapse1").collapse('show');
  }

  onSubmit(){
    if(!this.isUpdating)
      this.orgService.saveCycle(this.cycleForm.value).subscribe((response:any)=>{
        this.isUpdating = false;        
        this.getCycles();
        this.cycleForm.reset();
      });
    else{
      var data={};
      data['description'] = this.cycleForm.value["description"];
      data['endYear'] = this.cycleForm.value["endYear"];
      this.orgService.updateCycle(this.selectedCycle.cycleId,data).subscribe((response:any)=>{
        this.isUpdating = false;
        this.getCycles();
        this.cycleForm.reset();
      })
    }
  }

  changeStatus(event:any,c:any){
    if(event.srcElement.checked){
      const forDiabled =  confirm("Are you sure you want to disable it");
      if(forDiabled){
        this.orgService.disableCycle(c.cycleId).subscribe((response:any)=>{
          console.log(response);
        });
      } else { 
        event.srcElement.checked = !event.srcElement.checked;
      }
      debugger
    }else{
      const forEnabled = confirm("Are you sure you want to enable it");
      if(forEnabled){
        this.orgService.enableCycle(c.cycleId).subscribe((response:any)=>{
          console.log(response);
        })
      } else {
        event.srcElement.checked = !event.srcElement.checked;
      }
    }
  }

  deleteCycle(cycleId:any){
    if(confirm("Do you Really want to Delete this Cycle??"))
    this.orgService.deleteCycle(cycleId).subscribe((response:any)=>{
      this.getCycles();
    },(error:any)=>{
      confirm("You Can not Delete this Cycle??")
    })
  }

  reset(){
    this.isUpdating = false;
    this.cycleForm.reset();
  }
}