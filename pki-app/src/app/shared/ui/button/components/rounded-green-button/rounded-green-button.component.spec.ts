import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundedGreenButtonComponent } from './rounded-green-button.component';

describe('RoundedGreenButtonComponent', () => {
  let component: RoundedGreenButtonComponent;
  let fixture: ComponentFixture<RoundedGreenButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundedGreenButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundedGreenButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
