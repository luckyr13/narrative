import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStoryDialogComponent } from './new-story-dialog.component';

describe('NewStoryDialogComponent', () => {
  let component: NewStoryDialogComponent;
  let fixture: ComponentFixture<NewStoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewStoryDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewStoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
