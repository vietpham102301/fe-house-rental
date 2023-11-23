import { EmployeePageService } from './service/employee-page.service';

import { Employee } from './models/employee.model';
import { House } from '../house-page/models/house';
import { HouseService } from './../new-house-form/services/house.service';
import { Component, Input, ViewChild } from '@angular/core';

import { NewEmployeeFormComponent } from '../new-employee-form/new-employee-form.component';
import { HousePageService } from '../house-page/service/house-page.service';
import { NewHouseFormComponent } from '../new-house-form/new-house-form.component';

@Component({
  selector: 'app-employee-page',
  templateUrl: './employee-page.component.html',
  styleUrls: ['./employee-page.component.scss']
})
export class EmployeePageComponent {
  ngOnInit() {
    this.fetchEmployeeList("", "", "");
    this.fetchHouseList()
   
  }

  constructor(private employeeService: EmployeePageService, private houseService: HousePageService, private newHouseService: HouseService) { }

  disableArr: boolean[] = [];
  employees: Employee[] = [];
  houses: House[] = [];
  selectedHouse = '';

  
  selectedStatus = '';
  keywords = '';
  isSearchClicked = false;
  totalPages!: number;

  editMode: boolean = false;
  currentPage = '0';

  passwordReset: string ='';


  selectedIndexArr: number[] = [];
  showModal: boolean = false;
  selectedImageId!: number;
  selectedFiles: File[] = [];

  @Input() indicators = true;

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

  deleteImageConfirmed(tenantIndex: number) {
    let imageIndex = this.selectedIndexArr[tenantIndex];
    this.selectedImageId = this.employees[tenantIndex].imageData[imageIndex].id;
    this.selectedIndexArr[tenantIndex] = 0;
    this.houseService.deleteImage(this.selectedImageId).subscribe({
      next: (response: any) => {
        console.log(response);
        if (this.isSearchClicked) {
          this.fetchEmployeeByKeywords(this.currentPage)
        } else {
          this.fetchEmployeeList(this.selectedHouse, this.selectedStatus, this.currentPage);
        }
        this.closeModal();
      },
      error: (error) => {
        console.log(error);
      }
    });
    
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  isCollapsed: { [target: string]: boolean } = {};
  toggleCollapse(target: string) {
    this.isCollapsed[target] = !this.isCollapsed[target];
  }

  fetchEmployeeList(houseName: string, status: string, page: string): void {
    this.employeeService.getEmployeeList(houseName, status, page).subscribe({
      next: (response) => {
        this.employees = response.data;
        this.totalPages = response.totalPages;
        this.employees.forEach(() => {
          this.disableArr.push(true);
          this.selectedIndexArr.push(0);
        });
        this.isSearchClicked = false;
        this.currentPage = page;
        console.log(this.employees);
      }
    });
  }

  fetchEmployeeByKeywords(page: string): void {
    this.employeeService.searchEmployeeList(this.keywords, page).subscribe({
      next: (response) => {
        this.employees = response.data;
        this.totalPages = response.totalPages;
        this.isSearchClicked = true;
        this.selectedHouse = '';
        this.selectedStatus = '';
        this.currentPage = page;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  fetchHouseList(): void {
    this.houseService.getHouseList("", "", "", "", "", "100").subscribe({
      next: (response) => { this.houses = response.houses; },
      error: (error) => {
        console.log(error);
      }
    });
  }

  @ViewChild(NewEmployeeFormComponent) newEmployeeForm!: NewEmployeeFormComponent;
  ngAfterViewInit(): void {
    this.newEmployeeForm.saveClicked.subscribe(() => {
      this.fetchEmployeeList("", "", "");
    });
  }

  onHouseChange(event: any) {
    this.selectedHouse = event.target.value;
    this.fetchEmployeeList(this.selectedHouse, this.selectedStatus, "");
  }

 

  onStatusChange(event: any) {
    this.selectedStatus = event.target.value;
    this.fetchEmployeeList(this.selectedHouse,  this.selectedStatus, "");
  }

  

  updateEmployee(employee: Employee, index: number): void {
    const updateRequest = {
      name: employee.name,
      role: employee.role,
      username: employee.username,
      birthDate: employee.birthDate,
      gender: employee.gender,
      email: employee.email,
      phone: employee.phone,
      idNumber: employee.idNumber,
      startedDate: employee.startedDate,
      status: employee.status,
      description: employee.description,
      password: this.passwordReset
    };

    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      this.employeeService.updateEmployee(updateRequest, employee.id).subscribe({
        next: (response) => {
          console.log(response);
          this.disableArr[index] = true;
          this.editMode = !this.editMode;
          if (this.isSearchClicked) {
            this.fetchEmployeeByKeywords(this.currentPage);
          } else {
            this.fetchEmployeeList(
              this.selectedHouse,
              this.selectedStatus,
              this.currentPage
            );
          }
        },
        error: (e) => {
          console.log(e);
        }
      });
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('files', this.selectedFiles[i]);
    }

    this.newHouseService.uploadFiles(formData, employee.id, "user").subscribe({
      next: (response: any) => {
        console.log(response);
        if(response.status === 200){
          console.log("ok");
        }
        this.employeeService.updateEmployee(updateRequest, employee.id).subscribe({
          next: (response) => {
            console.log(response);
            this.disableArr[index] = true;
            this.editMode = !this.editMode;
            this.selectedFiles = [];
            if (this.isSearchClicked) {
              this.fetchEmployeeByKeywords(this.currentPage);
            } else {
              this.fetchEmployeeList(
                this.selectedHouse,
                this.selectedStatus,
                this.currentPage
              );
            }
          },
          error: (e) => {
            console.log(e);
          }
        });
      },
      error: (error: any) => {
        console.log(error);
      }
    });
   
  }
  

  inactiveEmployee(employeeId: number): void {
    this.employeeService.inactiveEmployee(employeeId).subscribe({
      next: (response) => {
        console.log(response);
        if (this.isSearchClicked) {
          this.fetchEmployeeByKeywords(this.currentPage);
        } else {
          this.fetchEmployeeList(this.selectedHouse, this.selectedStatus, this.currentPage);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  onDeleteButtonClick(event: Event, employeeId: number): void {
    event.stopPropagation();
    this.inactiveEmployee(employeeId);
  }

  onEditButtonClick(event: Event, index: number) {
    event.stopPropagation();
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.disableArr[index] = false;
    } else {
      this.disableArr[index] = true;
    }
  }
}
