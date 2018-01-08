import { Component, Input, EventEmitter, Output, AfterViewInit } from '@angular/core';

@Component ({
  selector: 'tree-view',
  template: `
  <ul style="list-style:none;">
    <li *ngFor="let node of treeData;let i=index;">
      <div class="checkbox">
        <label><input type="checkbox" [(ngModel)]="node.my" [disabled]="node.disabled" (change)="department(node)">{{node.department}}</label>
      </div>      
      <tree-view [assignedDepartment]="assignedDepartment" [treeData]="node.reporteeDepartments" (onSelected)="department($event)"></tree-view>
    </li>
  </ul>
  `
})
export class TreeView implements AfterViewInit{

  @Input() treeData: any[];
  @Input() assignedDepartment:any[];
  @Output() onSelected : EventEmitter<any> = new EventEmitter<boolean>();
  constructor(){
    
  }

  ngAfterViewInit(){
    
  }

  department(event: any) {
    this.onSelected.emit(event);
  }
  
}