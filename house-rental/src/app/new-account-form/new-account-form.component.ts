import { Component, OnInit } from '@angular/core';

declare var window:any;
@Component({
  selector: 'app-new-account-form',
  templateUrl: './new-account-form.component.html',
  styleUrls: ['./new-account-form.component.scss']
})
export class NewAccountFormComponent implements OnInit {
  username!: string;
  password!: string;
  rePassword!: string;
  role!: string;
  

  ngOnInit(): void {
    this.formModel = new window.bootstrap.Modal(
      document.getElementById("newAccountModal")
    );
  }

  formModel:any;
  openModal(){
    this.formModel.show();
  }
  closeModal(){
    this.formModel.hide();
  }
}
