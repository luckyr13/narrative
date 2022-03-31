import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UtilsService } from '../../core/utils/utils.service';

@Component({
  selector: 'app-story-player-link',
  templateUrl: './story-player-link.component.html',
  styleUrls: ['./story-player-link.component.scss']
})
export class StoryPlayerLinkComponent implements OnInit, OnDestroy {
  @Input('link') link!: string;
  pageHTML: string = '';
  constructor(private _utils: UtilsService) { }

  ngOnInit(): void {
    
  }

  ngOnDestroy() {
  }


}
