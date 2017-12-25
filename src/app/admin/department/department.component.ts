import {Component} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AdminService } from "../admin.service";
import { StorageService } from "../../shared/storage.service";

declare let $:any;

@Component({
  selector:'department',
  templateUrl:'./department.component.html'
})
export class DeparmtmentComponent{
  public university:any;
  public departments:any[] = [];
  public newDepartment: FormGroup;
  constructor(public formBuilder: FormBuilder,
              public adminService:AdminService,
              public cs:StorageService){
              adminService.getDepartments().subscribe(response =>{
                if (response.status === 204) {
                  this.departments = [];
                  // alert("There is not Departments Entry yet.\nYou are going to create Parent Department");
                } else {
                  console.log(response);
                  this.departments = response;
                }
              }, err =>{
                this.departments = [];
                console.log(err);
              });
              adminService.getUniversity().subscribe(response =>{
                if (response.status === 204) {
                  this.university = [];
                  alert("There is not university Entry yet.\nFirst Feed the entries of University");
                } else {
                  console.log(response);
                  this.university = response;
                }
              }, err =>{
                this.university = [];
                console.log(err);
              });

              this.newDepartment = this.formBuilder.group({
                "department": ['', [Validators.required]],
                "parentDepartmentId":[-1,[Validators.required]]           
              });
  }
  onSubmit(){
    this.newDepartment.value['universityId'] = this.cs.getData('org_info').id;
    if(this.newDepartment.value['parentDepartmentId'] == -1){
      delete this.newDepartment.value['parentDepartmentId'];
    }
    this.adminService.addDepartment(this.newDepartment.value).subscribe(res =>{ 
      this.departments.push(res);     
      $('#deptModal').modal('show');
      this.newDepartment.reset();
      console.log(res);
    }, err =>{
      console.log(err);
    })
  }
}