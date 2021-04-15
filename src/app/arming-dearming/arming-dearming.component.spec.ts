import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmingDearmingComponent } from './arming-dearming.component';

describe('ArmingDearmingComponent', () => {
  let component: ArmingDearmingComponent;
  let fixture: ComponentFixture<ArmingDearmingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArmingDearmingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArmingDearmingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
