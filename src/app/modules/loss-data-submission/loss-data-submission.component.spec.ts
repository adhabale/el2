import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LossDataSubmissionComponent } from './loss-data-submission.component';

describe('LossDataSubmissionComponent', () => {
  let component: LossDataSubmissionComponent;
  let fixture: ComponentFixture<LossDataSubmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LossDataSubmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LossDataSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
