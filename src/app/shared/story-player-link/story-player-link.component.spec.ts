import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryPlayerLinkComponent } from './story-player-link.component';

describe('StoryPlayerLinkComponent', () => {
  let component: StoryPlayerLinkComponent;
  let fixture: ComponentFixture<StoryPlayerLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoryPlayerLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryPlayerLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
