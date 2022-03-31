import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryPlayerComponent } from './story-player.component';

describe('StoryPlayerComponent', () => {
  let component: StoryPlayerComponent;
  let fixture: ComponentFixture<StoryPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoryPlayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
