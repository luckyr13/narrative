import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-story-player-link',
  templateUrl: './story-player-link.component.html',
  styleUrls: ['./story-player-link.component.scss']
})
export class StoryPlayerLinkComponent implements OnInit {
  @Input('link') link!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
