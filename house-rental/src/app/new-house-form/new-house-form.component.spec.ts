import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewHouseFormComponent } from './new-house-form.component';

describe('NewHouseFormComponent', () => {
  let component: NewHouseFormComponent;
  let fixture: ComponentFixture<NewHouseFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewHouseFormComponent]
    });
    fixture = TestBed.createComponent(NewHouseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
