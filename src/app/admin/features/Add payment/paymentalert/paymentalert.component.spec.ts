import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentalertComponent } from './paymentalert.component';

describe('PaymentalertComponent', () => {
  let component: PaymentalertComponent;
  let fixture: ComponentFixture<PaymentalertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentalertComponent]
    });
    fixture = TestBed.createComponent(PaymentalertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
