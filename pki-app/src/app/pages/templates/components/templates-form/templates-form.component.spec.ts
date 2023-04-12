import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesFormComponent } from './templates-form.component';

describe('TemplatesFormComponent', () => {
  let component: TemplatesFormComponent;
  let fixture: ComponentFixture<TemplatesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplatesFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplatesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
