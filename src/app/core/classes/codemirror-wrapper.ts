import { EditorState, StateField, StateEffect, Compartment } from '@codemirror/state';
import { EditorView, keymap, placeholder, highlightSpecialChars } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { history, historyKeymap } from '@codemirror/history';
import { Observable, Subject } from 'rxjs';
import { defaultHighlightStyle } from "@codemirror/highlight";
import { bracketMatching } from "@codemirror/matchbrackets";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/closebrackets";
import { linkExtension } from '../utils/codemirror/link-extension';

export class CodeMirrorWrapper {
	editorState: EditorState|null = null;
  editorView: EditorView|null = null;
  placeholderCompartment: Compartment = new Compartment();
  updateEffectsCompartment: Compartment = new Compartment();
  editableCompartment: Compartment = new Compartment();
  private _content: Subject<string>;
  public contentStream: Observable<string>;
  public content: string;

  constructor() {
  	this._content = new Subject<string>();
    this.contentStream = this._content.asObservable();
    this.content = '';
  }

  init(container: any, placeholderTxt= 'What\'s on your mind?') {
		const obs = new Observable((subscriber) => {
	    try {
	      window.setTimeout(() => {
	        this.editorState = EditorState.create({
	          doc: '',
	          extensions: [
	          	history(),
	          	highlightSpecialChars(),
							bracketMatching(),
							closeBrackets(),
							this.placeholderCompartment.of(placeholder(placeholderTxt)),
							this.updateEffectsCompartment.of([]),
	          	keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap]),
	          	defaultHighlightStyle.fallback,
	          	EditorView.lineWrapping,
	          	linkExtension(),
	          	this.editableCompartment.of(EditorView.editable.of(true))
	          ]
	        });

	        this.editorView = new EditorView({
	          state: this.editorState,
	          parent: container,
	          
	        });

	        this.editorView.dispatch({
						effects: this.updateEffectsCompartment.reconfigure(EditorView.updateListener.of((upd) => {
							this.content = upd.state.doc.toString().trim();
							this._content.next(this.content);
						}))
					});

	        subscriber.next();
	        subscriber.complete();
	      }, 500);
	      
	    } catch (error) {
	      subscriber.error(error);
	    }

	  });

	  return obs;
  }

  updatePlaceholder(placeholderTxt: string) {
  	this.editorView!.dispatch({
	    effects: this.placeholderCompartment.reconfigure(placeholder(placeholderTxt))
	  })
  }

  editable(readOnly: boolean) {
  	this.editorView!.dispatch({
	    effects: this.editableCompartment.reconfigure(EditorView.editable.of(readOnly))
	  })
  }

  resetEditor() {
  	const text = this.editorView!.state.doc.toString();
  	const size = text.length;
  	this.editorView!.dispatch({
		  changes: {from: 0, to: size, insert: ''}
		});
  }

  destroy() {
  	this.editorView!.destroy();
  }
  

}