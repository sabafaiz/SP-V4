import { Component, AfterViewInit} from '@angular/core';
import { UniversityService } from "../../shared/UTI.service";
import { FormBuilder, Validators, FormGroup, FormArray } from "@angular/forms";
import { StorageService } from "../../shared/storage.service";
import { TreeView } from "./tree-view";

declare let $: any;

@Component({
  selector: 'measure',
  templateUrl: './measure.html',
  styleUrls: ['./measure.css', './../planner.component.css']
})
export class MeasureComponent implements AfterViewInit {
  defaultCycle: any;
  objectives: any[] = [];
  initiatives: any[] = [];
  activities: any[] = [];
  public departments: any[] = [];
  departmentsCopy: any[] = [];
  evidenceForms: any[] = [];
  public isUpdating: boolean = false;
  public cycles: any[] = [];
  public goals: any[] = [];
  public goalsCopy: any[] = [];

  public direction: any = {
    true: 'Upward',
    false: 'Downward'
  }

  prev: boolean = true;
  next: boolean = false;

  public quarter: any[] = ["Q1", "Q2", "Q3", "Q4"];
  public quarters: any[] = [
    {
      "id": 1,
      "endDate": "31/03/",
      "startDate": "01/01/",
      "quarter": "q1"
    },
    {
      "id": 2,
      "endDate": "31/06/",
      "startDate": "01/04/",
      "quarter": "q2"
    },
    {
      "id": 3,
      "endDate": "31/09/",
      "startDate": "01/07/",
      "quarter": "q3"
    },
    {
      "id": 4,
      "endDate": "31/12/",
      "startDate": "01/10/",
      "quarter": "q4"
    }
  ];
  public measureForm: FormGroup;
  selectedQuarter: any = 0;
  constructor(public orgService: UniversityService,
    public formBuilder: FormBuilder, public commonService: StorageService) {
    this.measureForm = this.setMeasure();

    this.orgService.getCycleWithChildren().subscribe((response: any) => {
      this.cycles = response;
      this.cycles.forEach(element => {
        if (element.defaultCycle)
          this.defaultCycle = element.cycleId;
      });
      this.getMeasure();
      this.getEvidenceForms()
    });
  }

  ngOnInit() {
    // this.getQuarter();
    this.getDepartments();
  }

