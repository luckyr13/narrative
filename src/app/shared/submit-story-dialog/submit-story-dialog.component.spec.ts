import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitStoryDialogComponent } from './submit-story-dialog.component';

describe('SubmitStoryDialogComponent', () => {
  let component: SubmitStoryDialogComponent;
  let fixture: ComponentFixture<SubmitStoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitStoryDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitStoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
