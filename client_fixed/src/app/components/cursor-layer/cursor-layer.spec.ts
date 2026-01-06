import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursorLayer } from './cursor-layer.component';

describe('CursorLayer', () => {
  let component: CursorLayer;
  let fixture: ComponentFixture<CursorLayer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CursorLayer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursorLayer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
