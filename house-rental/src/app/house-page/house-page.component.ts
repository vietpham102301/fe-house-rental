import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { House } from './models/house';
import { HousePageService } from './service/house-page.service';
import { NewHouseFormComponent } from '../new-house-form/new-house-form.component';
import { HouseService } from '../new-house-form/services/house.service';
import { User } from '../new-house-form/models/manager.model';
declare var window: any;
@Component({
  selector: 'app-house-page',
  templateUrl: './house-page.component.html',
  styleUrls: ['./house-page.component.scss']
})


export class HousePageComponent {
  houses: House[] = [];
  cities: string[] = [];
  selectedCity: string = '';

  districts: string[] = [];
  selectedDistrict: string = '';

  wards: string[] = [];
  selectedWard: string = '';

  selectedStatus: string = '';


  keywords: string = '';

  totalPages!: number;
  isSearchClick = false;


  isNumberOfPageLoad = 0;

  //for edit
  editMode = false;
  disableArr: boolean[] = [];

  currentPage = '0';

  
  managers: User[] = []

  showModal: boolean = false;
  selectedImageId!: number;
  selectedFiles: File[] = [];

  @Input() indicators = true;
  selectedIndexArr: number[] = [];

  constructor(private houseService: HousePageService, private newhouseService: HouseService) { }

  capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  selectedImage(index:number, houseIndex: number): void{
    this.selectedIndexArr[houseIndex] = index;
  }

  onFileSelected(event: any) {
    this.selectedFiles = event.target.files;
  }
  
  showDeleteConfirmationModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  updateHouse(house: House, index: number): void {
    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      this.houseService.updateHouse(house.name, house.address, house.facilities, house.establishDate, house.manager, house.status, house.description, house.id).subscribe({
        next: (response) => {
          console.log(response);
          if (this.isSearchClick) {
            this.fetchHousesByKeywords(this.currentPage)
          } else {
            this.fetchHouseList(this.selectedCity, this.selectedDistrict, this.selectedWard, this.selectedStatus, this.currentPage);
          }
          this.selectedFiles = []; 
          this.disableArr[index] = true;
          this.editMode = !this.editMode;
        },
        error: (error) => {
          console.log(error);
        }
      })
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('files', this.selectedFiles[i]);
    }

