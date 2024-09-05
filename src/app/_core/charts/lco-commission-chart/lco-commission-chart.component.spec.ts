import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcoCommissionChartComponent } from './lco-commission-chart.component';

describe('LcoCommissionChartComponent', () => {
  let component: LcoCommissionChartComponent;
  let fixture: ComponentFixture<LcoCommissionChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LcoCommissionChartComponent]
    });
    fixture = TestBed.createComponent(LcoCommissionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
