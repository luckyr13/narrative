import { Component, OnInit, Input } from '@angular/core';
import { TransactionMetadata } from '../../core/interfaces/transaction-metadata';

@Component({
  selector: 'app-story-card',
  templateUrl: './story-card.component.html',
  styleUrls: ['./story-card.component.scss']
})
export class StoryCardComponent implements OnInit {
	@Input() post!: TransactionMetadata;
	loading = false;
	loadingData = false;
	profileImage = 'assets/images/blank-profile.png';

  constructor() { }

  ngOnInit(): void {
  }

}
