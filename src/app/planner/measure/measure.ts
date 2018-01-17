import { Component, AfterViewInit } from '@angular/core';
import { UniversityService } from "../../shared/UTI.service";
import { FormBuilder, Validators, FormGroup, FormArray } from "@angular/forms";
import { StorageService } from "../../shared/storage.service";
import { TreeView } from "./tree-view";
import { Filters } from '../../shared/filters';
import * as alertify from 'alertifyjs';
import { LoaderService } from '../../shared/loader.service';

declare let $: any;

@Component({
  selector: 'measure',
  templateUrl: './measure.html',
  styleUrls: ['./measure.css', './../planner.component.css']
})
export class MeasureComponent extends Filters implements AfterViewInit {
  defaultCycle: any;
  objectives: any[] = [];
  initiatives: any[] = [];
  activities: any[] = [];
  public departments: any[] = [];
  departmentsCopy: any[] = [];
  evidenceForms: any[] = [];
  public isUpdating: boolean = false;
  public cycles: any[] = [];

  public direction: any = {
    true: 'Upward',
    false: 'Downward'
  }

  prev: boolean = true;
  next: boolean = false;

  public quarter: any[] = ["Q1", "Q2", "Q3", "Q4"];
  public quarters: any[];
  public measureForm: FormGroup;
  selectedQuarter: any = 0;
  constructor(public orgService: UniversityService,
    public formBuilder: FormBuilder, public commonService: StorageService, private loaderService: LoaderService) {
    super();
    this.measureForm = this.setMeasure();
    this.loaderService.display(true);
    this.getCycleWithChildren(false);
  }

  ngOnInit() {
    this.getQuarter();
    this.getDepartments();
  }

  ngAfterViewInit() {

  }

