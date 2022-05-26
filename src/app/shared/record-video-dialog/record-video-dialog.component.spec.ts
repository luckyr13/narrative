import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordVideoDialogComponent } from './record-video-dialog.component';

describe('RecordVideoDialogComponent', () => {
  let component: RecordVideoDialogComponent;
  let fixture: ComponentFixture<RecordVideoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordVideoDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordVideoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
