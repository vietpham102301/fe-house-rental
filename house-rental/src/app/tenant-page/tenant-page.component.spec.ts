import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantPageComponent } from './tenant-page.component';

describe('TenantPageComponent', () => {
  let component: TenantPageComponent;
  let fixture: ComponentFixture<TenantPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TenantPageComponent]
    });
    fixture = TestBed.createComponent(TenantPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
