import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposedCreateStoryDialogComponent } from './composed-create-story-dialog.component';

describe('ComposedCreateStoryDialogComponent', () => {
  let component: ComposedCreateStoryDialogComponent;
  let fixture: ComponentFixture<ComposedCreateStoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComposedCreateStoryDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComposedCreateStoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