    this.newhouseService.uploadFiles(formData, house.id, "house").subscribe({
      next: (response: any) => {
        console.log(response);
        if(response.status === 200){
          console.log("ok");
        }
        this.houseService.updateHouse(house.name, house.address, house.facilities, house.establishDate, house.manager, house.status, house.description, house.id).subscribe({
          next: (response) => {
            console.log(response);
            if (this.isSearchClick) {
              this.fetchHousesByKeywords(this.currentPage)
            } else {
              this.fetchHouseList(this.selectedCity, this.selectedDistrict, this.selectedWard, this.selectedStatus, this.currentPage);
            }
            this.selectedFiles = []; 
            this.disableArr[index] = true;
            this.editMode = !this.editMode;
          },
          error: (error) => {
            console.log(error);
          }
        })
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }


  deleteImageConfirmed(houseIndex: number) {
    let imageIndex = this.selectedIndexArr[houseIndex];
    this.selectedImageId = this.houses[houseIndex].imageData[imageIndex].id;
    this.selectedIndexArr[houseIndex] = 0;
    this.houseService.deleteImage(this.selectedImageId).subscribe({
      next: (response: any) => {
        console.log(response);
        if (this.isSearchClick) {
          this.fetchHousesByKeywords(this.currentPage)
        } else {
          this.fetchHouseList(this.selectedCity, this.selectedDistrict, this.selectedWard, this.selectedStatus, this.currentPage);
        }
        this.closeModal();
      },
      error: (error) => {
        console.log(error);
      }
    });
    
  }



  ngOnInit() {

    this.newhouseService.getManagerList().subscribe({
      next: (response) => {
        this.managers = response.data;
      },
      error: (e) => {
        console.log(e);
      }
    })

    this.fetchHouseList("", "", "", "", "");
    this.fetchCities();

  }

  isCollapsed: { [target: string]: boolean } = {};
  toggleCollapse(target: string) {
    this.isCollapsed[target] = !this.isCollapsed[target];
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }


  fetchHouseList(city: string, district: string, ward: string, status: string, page: string): void {
    this.houseService.getHouseList(city, district, ward, status, page, "").subscribe(
      {
        next: (response) => {
          this.houses = response.houses;
          this.totalPages = response.totalPages;
          this.currentPage = page;
          this.isSearchClick = false;
          this.houses.forEach((house) => {
            this.disableArr.push(true);
            this.selectedIndexArr.push(0);
          })
          console.log(response);

        },
        complete: () => console.log("complete"),
        error: (error) => console.log(error)
      }
    )
  }



  fetchCities(): void {
    this.houseService.getCities().subscribe(
      {
        next: (response) => { this.cities = response.cities }
        ,
        complete: () => console.log("complete"),
        error: (error) => console.log(error)
      }

    )
  }

  onCityChange(event: any) {
    this.selectedCity = event.target.value;
    console.log('Selected city:', this.selectedCity);
    this.selectedDistrict = "";
    this.selectedWard = "";
    this.selectedStatus = "";
    this.fetchDistricts(this.selectedCity);
    this.fetchWards(this.selectedCity, "");
    this.fetchHouseList(this.selectedCity, "", "", "", this.selectedStatus);
  }

  fetchDistricts(city: string): void {
    this.houseService.getDistricts(city).subscribe(
      {
        next: (response) => {
          this.districts = response.districts;
          console.log(response.districts);
        },
        complete: () => console.log("complete"),
        error: (error) => console.log(error)
      }
    )
  }

  onDistrictChange(event: any) {
    this.selectedDistrict = event.target.value;
    this.selectedWard = "";
    this.fetchWards(this.selectedCity, this.selectedDistrict);
    this.fetchHouseList(this.selectedCity, this.selectedDistrict, "", this.selectedStatus, "")
  }

  fetchWards(city: string, district: string): void {
    this.houseService.getWards(city, district).subscribe(
      {
        next: (response) => { this.wards = response.wards; },
        complete: () => console.log("complete"),
        error: (error) => console.log(error)
      }
    )
  }

  onWardChange(event: any) {
    this.selectedWard = event.target.value;
    this.fetchHouseList(this.selectedCity, this.selectedDistrict, this.selectedWard, this.selectedStatus, "");
  }

  fetchHousesByKeywords(page: string) {
    this.houseService.searchHouseList(this.keywords, page).subscribe({
      next: (response) => {
        this.houses = response.data;
        this.totalPages = response.totalPages;
        this.selectedCity = '';
        this.selectedDistrict = '';
        this.selectedWard = '';
        this.selectedStatus = '';
        this.isSearchClick = true;
        this.currentPage = page;
      },
      complete: () => console.log("complete"),
      error: (error) => console.log(error)
    }
    )

  }


  @ViewChild(NewHouseFormComponent) newHouseForm!: NewHouseFormComponent;

  ngAfterViewInit(): void {

    this.newHouseForm.saveClicked.subscribe(() => {

      this.fetchHouseList("", "", "", "", "");
    });


  }


  onStatusChange(event: any) {
    this.selectedStatus = event.target.value;
    this.fetchHouseList(this.selectedCity, this.selectedDistrict, this.selectedWard, this.selectedStatus, "");
  }

  activeHouse(house: House, index: number): void {
    const address = {
      id: house.address.id,
      city: house.address.city,
      district: house.address.district,
      ward: house.address.ward,
      street: house.address.street,
      houseNumber: house.address.houseNumber
    }

    const facilities = [
      {
        id: house.facilities[0].id,
        name: house.facilities[0].name,
        price: house.facilities[0].price,
        unit: house.facilities[0].unit
      },
      {
        id: house.facilities[1].id,
        name: house.facilities[1].name,
        price: house.facilities[1].price,
        unit: house.facilities[1].unit
      },
      {
        id: house.facilities[2].id,
        name: house.facilities[2].name,
        price: house.facilities[2].price,
        unit: house.facilities[2].unit
      }

    ]

    this.houseService.updateHouse(house.name, address, facilities, house.establishDate, house.manager, "Active", house.description, house.id).subscribe({
      next: (response) => {
        console.log(response);
        // this.fetchHouseList("", "", "", "", this.currentPage);
        this.disableArr[index] = true;

        this.editMode = !this.editMode;
        if (this.isSearchClick) {
          this.fetchHousesByKeywords(this.currentPage)
        } else {
          this.fetchHouseList(this.selectedCity, this.selectedDistrict, this.selectedWard, this.selectedStatus, this.currentPage);
        }

      },
      error: (error) => {
        console.log(error);
      }
    });

  }


  inactiveHouse(houseId: number): void {
    this.houseService.inactiveHouse(houseId).subscribe({
      next: (response) => {
        console.log(response);
        if (this.isSearchClick) {
          this.fetchHousesByKeywords(this.currentPage)
        } else {
          this.fetchHouseList(this.selectedCity, this.selectedDistrict, this.selectedWard, this.selectedStatus, this.currentPage);
        }
      },
      error: (error) => {
        console.log(error);
      }
    })
  }


  onEditButtonClick(event: Event, index: number): void {
    event.stopPropagation();
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.disableArr[index] = false;
    } else {
      this.disableArr[index] = true;
    }
  }



  onDeleteButtonClick(event: Event, houseId: number): void {
    event.stopPropagation();
    this.inactiveHouse(houseId);
  }

}
