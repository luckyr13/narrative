import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-story-player',
  templateUrl: './story-player.component.html',
  styleUrls: ['./story-player.component.scss']
})
export class StoryPlayerComponent implements OnInit {
  @Input('substories') substories!: string[];

  constructor() { }

  ngOnInit(): void {

  }

}
