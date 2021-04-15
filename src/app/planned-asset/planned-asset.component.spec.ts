import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannedAssetComponent } from './planned-asset.component';

describe('PlannedAssetComponent', () => {
  let component: PlannedAssetComponent;
  let fixture: ComponentFixture<PlannedAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlannedAssetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannedAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
