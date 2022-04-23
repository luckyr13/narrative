import {
  Component, OnInit, ViewChild,
  ElementRef, AfterViewInit, OnDestroy,
  Output, EventEmitter
} from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-emojis',
  templateUrl: './emojis.component.html',
  styleUrls: ['./emojis.component.scss']
})
export class EmojisComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('emojiContainer') emojiContainer!: ElementRef;
  @Output('emojiSelectedEvent') emojiSelectedEvent: EventEmitter<string> = new EventEmitter();
  @ViewChild('tabsGroupContainer') tabsGroupContainer!: MatTabGroup;

	emojis: string[] = [
		'😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
    '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😋', '😝', '🤑',
    '😜', '🤪', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑',
    '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤',
    '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴',
    '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '🙁', '☹', '😮',
    '😲', '😳', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😓',
    '🥱', '😤', '😡', '🤬', '😈', '☠', '💀', '💩', '🤡', '👹',
    '👺', '👻', '👽', '👾', '🤖',
	];

  // Nature
  emojis2: string[] = [
    '🐘', '🐭', '😺', '🐰', '🦇', '🐻',
    '😸', '😹', '😻', '😼',
    '😽', '🙀', '😿', '😾', '🙈', '🙉', '🙊', 
    '🐵', '🦍', '🦧', '🐶', '🐕', '🐺',
    '🦊', '🦝', '🐈', '🦁', '🐯', '🐅',
    '🐆', '🐴', '🐎', '🦄', '🐮', '🦓',
    '🐂', '🐄', '🐷', '🐖', '🐗', '🐽',
    '🐐', '🐀', '🐨', '🐼', '🦥',
    '🦨', '🦘', '🦡', '🦃', '🐾', '🐔',
    '🐣', '🐦', '🦉', '🦚', '🦅', '🐊',
    '🐢', '🐍', '🐲', '🦋', '🐝', '🐜', '🕷️'

  ];

  // Objects
  emojis3: string[] = [
    '💋', '💌', '💘', '🚀', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🤍', '💯',
    '💥', '👋', '👌', '👍', '👎', '🤳', '🙌', '🙏', 
    '🤝', '💪', '👀', '🔥', '❤️‍🔥',
    '⌚', '🎈', '🎉', '🎁', '🧸', '📱', '💻',
    '📷', '💡', '📗', '📕', '📙', '📘', '📚',
    '📒', '📰', '🗞️', '💰', '💸', '✏️', '🖊️',
    '📁', '📈', '📉', '🔒', '🔑', '💊', '⚗️',
    '🔬', '🩺', '🩹', '🚬', '⚰️', '🛒'
  ];


  constructor() { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    (<HTMLElement>this.emojiContainer.nativeElement).addEventListener('click',
      (event) => { this.onClickEvent(event); },
      false
    );
   this.tabsGroupContainer.selectedIndex = 0;
  }

  onClickEvent(event: MouseEvent): any {
    const target = <HTMLElement>event.target;
    const emoji = target && target.classList.contains('emoji') ? target.innerHTML.trim() : '';
    event.preventDefault();
    event.stopPropagation();
    this.emojiSelectedEvent.emit(emoji);
  }

  ngOnDestroy() {
    (<HTMLElement>this.emojiContainer.nativeElement).removeEventListener('click', this.onClickEvent, false);
  }

}
