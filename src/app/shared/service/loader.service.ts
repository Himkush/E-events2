import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loaderSubject = new Subject<string>();
  // public loaderState = this.loaderSubject.asObservable();
  constructor() { }

  public show() {
    console.log('service hide');
    this.loaderSubject.next('show');
  }
  public hide() {
    console.log('service hide');
    this.loaderSubject.next('hide');
  }
  public getState() {
    return this.loaderSubject.asObservable();
  }
}