  getCycleWithChildren(flag: any) {
    this.orgService.getCycleWithChildren(flag).subscribe((response: any) => {
      this.cycles = response;
      this.cycles.forEach(element => {
        if (element.defaultCycle)
          this.defaultCycle = element.cycleId;
      });
      if (!flag) {
        this.getMeasure();
        this.getEvidenceForms();
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

  emptySearchResult: any;

  getInitiative(objId: any) {
    if (objId) {
      this.objectives.forEach((element: any) => {
        if (element.goalId == objId) {
          this.initiatives = element.initiatives;
          return;
        }
      });
    } else {
      this.objectives = [];
    }
  }

  getActivities(initId: any) {
    if (initId) {
      this.initiatives.forEach((element: any) => {
        if (element.initiativeId == initId) {
          this.activities = element.activities;
          return;
        }
      });
    } else {
      this.objectives = [];
    }
  }

  getMeasure() {
    this.orgService.getMeasuresByCycleId(this.defaultCycle).subscribe((response: any) => {
      if (response.status == 204) {
        this.goals = [];
        this.goalsCopy = [];
      } else {
        this.goals = response;
        this.goalsCopy = response;
        this.filteredActivities = response;
        this.filteredGoals = response;
        this.filteredInitiatives = response;
        this.filteredOpis = response;
      }
      this.loaderService.display(false);
    }, (error: any) => {
      this.loaderService.display(false);
    });
  }

  getQuarter() {
    this.orgService.getQuarter().subscribe((res: any) => {
      this.quarters = res;
    })
  }

  getDepartments() {
    // this.departmentIds = [];
    this.orgService.getDepartments().subscribe((res: any) => {
      this.departments = res;
      this.departmentsCopy = res;
    })
  }
  public selectedMeasureId: any;

  /**for editing opi target levels */
  editDepartmentForm: FormGroup;
  viewDepartment(dept: any) {
    dept.edit = true;
    this.editDepartmentForm = this.formBuilder.group({
      "id": [dept.id],
      "baseline": [dept.baseline],
      "opiAnnualTargets": this.formBuilder.array(this.getOpiAnnualTargets(dept.opiAnnualTargets))
    });
  }

  getOpiAnnualTargets(opiAnnualTargets: any[]) {
    const annualTargets: any[] = [];
    opiAnnualTargets.forEach(element => {
      annualTargets.push(this.formBuilder.group({
        "id": [element.id],
        "estimatedCost": [element.estimatedCost],
        "levels": this.formBuilder.array(this.getLevels(element.levels))
      }))
    });
    return annualTargets;
  }

  getLevels(levelsArray) {
    const levels: any[] = [];
    levelsArray.forEach(element => {
      levels.push(this.formBuilder.group({
        "id": element.id,
        "estimatedTargetLevel": element.estimatedTargetLevel
      }))
    });
    return levels;
  }

  removeAssignedDept(selectedMeasure: any, index: any) {
    const assignedDepartments: any[] = selectedMeasure.assignedDepartments;
    if (confirm("Do you realy want to unassign department??"))
      this.orgService.deleteAssignedDepartment(selectedMeasure.assignedDepartments[index].id).subscribe((response: any) => {
        assignedDepartments.splice(index, 1);
      })
  }

  updateOpiTarget(selectedMeasure: any, index: any) {
    if (confirm("Do you realy want to update targets??"))
      this.orgService.updateTarget(selectedMeasure.opiId, [this.editDepartmentForm.value]).subscribe((response: any) => {
        selectedMeasure.assignedDepartments[index] = response[0];
      });
  }

  public selectedDepartments: any[] = [];
  public department(event: any) {
    this.travers(event, event.my);
  }

  checkAssignDept(assignedDepartments: any[]) {
    this.selectedDepartments = [];
    this.departments = JSON.parse(JSON.stringify(this.departmentsCopy));
    assignedDepartments.forEach(outerElement => {
      this.departments.forEach(innerElement => {
        this.searchDepartment(innerElement, outerElement);
      });
    });
  }

  searchDepartment(department: any, assigneddepartment: any) {
    if (!department) {
      return;
    } else {
      if (department.departmentId == assigneddepartment.departmentId) {
        department.baseline = assigneddepartment.baseline;
        department.opiAnnualTargets = assigneddepartment.opiAnnualTargets;
        department.my = true;
        department.disabled = true;
        department.isUpdating = true;
        // this.selectedDepartments.push(department);
      } else {
        if (department.reporteeDepartments)
          department.reporteeDepartments.forEach((element: any) => {
            this.searchDepartment(element, assigneddepartment);
          });
      }
    }
  }

  travers(department: any, checked: boolean) {
    if (!department) {
      return;
    } else {
      if (checked) {
        if (!department.disabled) {
          department.my = true;
          if (this.selectedDepartments.indexOf(department) === -1)
            this.selectedDepartments.push(department);
        }
      } else {
        if (!department.disabled) {
          department.my = false;
          this.selectedDepartments.splice(this.selectedDepartments.indexOf(department), 1);
        }
      }
      if (department.reporteeDepartments)
        department.reporteeDepartments.forEach((element: any) => {
          this.travers(element, checked);
        });

    }
  }

  departmentForm: FormGroup;
  cycle: any[];
  assignDepartment() {
    this.cycles.forEach(element => {
      if (this.defaultCycle == element.cycleId)
        this.cycle = element.cycle;
    });
    this.departmentForm = this.formBuilder.group({
      departmentsArray: this.formBuilder.array(this.getDepartmentFormArray())
    });
  }

  assign() {
    const departmentsArray: any[] = this.departmentForm.controls["departmentsArray"].value;
    departmentsArray.forEach(element => {
      delete element["departmentName"];
    });
    alertify.confirm("Do you really want to assign this OPI", () => {
      this.orgService.assignOpi(this.selectedMeasure.opiId, departmentsArray).subscribe((response: any) => {
        this.selectedMeasure.assignedDepartments = this.selectedMeasure.assignedDepartments.concat(response);
        alertify.notify("Successfully assigned");
        $('#detailModal').modal('show');
        $('#myModal').modal('hide');
      }, (error: any) => {
        alertify.error("Something went wrong");
      })
    })
  }

  getDepartmentFormArray() {
    const departmentsFormArray: any[] = [];
    const departmentsArrayForEdit: any[] = [];
    this.selectedDepartments.forEach(element => {
      departmentsFormArray.push(this.formBuilder.group({
        baseline: [element.baseline],
        departmentId: [element.departmentId],
        departmentName: [element.department],
        opiAnnualTargets: this.formBuilder.array(this.setAnnualTarget(element.opiAnnualTargets))
      }))
    });
    return departmentsFormArray;
  }
  setAnnualTarget(opiAnnualTargets: any) {
    const annualTarget: any[] = [];
    if (opiAnnualTargets)
      opiAnnualTargets.forEach((element: any) => {
        annualTarget.push(this.inItTargetWithLevels(element))
      });
    else
      this.cycle.forEach((element: any) => {
        annualTarget.push(this.inItTargetIn(element));
      });
    return annualTarget;
  }

  inItTargetIn(year: any) {
    return this.formBuilder.group({
      "year": [year, [Validators.required]],
      "levels": this.formBuilder.array(this.setLevels(this.selectedMeasure.frequencyId)),
      "estimatedCost": ['', [Validators.required]]
    });
  }

  inItTargetWithLevels(annualTarget: any) {
    return this.formBuilder.group({
      "year": [annualTarget.year, [Validators.required]],
      "levels": this.formBuilder.array(this.setLevelsWithValue(annualTarget.levels)),
      "estimatedCost": [annualTarget.estimatedCost, [Validators.required]]
    });
  }

  setLevelsWithValue(levels: any[]) {
    const quarterLevel: any[] = [];
    levels.forEach(element => {
      quarterLevel.push(this.formBuilder.group({
        quarterId: element.quarterId,
        estimatedTargetLevel: element.estimatedTargetLevel
      }))
    });
    return quarterLevel;
  }

  setLevels(count: any) {
    const levels: any[] = [];
    if (count == 3) count++;
    for (var i = 0; i < count; i++) {
      if (count == 2)
        levels.push(this.getLevel(2 * i + 1));
      else if (count == 1)
        levels.push(this.getLevel(3));
      else
        levels.push(this.getLevel(i));
    }
    return levels;
  }

  getLevel(q: any) {
    return this.formBuilder.group({
      quarterId: this.quarters[q].id,
      estimatedTargetLevel: [0]
    });
  }

  setMeasure() {
    return this.formBuilder.group({
      "cycleId": [{ value: this.defaultCycle, disabled: false }, [Validators.required]],
      "objectiveId": [{ value: '', disabled: false }, [Validators.required]],
      "initiativeId": [{ value: '', disabled: false }, [Validators.required]],
      "activityId": [{ value: '', disabled: false }, [Validators.required]],
      "opi": ['', [Validators.required]],
      "frequencyId": [1, [Validators.required]],
      "measureUnit": ['', [Validators.required]],
      "evidanceFormId": ['', []],
      "direction": [false, [Validators.required]],
      "approvalRequired": [false, [Validators.required]],
      "remarks": ['', [Validators.required]],
      "helpText": ['', [Validators.required]]
    });
  }

  submitMeasure() {
    var formChanges: any = {};
    var msg: string = "";
    delete this.measureForm.value["cycleId"]
    delete this.measureForm.value["objectiveId"];
    delete this.measureForm.value["initiativeId"];
    if (!this.isUpdating) {
      this.orgService.saveMeasure(this.measureForm.value).subscribe((response: any) => {
        this.getMeasure();
        // $('#measureModal').modal('show');
        alertify.notify("You have successfully added a new OPI.");
        this.measureForm.reset({
          opi: '',
          measureUnit: '', frequencyId: 1, baseline: '', direction: '', remarks: '', helpText: '', approvalRequired: ''
        });
        $('#add-opi').hide();
      }, error => {
        console.log(error);
      });
    } else {
      Object.keys(this.measureForm.value).forEach((key: any) => {
        if (this.selectedMeasure[key] != this.measureForm.value[key]) {
          formChanges[key] = this.measureForm.value[key];
          msg += "\n" + key + " = " + formChanges[key] + ",";
        }
      });
      alertify.confirm("Are you sure you want to update this OPI as " + msg, () => {
        delete this.measureForm.value["activityId"];
        this.orgService.updateMeasure(this.selectedMeasure.opiId, formChanges).subscribe((response: any) => {
          this.measureForm = this.setMeasure();
          this.getMeasure();
        });
      })
      $('#add-opi').hide();
    }
  }

  selectedMeasure: any;



  updateMeasure(objective: any, initiative: any, activity: any, measure: any, highlight: any) {
    $(".to-be-highlighted").removeClass("highlight");
    $(highlight).addClass("highlight");
    this.measureForm.controls["cycleId"].disable();
    this.measureForm.controls["objectiveId"].disable();
    this.measureForm.controls["initiativeId"].disable();
    this.measureForm.controls["activityId"].disable();
    this.isUpdating = true;
    this.selectedMeasure = measure;
    this.measureForm.patchValue({
      cycleId: this.defaultCycle,
      objectiveId: objective.goalId,
      initiativeId: initiative.initiativeId,
      activityId: activity.activityId,
      opi: measure.opi,
      measureUnit: measure.measureUnit,
      frequencyId: measure.frequencyId,
      baseline: measure.baselineOfOpi,
      evidanceFormId: measure.evidanceFormId,
      direction: measure.direction,
      remarks: measure.remarks,
      helpText: measure.helpText,
      approvalRequired: measure.approvalRequired
    });
    $('#add-opi').show();
    $("#collapse1").collapse('show');
    // this.measureForm.controls["annualTarget"].patchValue(measure.annualTarget);
  }

  enableFields() {
    $('#add-opi').hide();
    $(".to-be-highlighted").removeClass("highlight");
    this.measureForm.controls["cycleId"].enable();
    this.measureForm.controls["objectiveId"].enable();
    this.measureForm.controls["initiativeId"].enable();
    this.measureForm.controls["activityId"].enable();
    this.measureForm = this.setMeasure();
  }

  deleteMeasure(measureId: any, measures: any[], index: any) {
    if (confirm("Are you sure you want to delete this Measure?"))
      this.orgService.deleteMeasure(measureId).subscribe((res: any) => {
        console.log(res);
        // measures.splice(index, 1);
        this.getMeasure();
      })
  }

  getEvidenceForms() {
    this.orgService.getEvidenceForms().subscribe((response: any) => {
      this.evidenceForms = response;
    })
  }

  closeForm() {
    this.enableFields();
    this.isUpdating = false;
    this.getCycleWithChildren(false);
  }

  addNewMeasure() {
    this.enableFields();
    this.isUpdating = false;
    $('#add-opi').show();
    $("#collapse1").collapse('show');
    
    this.objectives = [];
    this.initiatives = [];
    this.activities = [];
    this.getCycleWithChildren(true);
    this.measureForm = this.setMeasure();
  }

  disable(event: any, opiId: any) {
    if (event.srcElement.checked)
      alertify.confirm("Do you Really want to disable this KPI??", () => {
        this.orgService.disableKPI(opiId).subscribe((response: any) => {
          alertify.success("You disabled the KPI..");
          this.getMeasure();
        }, () => {
          event.srcElement.checked = !event.srcElement.checked;
          alertify.error("Something went wrong..")
        })
      }, () => {
        event.srcElement.checked = !event.srcElement.checked;
        alertify.error("Action was not performed")
      });
    else
      alertify.confirm("Do you Really want to enable this KPI??", () => {
        this.orgService.enableKPI(opiId).subscribe((response: any) => {
          alertify.success("You enabled the KPI..");
          this.getMeasure();
        }, () => {
          event.srcElement.checked = !event.srcElement.checked;
          alertify.error("Something went wrong..")
        })
      }, () => {
        event.srcElement.checked = !event.srcElement.checked;
        alertify.error("Action was not performed")
      });
  }

  get(e) {
    var promise = new Promise((resolve: any, reject: any) => { $(e)["0"].height = $(e)["0"].clientHeight; resolve(); });
    return promise;
  }
}