import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraiReportComponent } from './trai-report.component';

describe('TraiReportComponent', () => {
  let component: TraiReportComponent;
  let fixture: ComponentFixture<TraiReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TraiReportComponent]
    });
    fixture = TestBed.createComponent(TraiReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
