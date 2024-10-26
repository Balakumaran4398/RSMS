import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasdialogueComponent } from './casdialogue.component';

describe('CasdialogueComponent', () => {
  let component: CasdialogueComponent;
  let fixture: ComponentFixture<CasdialogueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CasdialogueComponent]
    });
    fixture = TestBed.createComponent(CasdialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
