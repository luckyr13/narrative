import {
  Component, OnInit, ViewChild,
  ElementRef, AfterViewInit, OnDestroy,
  Output, EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-emojis',
  templateUrl: './emojis.component.html',
  styleUrls: ['./emojis.component.scss']
})
export class EmojisComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('emojiContainer') emojiContainer!: ElementRef;
  @Output('emojiSelectedEvent') emojiSelectedEvent: EventEmitter<string> = new EventEmitter();

	emojis: string[] = [
		'😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
    '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😋', '😝', '🤑',
    '😜', '🤪', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑',
    '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤',
    '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴',
    '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '🙁', '☹', '😮',
    '😲', '😳', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😓',
    '🥱', '😤', '😡', '🤬', '😈', '☠', '💀', '💩', '🤡', '👹',
    '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼',
    '😽', '🙀', '😿', '😾', '🙈', '🙉', '🙊', '💋', '💌', '💘',
    '❤', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💯',
    '💥', '👋', '👌', '👍', '👎', '🙌', '🙏', '🤝', '💪', '👀',
	];

  constructor() { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    (<HTMLElement>this.emojiContainer.nativeElement).addEventListener('click', (event) => { this.onClickEvent(event); }, false);
  }

  onClickEvent(event: MouseEvent): any {
    const target = <HTMLElement>event.target;
    const emoji = target && target.classList.contains('emoji') ? target.innerHTML.trim() : '';
    // event.preventDefault();
    this.emojiSelectedEvent.emit(emoji);
  }

  ngOnDestroy() {
    (<HTMLElement>this.emojiContainer.nativeElement).removeEventListener('click', this.onClickEvent, false);
  }

}
