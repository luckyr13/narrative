import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordAudioDialogComponent } from './record-audio-dialog.component';

describe('RecordAudioDialogComponent', () => {
  let component: RecordAudioDialogComponent;
  let fixture: ComponentFixture<RecordAudioDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordAudioDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordAudioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
