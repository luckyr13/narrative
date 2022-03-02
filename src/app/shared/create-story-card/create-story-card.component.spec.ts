import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStoryCardComponent } from './create-story-card.component';

describe('CreateStoryCardComponent', () => {
  let component: CreateStoryCardComponent;
  let fixture: ComponentFixture<CreateStoryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateStoryCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStoryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
