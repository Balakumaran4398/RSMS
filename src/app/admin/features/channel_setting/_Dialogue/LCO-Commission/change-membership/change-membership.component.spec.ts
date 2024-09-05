import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeMembershipComponent } from './change-membership.component';

describe('ChangeMembershipComponent', () => {
  let component: ChangeMembershipComponent;
  let fixture: ComponentFixture<ChangeMembershipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeMembershipComponent]
    });
    fixture = TestBed.createComponent(ChangeMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
