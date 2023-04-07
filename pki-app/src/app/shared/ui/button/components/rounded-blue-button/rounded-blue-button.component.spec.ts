import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundedBlueButtonComponent } from './rounded-blue-button.component';

describe('RoundedBlueButtonComponent', () => {
  let component: RoundedBlueButtonComponent;
  let fixture: ComponentFixture<RoundedBlueButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundedBlueButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundedBlueButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
