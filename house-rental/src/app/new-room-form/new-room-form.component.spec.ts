import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRoomFormComponent } from './new-room-form.component';

describe('NewRoomFormComponent', () => {
  let component: NewRoomFormComponent;
  let fixture: ComponentFixture<NewRoomFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewRoomFormComponent]
    });
    fixture = TestBed.createComponent(NewRoomFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
