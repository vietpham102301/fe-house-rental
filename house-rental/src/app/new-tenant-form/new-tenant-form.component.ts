import { TenantService } from './service/tenant.service';
import { Room } from '../tenant-page/models/room.model';
import { TenantPageService } from './../tenant-page/service/tenant-page.service';
import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { HouseService } from '../new-house-form/services/house.service';
import { TenantPageComponent } from '../tenant-page/tenant-page.component';

declare var window: any;

@Component({
  selector: 'app-new-tenant-form',
  templateUrl: './new-tenant-form.component.html',
  styleUrls: ['./new-tenant-form.component.scss']
})



export class NewTenantFormComponent implements OnInit {
  name: string = '';
  birthDate: Date | null = null;
  gender: string = '';
  phone: string = '';
  email: string = '';
  idNum: string = '';
  city: string = '';
  district: string = '';
  ward: string = '';
  street: string = '';
  houseNumber: string = '';
  licensePlates: string = '';
  rentDate: Date | null = null;
  description: string = '';


  rooms: Room[] = [];
  selectedRoom: number = 0;

  //error message
  nameErrorMessage = '';
  birthDateErrorMessage = '';
  genderErrorMessage = '';
  phoneErrorMessage = '';
  emailErrorMessage = '';
  idNumErrorMessage = '';
  addressErrorMessage = '';
  licensePlateErrorMessage = '';
  rentDateErrorMessage = '';
  descriptionErrorMessage = '';
  roomErrorMessage = '';
  selectedFiles: File[] = [];

  constructor(private tenantPageService: TenantPageService, private tenantService: TenantService, private newHouseService: HouseService) { }


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
    this.newHouseService.uploadFiles(formData, houseId, "tenant").subscribe({
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
      document.getElementById("newTenantModal")
    );
    this.fetchRoomList();
  }

  fetchRoomList(): void {
    this.tenantPageService.getRoomList("").subscribe({
      next: (response) => {
        this.rooms = response.data;
        this.rooms = this.rooms.filter((room) => room.capacity > room.currentTenant && room.status === "Active");
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  @Output() saveClicked = new EventEmitter<void>();
  createTenant(): void {
    let hasError = false;

    if (this.name === '') {
      this.nameErrorMessage = "Name must not be empty";
      return;
    }

    if (this.birthDate === null) {
      this.birthDateErrorMessage = "birthdate must not be empty";
      return;
    }
    if (this.gender === '') {
      this.genderErrorMessage = "gender must not be empty";
      return;
    }
    if (this.phone === '') {
      this.phoneErrorMessage = "phone must not be empty";
      return;
    }

    if (this.email === '') {
      this.emailErrorMessage = "email must not be empty";
      return;
    }
    if (this.idNum === '') {
      this.idNumErrorMessage = "ID number must not be empty";
      return;
    }

    if (this.city === '' || this.district === '' || this.ward === '' || this.street === '' || this.houseNumber === '') {
      this.addressErrorMessage = "Please fill all address fields";
      return;
    }
    if (this.licensePlates === '') {
      this.licensePlateErrorMessage = "licenseplate must not be empty";
      return;
    }
    if (this.selectedRoom === 0) {
      this.roomErrorMessage = "must select a room";
      return;
    }
    if (this.rentDate === null) {
      this.rentDateErrorMessage = "rent date must not be empty";
      return;
    }
    if (this.description === '') {
      this.descriptionErrorMessage = "description must not be empty";
      return;
    }


    let permanentAddress = {
      city: this.city,
      district: this.district,
      ward: this.ward,
      street: this.street,
      houseNumber: this.houseNumber
    }
    this.tenantService.createTenant(this.name, this.selectedRoom,
      this.birthDate, this.gender,
      this.phone, this.email, this.idNum,
      permanentAddress, this.licensePlates,
      this.rentDate, this.description).subscribe({
        next: (response) => {
          console.log(response);
          this.saveClicked.emit();
          this.uploadFiles(response.id);
          //reset
          this.name = '';
          this.selectedRoom = 0;
          this.birthDate = null;
          this.gender = '';
          this.phone = '';
          this.email = '';
          this.idNum = '';
          this.city = '';
          this.district = '';
          this.ward = '';
          this.street = '';
          this.houseNumber = '';
          this.licensePlates = '';
          this.rentDate = null;
          this.description = '';
          this.closeModal();
        },
        error: (error) => {
          console.log(error);
          if (error.status === 409) {
            if (error.error.message === "This address is already taken") {
              this.addressErrorMessage = "This address is already taken";
              return;
            } else if (error.error.message === "This phone number already taken") {
              this.phoneErrorMessage = "This phone number already taken";
              return;
            } else if (error.error.message === "This email is already taken") {
              this.emailErrorMessage === "This email is already taken";
              return;
            } else if (error.error.message === "This ID number is already taken") {
              this.idNumErrorMessage = "This ID number is already taken";
              return;
            } else if (error.error.message === "This license palate is already taken") {
              this.licensePlateErrorMessage = "This license palate is already taken";
              return;
            }
          } else if (error.status === 509) {
            this.roomErrorMessage === "This room is full";
            return;
          } else if (error.status === 400) {
            this.roomErrorMessage = "This room is Inactive";
            return;
          } else if (error.status === 404) {
            this.roomErrorMessage = "Not found room";
            return;
          }
          hasError = true;
        }
      });

    if (hasError) {
      return;
    }


  }

  formModel: any;
  openModal() {
    this.formModel.show();
  }
  closeModal() {
    this.formModel.hide();
  }


}

