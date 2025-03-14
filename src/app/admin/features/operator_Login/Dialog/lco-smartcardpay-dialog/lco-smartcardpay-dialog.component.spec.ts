import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcoSmartcardpayDialogComponent } from './lco-smartcardpay-dialog.component';

describe('LcoSmartcardpayDialogComponent', () => {
  let component: LcoSmartcardpayDialogComponent;
  let fixture: ComponentFixture<LcoSmartcardpayDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LcoSmartcardpayDialogComponent]
    });
    fixture = TestBed.createComponent(LcoSmartcardpayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
