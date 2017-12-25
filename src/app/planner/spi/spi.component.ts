import { Component, AfterViewInit} from '@angular/core';
import { UniversityService } from "../../shared/UTI.service";
import { FormBuilder, Validators, FormGroup, FormArray } from "@angular/forms";
import { StorageService } from "../../shared/storage.service";

declare let $:any;

@Component({
  selector: 'spi',
  templateUrl: './spi.component.html',
  styleUrls: ['./../planner.component.css']
})
export class SPIComponent implements AfterViewInit{
  public cycles:any[]=[];
  public spis: any[]=[];
  public objectives: any[];
  public spiForm: FormGroup;
  constructor(public orgService: UniversityService,
    public formBuilder: FormBuilder,
    public commonService: StorageService) {
    // this.orgService.getObjectives().subscribe((response: any) => {
    //   this.objectives = response;
    // });
    this.getCycles();
    this.getSpis();
    this.spiForm = this.inItSpi();
  }

  ngAfterViewInit(){
    
  }

  getCycles(){
    this.orgService.getCycleWithChildren().subscribe((response:any)=>{
      if(response.status == 204){
        this.cycles = [];
      }else{
        this.cycles = response;
      }
    })
  }

  getObjective(cycleId:any){
    if(cycleId)
    this.objectives = this.cycles[cycleId].goals;
  }

  getSpis(){
    this.orgService.getSpis().subscribe((res: any) => {
      if(res.status == 204){
        this.spis = [];
      }else{
      this.spis = res;
      }
    });
  }

  inItSpi() {
    return this.formBuilder.group({
      "cycleId":['',[Validators.required]],
      "goalId":['', [Validators.required]],
      "spi": ['', [Validators.required]],
      "measureUnit": ['', [Validators.required]],
      "direction":[false,[Validators.required]],
      "baseline": ['', [Validators.required]],
      "approvalRequired":[false,[Validators.required]],
      "remarks":[''],
      "helpText":['']
      // "frequencyId": [1],
      // "targetDigital": this.formBuilder.array(this.inItTarget())
    });
  }

  updateSpi(goalId:any,spi:any){
    this.spiForm.patchValue({
      "goalId":goalId,
      "spi": spi.spi,
      "measureUnit": spi.measureUnit,
      "direction":spi.direction,
      "baseline": spi.baseline,
      "approvalRequired":spi.approvalRequired,
      "remarks":spi.remarks,
      "helpText":spi.helpText
    });
  }

  deleteSpi(spiId:any,spis:any[],index:any){
    if(confirm("SPi will be deleted permanently.."))
    this.orgService.deleteSpi(spiId).subscribe((response:any)=>{
      spis.splice(index,1);
      console.log("success");
    })
  }





  inItTarget() {
    const fa: any[] = [];
    this.commonService.getData('org_info').cycle.forEach((element: any) => {
      fa.push(this.inItTargetDigital(element));
    });
    return fa;
  }

  inItTargetDigital(year: any) {
    return this.formBuilder.group({
      "year": [year, [Validators.required]],
      "expectedLevel": ['', [Validators.required]],
    });
  }

  onSubmit(){
    delete this.spiForm.value["cycleId"]
    this.orgService.saveSpi(this.spiForm.value).subscribe((res:any)=>{
      this.spiForm.reset();
      this.getSpis();
    })
  }
}