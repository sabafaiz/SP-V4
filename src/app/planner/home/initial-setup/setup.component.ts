import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { StorageService } from "../../../shared/storage.service";
import { UniversityService } from "../../../shared/UTI.service";
@Component({
  selector: 'initial-setup',
  templateUrl: './setup.component.html'
})
export class InitialSetup {
  setupForm: FormGroup;
  constructor(public fb: FormBuilder,
              public st: StorageService,
              public utiService:UniversityService) {
    this.setupForm = this.fb.group({
      "mission": ['', [Validators.required]],
      "vision": ['', [Validators.required]],
      "values": this.fb.array([this.fb.group({
        "title": ['', [Validators.required]],
        "description": ['', [Validators.required]]
      })]),
      "universityId": this.st.getData('org_info').universityId
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