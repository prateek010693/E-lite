import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterComplianceComponent } from './meter-compliance.component';

describe('MeterComplianceComponent', () => {
  let component: MeterComplianceComponent;
  let fixture: ComponentFixture<MeterComplianceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeterComplianceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterComplianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