  ngAfterViewInit() {
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
    // $("#myModal").on('hidden.bs.modal', function (e: any) {
    //   $(this).find("input[type=checkbox], input[type=radio]")
    //     .prop("checked", "")
    //     .end();

    // });

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
  private filteredGoals: any[];
  private filteredInitiatives: any[];
  private filteredActivities: any[];
  private filteredOpis: any[];

  search(key: any) {
    this.goals = JSON.parse(JSON.stringify(this.goalsCopy));
    let val = key.target.value;
    if (val && val.trim() != '') {
      this.goals = this.goalsCopy.filter((item: any) => {
        return (item.goal.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
      this.filteredGoals = this.goals;
    }
  }

  searchInitiative(key: any) {
    this.goals = JSON.parse(JSON.stringify(this.filteredGoals));
    let val = key.target.value;
    if (val && val.trim() != '') {
      this.goals = this.goals.filter((outerItem: any) => {
        outerItem.initiatives = outerItem.initiatives.filter((item: any) => {
          return (item.initiative.toLowerCase().indexOf(val.toLowerCase()) > -1);
        });
        this.filteredInitiatives = this.goals;
        return outerItem.initiatives.length;
      });
    }
  }

  searchActivity(key: any) {
    this.goals = JSON.parse(JSON.stringify(this.filteredInitiatives));
    let val = key.target.value;
    if (val && val.trim() != '') {
      this.goals = this.goals.filter((outerItem: any) => {
        outerItem.initiatives = outerItem.initiatives.filter((innerItem: any) => {
          innerItem.activities = innerItem.activities.filter((item: any) => {
            return (item.activity.toLowerCase().indexOf(val.toLowerCase()) > -1);
          });
          return innerItem.activities.length;
        });
        this.filteredActivities = this.goals;
        return outerItem.initiatives.length;
      });
    }
  }

  searchOpi(key: any) {
    this.goals = JSON.parse(JSON.stringify(this.filteredActivities));
    let val = key.target.value;
    if (val && val.trim() != '') {
      this.goals = this.goals.filter((outerItem: any) => {
        outerItem.initiatives = outerItem.initiatives.filter((innerItem: any) => {
          innerItem.activities = innerItem.activities.filter((item: any) => {
            item.opis = item.opis.filter((inItem: any) => {
              return (inItem.opi.toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
            return item.opis.length;
          });
          return innerItem.activities.length;
        });
        return outerItem.initiatives.length;
      });
    }
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
    })
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
  // assignDepartment() {
  //   this.orgService.assignMeasure(this.selectedMeasureId, this.departmentIds).subscribe((res: any) => {
  //     this.getMeasure();
  //     $('#myModal').modal('hide');
  //   })
  // }

  // public departmentIds: any[] = [];
  public selectedDepartments: any[] = [];
  public department(event: any) {
    this.travers(event, event.my);
  }

  checkAssignDept(assignedDepartments:any[]){
    this.selectedDepartments = [];
    this.departments = JSON.parse(JSON.stringify(this.departmentsCopy));
    assignedDepartments.forEach(outerElement => {
      this.departments.forEach(innerElement => {
        this.searchDepartment(innerElement,outerElement);
      });      
    });
  }

  searchDepartment(department:any,assigneddepartment:any){
    if (!department) {
      return;
    } else {
      if(department.departmentId == assigneddepartment.departmentId){ 
        department.baseline = assigneddepartment.baseline;        
        department.opiAnnualTargets = assigneddepartment.opiAnnualTargets;
        department.my = true;
        department.isUpdating = true;
        console.log(department);
        this.selectedDepartments.push(department);
      }else{
        if (department.reporteeDepartments)
          department.reporteeDepartments.forEach((element: any) => {
            this.searchDepartment(element,assigneddepartment);
          });
      }
    }
  }

  travers(department: any, checked: boolean) {
    if (!department) {
      return;
    } else {
      if (checked) {
        department.my = true;
        this.selectedDepartments.push(department);
      } else {
        department.my = false;
        this.selectedDepartments.splice(this.selectedDepartments.indexOf(department), 1);
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
    var departmentsArray: any[] = this.departmentForm.controls["departmentsArray"].value;
    departmentsArray.forEach(element => {
      delete element["departmentName"];
    });
    if (confirm("Do you really want to assign this OPI"))
      this.orgService.assignOpi(this.selectedMeasure.opiId, departmentsArray).subscribe((response: any) => {
        departmentsArray.forEach(element => {
          this.selectedMeasure.assignedDepartments.push(departmentsArray);
        });
        $('#myModal').modal('hide');
      })
  }


  getDepartmentFormArray() {
    const departmentsFormArray: any[] = [];
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
  setAnnualTarget(opiAnnualTargets:any) {
    const annualTarget: any[] = [];
    if(opiAnnualTargets)
      opiAnnualTargets.forEach((element:any) => {
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

  setLevelsWithValue(levels:any[]){
    const quarterLevel:any[] = [];
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
        $('#measureModal').modal('show');
        this.measureForm.reset({
          opi: '',
          measureUnit: '', frequencyId: 1, baseline: '', direction: '', remarks: '', helpText: '', approvalRequired: ''
        });
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
      if (confirm("Are you sure you want to update this OPI as " + msg)) {
        delete this.measureForm.value["activityId"];
        this.orgService.updateMeasure(this.selectedMeasure.opiId, formChanges).subscribe((response: any) => {
          this.measureForm = this.setMeasure();
          this.getMeasure();
        });
      }
    }
  }

  selectedMeasure: any;

  updateMeasure(objective: any, initiative: any, activity: any, measure: any) {
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
    $('#collapse1').collapse('show');
    // this.measureForm.controls["annualTarget"].patchValue(measure.annualTarget);
  }

  enableFields() {
    this.measureForm.controls["cycleId"].enable();
    this.measureForm.controls["objectiveId"].enable();
    this.measureForm.controls["initiativeId"].enable();
    this.measureForm.controls["activityId"].enable();
    this.measureForm = this.setMeasure();
  }

  nextForm() {

  }

  deleteMeasure(measureId: any, measures: any[], index: any) {
    if (confirm("Are you sure you want to delete this Measure?"))
      this.orgService.deleteMeasure(measureId).subscribe((res: any) => {
        console.log(res);
        // measures.splice(index, 1);
        this.getMeasure();
      })
  }

  getRowSpan(array: any[]) {
    var rowSpan = 1;
    rowSpan += array.length;
    array.forEach((element) => {
      rowSpan += element.activities.length;
      element.activities.forEach((innerElement: any) => {
        rowSpan += innerElement.measures.length;
      });
    });
    if (rowSpan == 1)
      return rowSpan + 1;
    return rowSpan;
  }

  getRowSpanOfIni(array: any[]) {
    var rowSpan = 1;
    rowSpan += array.length * 2;
    array.forEach((innerElement: any) => {
      rowSpan += innerElement.measures.length;
    });
    return rowSpan;
  }

  getEvidenceForms() {
    this.orgService.getEvidenceForms().subscribe((response: any) => {
      this.evidenceForms = response;
    })
  }

  addNewMeasure(){
    this.enableFields(); 
    this.isUpdating = false;
    $("#collapse1").collapse('show');
    this.measureForm = this.setMeasure();
  }

  get(e){
    $(e)["0"].height = $(e)["0"].clientHeight;
  }
}