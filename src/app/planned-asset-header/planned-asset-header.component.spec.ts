import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannedAssetHeaderComponent } from './planned-asset-header.component';

describe('PlannedAssetHeaderComponent', () => {
  let component: PlannedAssetHeaderComponent;
  let fixture: ComponentFixture<PlannedAssetHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlannedAssetHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannedAssetHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
