import {EditorView, Decoration, ViewPlugin, DecorationSet, ViewUpdate} from "@codemirror/view";
import {Extension, RangeSetBuilder} from "@codemirror/state";
import * as linkify from 'linkifyjs';
import 'linkify-plugin-hashtag';
import 'linkify-plugin-mention';

const link = Decoration.mark({
  attributes: {class: "cm-link"}
});
const baseTheme = EditorView.baseTheme({
  ".cm-link": {color: "#0091f2"},
});

const addLinkDecoration = ViewPlugin.fromClass(class {
  decorations: DecorationSet;

  constructor(view: EditorView) {
    this.decorations = linkDeco(view);
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged) {
      this.decorations = linkDeco(update.view)
    }
  }
}, {
  decorations: v => v.decorations
});

function linkDeco(view: EditorView) {
  let builder = new RangeSetBuilder<Decoration>();
  for (let {from, to} of view.visibleRanges) {
    for (let pos = from; pos <= to;) {
      let line = view.state.doc.lineAt(pos);
      const links = getLinksByPosition(line.from, line.to, line.text);
      for (const cl of links) {
      	builder.add(cl.from, cl.to, link);
      }
      
      pos = line.to + 1;
    }
  }
  return builder.finish()
}

function getLinksByPosition(start: number, end: number, s: string) {
	const res: Array<{from: number, to: number}>= [];
  const links = linkify.find(s);

  for (const li of links) {
    if (li.type === 'url' || li.type === 'mention' || li.type === 'hashtag') {
      res.push({from: start + li.start, to: start + li.end });
    }
  }

	return res;
}

export function linkExtension(options: {step?: number} = {}): Extension {
  return [
    baseTheme,
    addLinkDecoration
  ]
}