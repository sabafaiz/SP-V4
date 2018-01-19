import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { StorageService } from "../../../shared/storage.service";
import { UniversityService } from "../../../shared/UTI.service";
import { LoaderService } from '../../../shared/loader.service';
@Component({
  selector: 'initial-setup',
  templateUrl: './setup.component.html',
  styleUrls:['./setup.component.css']
})
export class InitialSetup implements OnInit{
  public setupForm: FormGroup;
  constructor(public fb: FormBuilder,
              public st: StorageService,
              public utiService:UniversityService) {
                this.setupForm = this.initForm();
                this.fetchOrganizationInfo();
  }

  ngOnInit(){

  }

  initForm(){
    return this.fb.group({
      "mission": ['', [Validators.required]],
      "vision": ['', [Validators.required]],
      "values": this.fb.array([this.fb.group({
        "title": ['', [Validators.required]],
        "description": ['', [Validators.required]]
      })]),
      "universityId": ''
    });
  }

  public fetchOrganizationInfo() {
		this.utiService.fetchOrganizationInfo().subscribe((res: any) => {
      this.st.storeData("org_info", res);
      this.setupForm.controls["universityId"] = this.st.getData('org_info').universityId; 
		}, (err: any) => {

		});
	}

  onSubmit(){
    this.utiService.saveInitialSetup(this.setupForm.value).subscribe((response:any)=>{
      console.log("success", response);
    })
  }
  inItValue() {
    return this.fb.group({
      "title": ['', [Validators.required]],
      "description": ['', [Validators.required]]
    });
  }
  removeValue(index:any) {
    const control = <FormArray>this.setupForm.controls['values'];
    control.removeAt(index);
  }

  addValue() {
    const control = <FormArray>this.setupForm.controls['values'];
    control.push(this.inItValue());
  }
}