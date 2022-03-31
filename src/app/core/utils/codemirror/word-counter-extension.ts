import {Panel} from "@codemirror/panel";
import {showPanel} from "@codemirror/panel";
import {Text} from "@codemirror/text";
import { EditorView } from '@codemirror/view';

/*
* From: https://codemirror.net/6/examples/panel/
*/
function countWords(doc: Text) {
  let count = 0, iter = doc.iter()
  while (!iter.next().done) {
    let inWord = false
    for (let i = 0; i < iter.value.length; i++) {
      let word = /\w/.test(iter.value[i])
      if (word && !inWord) count++
      inWord = word
    }
  }
  return `Word count: ${count}`
}

function wordCountPanel(view: EditorView): Panel {
  let dom = document.createElement("div")
  dom.textContent = countWords(view.state.doc)
  dom.className = "cm-data-info-panel"
  return {
    dom,
    update: (update) => {
      if (update.docChanged) {
        dom.textContent = countWords(update.state.doc)
      }
    }
  }
}

function dataCountPanel(view: EditorView): Panel {
  let dom = document.createElement("div")
  dom.textContent = countData(view.state.doc)
  dom.className = "cm-data-info-panel"
  return {
    dom,
    update: (update) => {
      if (update.docChanged) {
        dom.textContent = countData(update.state.doc)
      }
    }
  }
}

function countData(doc: Text) {
  let count = 0, iter = doc.iter();
  while (!iter.next().done) {
    for (let i = 0; i < iter.value.length; i++) {
      count++;
    }
  }
  return `Story size: ${count} byte${count === 1 ? '' : 's'}`;
}

const dataInfoTheme = EditorView.baseTheme({
  '.cm-panels': {
    color: 'inherit !important',
    backgroundColor: 'inherit !important',
  },
  '.cm-data-info-panel': {
    padding: '5px 10px',
    color: 'inherit !important',
    backgroundColor: 'inherit !important',
    fontFamily: 'monospace',
    textAlign: 'right'
  },
})

export function wordCounter() {
  return [showPanel.of(wordCountPanel), dataInfoTheme];
}

export function dataCounter() {
  return [showPanel.of(dataCountPanel), dataInfoTheme];
}