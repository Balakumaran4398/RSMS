import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkoperationDialogueComponent } from './bulkoperation-dialogue.component';

describe('BulkoperationDialogueComponent', () => {
  let component: BulkoperationDialogueComponent;
  let fixture: ComponentFixture<BulkoperationDialogueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BulkoperationDialogueComponent]
    });
    fixture = TestBed.createComponent(BulkoperationDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
