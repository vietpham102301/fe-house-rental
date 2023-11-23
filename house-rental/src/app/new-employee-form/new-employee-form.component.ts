import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { EmployeeService } from './service/employee.service';
import { HouseService } from '../new-house-form/services/house.service';

declare var window:any;

@Component({
  selector: 'app-new-employee-form',
  templateUrl: './new-employee-form.component.html',
  styleUrls: ['./new-employee-form.component.scss']
})
export class NewEmployeeFormComponent implements OnInit {

  name: string= '';
  birthDate: Date | null = null;
  gender: string = '';
  phone: string = '';
  email: string = '';
  idNum: string = '';
  startedDate: Date | null = null;
  description: string = '';

  account:string = '';

  username: string= '';
  password: string = '';
  rePassword: string = '';
  role: string = '';

  //error
  nameErrorMessage: string = '';
  birthdateErrorMessage: string = '';
  genderErrorMessage: string = '';
  phoneErrorMessage: string = '';
  emailErrorMessage: string = '';
  idNumberErrorMessage: string = '';
  startedDateErrorMessage: string = '';
  descriptionErrorMessage: string = '';
  positionErrorMessage: string = '';
  accountErrorMessage: string = '';
  usernameErrorMessage: string = '';
  passwordErrorMessage: string = '';
  rePasswordErrorMessage: string = '';
  roleErrorMessage: string = '';
  selectedFiles: File[] = [];


  ngOnInit(): void {
    this.formModel = new window.bootstrap.Modal(
      document.getElementById("newEmployeeModal")
    );
    this.formModel2 = new window.bootstrap.Modal(
      document.getElementById("newAccountModal")
    );
  }

  constructor(private employeeService: EmployeeService, private newHouseService: HouseService){}

  onFileSelected(event: any) {
    this.selectedFiles = event.target.files;
  }

  uploadFiles(houseId: number): void {
    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      return;
    }
    const formData = new FormData();

    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('files', this.selectedFiles[i]);
    }
    this.newHouseService.uploadFiles(formData, houseId, "user").subscribe({
      next: (response: any) => {
        console.log(response);
        if(response.status === 200){
          console.log("ok");
        }
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }


  @Output() saveClicked = new EventEmitter<void>();
  createEmployee(): void {


    if (this.name === '') {
      this.nameErrorMessage = "House name must not be empty";
      return;
    }
    
    if (this.birthDate === null) {
      this.birthdateErrorMessage = "Birth date must be specified";
      return;
    }
    
    if (this.gender === '') {
      this.genderErrorMessage = "Gender must not be empty";
      return;
    }
    
    if (this.phone === '') {
      this.phoneErrorMessage = "Phone must not be empty";
      return;
    }
    
    if (this.email === '') {
      this.emailErrorMessage = "Email must not be empty";
      return;
    }
    
    if (this.idNum === '') {
      this.idNumberErrorMessage = "ID number must not be empty";
      return;
    }
    
    if (this.startedDate === null) {
      this.startedDateErrorMessage = "Started date must be specified";
      return;
    }
    
    if (this.description === '') {
      this.descriptionErrorMessage = "Description must not be empty";
      return;
    }
    
   
    
    if (this.account === '') {
      this.accountErrorMessage = "Account must not be empty";
      return;
    }
    
    
    

    let userCreateRequest = {
      name: this.name,
      birthdate: this.birthDate,
      gender: this.gender,
      phone: this.phone,
      email: this.email,
      idNumber: this.idNum,
      startedDate: this.startedDate,
      description: this.description,
      role: this.role,
      username: this.username,
      password: this.password
    }
    this.employeeService.createEmployee(userCreateRequest).subscribe({
      next: (response) => {
        console.log(response);
        this.uploadFiles(response.id)
        //reset
        this.name = '';
        this.birthDate = null;
        this.gender = '';
        this.phone = '';
        this.email = '';
        this.idNum = '';
        this.startedDate = null;
        this.description = '';

        this.account = '';

        this.username= '';
        this.password = '';
        this.rePassword = '';
        this.role = '';

        //reset error message
        this.nameErrorMessage = '';
        this.birthdateErrorMessage = '';
        this.genderErrorMessage = '';
        this.phoneErrorMessage = '';
        this.emailErrorMessage = '';
        this.idNumberErrorMessage = '';
        this.startedDateErrorMessage = '';
        this.descriptionErrorMessage = '';
        this.positionErrorMessage = '';
        this.accountErrorMessage = '';
        this.usernameErrorMessage = '';
        this.passwordErrorMessage = ''; 
        this.rePasswordErrorMessage = '';
        this.roleErrorMessage = '';
        this.selectedFiles = [];

        this.closeModal();
        this.saveClicked.emit();
      },
      error: (e)=> {
        console.log(e);
        if(e.status === 400){
          if(e.error.message[0] === "username must be 6-20 characters and contain only letters and numbers"){
            this.usernameErrorMessage = "username must be 6-20 characters and contain only letters and numbers";
          }else if(e.error.message[0] === "password must be 6-20 characters and contain only letters and numbers"){
            this.passwordErrorMessage = "password must be 6-20 characters and contain only letters and numbers";
          }else if(e.error.message[0] === "Name is not valid a-z 0-9 and space maximum 50 characters"){
            this.nameErrorMessage = "Name is not valid a-z 0-9 and space maximum 50 characters";
          }else if(e.error.message[0] === "Gender is not valid"){
            this.genderErrorMessage = "Gender is not valid";
          }else if(e.error.message[0] === "Phone number must be 10 digits"){
            this.phoneErrorMessage = "Phone number must be 10 digits";
          }else if(e.error.message[0] === "ID number must be 12 digits"){
            this.idNumberErrorMessage = "ID number must be 12 digits";
          }else if(e.error.message[0]==="Email is not valid"){
            this.emailErrorMessage = "Email is not valid";
          }
        }
        if(e.status === 409){
          if(e.error.message === "This username is already taken"){
            this.usernameErrorMessage = "This username is already taken";
          }else if(e.error.message === "This email is already taken"){
            this.emailErrorMessage = "This email is already taken";
          }else if(e.error.message === "This phone is already taken"){
            this.phoneErrorMessage = "This phone is already taken";
          }else if(e.error.message === "This id num is already taken"){
            this.idNumberErrorMessage = "This id num is already taken";
          }
        }
      }
    })
  }
  
  formModel:any;
  openModal(){
    this.formModel.show();
  }
  closeModal(){
    this.formModel.hide();
  }

  formModel2:any;
  openModal2(){
    this.formModel.hide();
    this.formModel2.show();
  }
  closeModal2(){
    this.formModel.show();
    this.formModel2.hide();
  }

  saveModal2(){
    this.account = this.username;

    if (this.username === '') {
      this.usernameErrorMessage = "Username must not be empty";
      return;
    }
    
    if (this.password === '') {
      this.passwordErrorMessage = "Password must not be empty";
      return;
    }
    
    if (this.rePassword === '') {
      this.rePasswordErrorMessage = "Re-entered password must not be empty";
      return;
    }
    
    if (this.role === '') {
      this.roleErrorMessage = "Role must not be empty";
      return;
    }
    if(this.rePassword !== this.password){
      this.rePasswordErrorMessage = "Re-entered password didn't match";
      return;
    }
    this.closeModal2();
  }
}
