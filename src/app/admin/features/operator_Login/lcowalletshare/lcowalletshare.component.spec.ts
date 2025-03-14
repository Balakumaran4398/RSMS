import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcowalletshareComponent } from './lcowalletshare.component';

describe('LcowalletshareComponent', () => {
  let component: LcowalletshareComponent;
  let fixture: ComponentFixture<LcowalletshareComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LcowalletshareComponent]
    });
    fixture = TestBed.createComponent(LcowalletshareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
