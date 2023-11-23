
import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { HouseService } from './services/house.service';

import { User } from './models/manager.model';
import { HttpErrorResponse } from '@angular/common/http';

declare var window:any;

@Component({
  selector: 'app-new-house-form',
  templateUrl: './new-house-form.component.html',
  styleUrls: ['./new-house-form.component.scss']
})
export class NewHouseFormComponent implements OnInit{
  name: string = '';
  city: string = '';
  district: string = '';
  ward: string= '';
  street: string = '';
  houseNumber: string = '';

  managers: User[] = [];
  selectedManager: number = 0;

  electricityUnit: string = '';
  waterUnit: string = '';
  cleaningUnit: string = '';

  
  establishDate: Date|null = null;
  
 
  status: string = '';
  description: string = '';

  // Rent fee tab properties
  electricityPrice: number = 0;
  waterBillPrice: number = 0;
  cleaningFeePrice: number = 0;

  //error
  nameErrorMessage: string = '';
  locationErrorMessage: string ='';
  locationErrorMessage2: string = '';
  EstablishDateErrorMessage: string = '';
  managerErrorMessage: string = '';
  statusErrorMessage: string = '';
  descriptionErrorMessage: string = '';
  imageErrorMessage: string = '';
  facilitiesErrorMessage: string ='';
  selectedFiles: File[] = [];

  constructor(private houseService: HouseService){}

  capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

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

    this.houseService.uploadFiles(formData, houseId, "house").subscribe({
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


  ngOnInit(): void {
   
    this.formModel = new window.bootstrap.Modal(
      document.getElementById("newHouseModal")
    );
    this.fetchMananger();
  }

  fetchMananger(){
    this.houseService.getManagerList().subscribe({
      next: (response) => {this.managers = response.data;
        this.managers = this.managers.filter((manager)=> manager.status != "Inactive")
      }
    })
  }
  @Output() saveClicked = new EventEmitter<void>();
  createHouse():void {

    if(this.name === ''){
      this.nameErrorMessage = "House name must not be empty";
      return;
    }
    if(this.city === '' || this.district ==='' || this.ward ===''){
      this.locationErrorMessage = "Location must not be empty";
      return;
    }

    if(this.street === '' || this.houseNumber ===''){
      this.locationErrorMessage2 = "Location must not be empty";
      return;
    }

    if(this.establishDate === null ){
      this.EstablishDateErrorMessage = "establishDate must not be empty";
      return;
    }

    if(this.selectedManager === 0 ){
      this.managerErrorMessage = "must select manager";
      return;
    }

    if(this.status === '' ){
      this.statusErrorMessage = "must select status";
      return;
    }

  
    if(this.description === ''){
      this.descriptionErrorMessage = "description must not be empty";
      return;
    }

    if(this.electricityPrice === 0 || this.electricityUnit === ''){
      this.facilitiesErrorMessage = "electricity must select unit and not be empty";
      return;
    }

    if(this.waterBillPrice === 0 || this.waterUnit === ''){
      this.facilitiesErrorMessage = "water must select unit and not be empty";
      return;
    }

    if(this.cleaningFeePrice === 0 || this.cleaningUnit === ''){
      this.facilitiesErrorMessage = "cleaning must select unit and not be empty";
      return;
    }

    let hasError = false;


    const address = {
      city: this.city,
      district: this.district,
      ward: this.ward,
      street: this.street,
      houseNumber: this.houseNumber
    }
    const facilities = [
      {
        name: "Electricity",
        price: this.electricityPrice,
        unit: this.electricityUnit
      },
      {
        name: "Water",
        price: this.waterBillPrice,
        unit: this.waterUnit
      },
      {
        name: "Cleaning",
        price: this.cleaningFeePrice,
        unit: this.cleaningUnit
      }
    ]

    this.houseService.createHouse(this.name, address, facilities, this.establishDate, this.selectedManager, this.status, this.description).subscribe({
      next:(response) =>{
        console.log(response);
          console.log("ok house created");
          this.uploadFiles(response.id);
          this.closeModal();
          this.saveClicked.emit();

          this.name = '';
          this.city = '';
          this.district = '';
          this.ward= '';
          this.street = '';
          this.houseNumber = '';
          this.selectedManager = 0;

          this.electricityUnit = '';
          this.waterUnit = '';
          this. cleaningUnit = '';
          this.establishDate  = null;
          this.status = '';
          this.description = '';

          // Rent fee tab properties
          this.electricityPrice = 0;
          this.waterBillPrice = 0;
          this.cleaningFeePrice = 0;
          
        
      },
      error: (error) => {
        console.log(error);
        if(error.status === 409){
          if(error.error.message === "This house name is already taken"){
            this.nameErrorMessage = error.error.message
          }else if(error.error.message === "This house address is already taken"){
            this.locationErrorMessage = error.error.message;
            this.locationErrorMessage2 = error.error.message;
          }
        }
        hasError = true;
      }
    })

    if(hasError){
      return;
    }
    
  }


  


  formModel:any;
  openModal(){
    this.formModel.show();
  }
  closeModal(){
    this.formModel.hide();
  }
}
