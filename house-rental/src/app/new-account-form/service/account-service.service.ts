import { Injectable, AfterViewInit } from '@angular/core';

declare var window:any;
@Injectable({
  providedIn: 'root'
})
export class AccountServiceService implements AfterViewInit{

  constructor() { }
  formModel:any;

  ngAfterViewInit(): void {
    this.formModel = new window.bootstrap.Modal(
      document.getElementById("newAccountModal")
    );
  }
  openModal(){
    this.formModel.show();
  }
  closeModal(){
    this.formModel.hide();
  }
}
