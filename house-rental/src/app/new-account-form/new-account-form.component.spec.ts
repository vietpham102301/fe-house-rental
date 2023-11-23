import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAccountFormComponent } from './new-account-form.component';

describe('NewAccountFormComponent', () => {
  let component: NewAccountFormComponent;
  let fixture: ComponentFixture<NewAccountFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewAccountFormComponent]
    });
    fixture = TestBed.createComponent(NewAccountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
