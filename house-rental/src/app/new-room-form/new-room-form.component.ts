import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RoomService } from './service/room.service';
import { HousePageService } from '../house-page/service/house-page.service';
import { HouseService } from '../new-house-form/services/house.service';

declare var window:any;
@Component({
  selector: 'app-new-room-form',
  templateUrl: './new-room-form.component.html',
  styleUrls: ['./new-room-form.component.scss']
})
export class NewRoomFormComponent implements OnInit{

  houses: any = [];


  name: string = '';
  houseId: any = '' ;
  floor: any = '';
  area: any = '';
  status: string ='';
  
  rents: any = '';
  description: string = '';
  capacity: any = '';
  serviceAdded!:string;

  //service
  defaultService1: any = '';
  defaultService2: any = '';

  selectedServices: any[] = [];

  //error message
  nameError: string = '';
  houseError: string = '';
  floorError: string = '';
  areaError: string = '';
  statusError: string = '';
  rentError: string = '';
  descriptionError: string = '';
  capacityError: string = '';
  selectedFiles: File[] = [];

  constructor(private roomService: RoomService, private houseService: HousePageService, private newHouseService: HouseService) { }

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
    this.newHouseService.uploadFiles(formData, houseId, "room").subscribe({
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
    this.newRoomModal = new window.bootstrap.Modal(
      document.getElementById("newRoomModal")
    );    
    this.newServiceModal = new window.bootstrap.Modal(
      document.getElementById("newServiceModal")
    )

    this.fetchHouseList();
   
  }

  fetchHouseList(): void {
    this.houseService.getHouseList("", "", "", "", "", "100").subscribe({
      next:(response) => {this.houses = response.houses;
        this.houses = this.houses.filter((house: any) => house.status === "Active");
      },
      error:(error) => {
        console.log(error);
      }
    });
  }


  @Output() saveClicked = new EventEmitter<void>();
  createRoom(): void {

    if(this.name == ''){
      this.nameError = 'Name is required';
      return;
    }
    if(this.houseId == ''){
      this.houseError = 'House is required';
      return;
    }

    if(this.floor == ''){
      this.floorError = 'Floor is required';
      return;
    }

    if(this.area == ''){
      this.areaError = 'Area is required';
      return;
    }

    if(this.status == ''){
      this.statusError = 'Status is required';
      return;
    }

    if(this.rents == ''){
      this.rentError = 'Rent is required';
      return;
    }


    if(this.description == ''){
      this.descriptionError = 'Description is required';
      return;
    }

    if(this.capacity == 0){
      this.capacityError = 'Capacity is required';
      return;
    }



    let services: any[] = [];
    if(this.defaultService1 != ''){
      services.push({
        name: 'Wifi',
      });
    }
    if(this.defaultService2 != ''){
      services.push({
        name: 'Air conditioner',
      });
    }

    this.selectedServices.forEach((service) => {
      services.push({
        name: service.name
      });
    });

    const room = {
      name: this.name,
      houseId: this.houseId,
      floor: this.floor,
      area: this.area,
      status: this.status,
      rentFee: this.rents,
      description: this.description,
      capacity: this.capacity,
      services: services
    }

    this.roomService.createRoom(room).subscribe({
      next: (response) => {
        console.log(response);
        this.closeModal();
        this.uploadFiles(response.id);
        // reset
        this.name = '';
        this.houseId = '' ;
        this.floor = '';
        this.area = '';
        this.status = '';
        this.rents = '';
        this.description = '';
        this.defaultService1 = '';
        this.defaultService2 = '';
        this.selectedServices = [];
        this.capacity = '';
        // reset all error message
        this.nameError = '';
        this.houseError = '';
        this.floorError = '';
        this.areaError = '';
        this.statusError = '';
        this.rentError = '';
        this.descriptionError = '';
        this.capacityError = '';
        this.selectedFiles = [];
        
        this.saveClicked.emit();

      }
    })
  }


  handleCheckboxChange(service: any): void {
    if (!service.checked) {
      this.selectedServices.push(service); 
    } else {
      const index = this.selectedServices.indexOf(service);
      if (index !== -1) {
        this.selectedServices.splice(index, 1);
      }
    }
  }

  saveService(): void{
    if(this.serviceAdded !== ''){
      this.selectedServices.push({
        name: this.serviceAdded,
        checked: true
      });
      this.serviceAdded = '';
      this.closeServiceModal();
    }
    this.closeServiceModal();
  }

  newRoomModal:any;
  openModal(){
    this.newRoomModal.show();
  }
  closeModal(){
    this.newRoomModal.hide();
  }

  newServiceModal:any;
  openServiceModal(){
    this.newRoomModal.hide()
    this.newServiceModal.show();
  }
  closeServiceModal(){
    this.newServiceModal.hide();
    this.newRoomModal.show();
  }
}
