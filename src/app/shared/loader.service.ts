import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class LoaderService {
 public status: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
 public transactionLoader:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
 public loadingStatus:BehaviorSubject<string> = new BehaviorSubject<string>("");
 public display(value: boolean) {
  this.status.next(value);
 }
 public setLoadingStatus(text:string){
  this.loadingStatus.next(text)
 }
 public setTransactionLoader(value: boolean){
  this.transactionLoader.next(value);
 }
}