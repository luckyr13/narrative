import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchStoryDialogComponent } from './search-story-dialog.component';

describe('SearchStoryDialogComponent', () => {
  let component: SearchStoryDialogComponent;
  let fixture: ComponentFixture<SearchStoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchStoryDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchStoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
