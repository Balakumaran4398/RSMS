import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcoSmartcardDialogComponent } from './lco-smartcard-dialog.component';

describe('LcoSmartcardDialogComponent', () => {
  let component: LcoSmartcardDialogComponent;
  let fixture: ComponentFixture<LcoSmartcardDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LcoSmartcardDialogComponent]
    });
    fixture = TestBed.createComponent(LcoSmartcardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
