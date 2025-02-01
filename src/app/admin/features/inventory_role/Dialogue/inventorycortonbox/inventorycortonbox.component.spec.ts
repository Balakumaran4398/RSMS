import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorycortonboxComponent } from './inventorycortonbox.component';

describe('InventorycortonboxComponent', () => {
  let component: InventorycortonboxComponent;
  let fixture: ComponentFixture<InventorycortonboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InventorycortonboxComponent]
    });
    fixture = TestBed.createComponent(InventorycortonboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
