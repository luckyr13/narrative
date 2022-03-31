import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as linkify from 'linkifyjs';
import linkifyStr from 'linkify-string';
import 'linkify-plugin-hashtag';
import 'linkify-plugin-mention';
import DOMPurify from 'dompurify';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
   // allowed URI schemes
  allowlist = ['https', 'http', 'ipfs'];
  // build fitting regex
  regex = RegExp('^(' + this.allowlist.join('|') + '):', 'gim');
  // Options for linkify
  options = {
    defaultProtocol: 'https',
    target: '_blank',
    formatHref: {
      hashtag: (href: string) => '/#/search/' + href.substr(1),
      mention: (href: string) => '/#/' + href.substr(1)
    }
  };

  constructor(
    private _snackBar: MatSnackBar) {
    const _this = this;

    // Add a hook to enforce URI scheme allow-list
    DOMPurify.addHook('afterSanitizeAttributes', function(node) {
      // build an anchor to map URLs to
      var anchor = document.createElement('a');

      // check all href attributes for validity
      if (node.hasAttribute('href')) {
        anchor.href = node.getAttribute('href')!;
        if (anchor.protocol && !anchor.protocol.match(_this.regex)) {
          node.removeAttribute('href');
        }
      }
      // check all action attributes for validity
      if (node.hasAttribute('action')) {
        anchor.href = node.getAttribute('action')!;
        if (anchor.protocol && !anchor.protocol.match(_this.regex)) {
          node.removeAttribute('action');
        }
      }
      // check all xlink:href attributes for validity
      if (node.hasAttribute('xlink:href')) {
        anchor.href = node.getAttribute('xlink:href')!;
        if (anchor.protocol && !anchor.protocol.match(_this.regex)) {
          node.removeAttribute('xlink:href');
        }
      }
    });
  }


  /*
  *  Custom snackbar message
  */
  message(msg: string, panelClass: string = '', verticalPosition: any = undefined) {
    this._snackBar.open(msg, 'X', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: verticalPosition,
      panelClass: panelClass
    });
  }

  ellipsis(s: string) {
    const minLength = 12;
    const sliceLength = 5;

    return s.length < minLength ? s : `${s.substring(0, sliceLength)}...${s.substring(s.length - sliceLength, s.length)}`;
  }

  getLinks(s: string) {
    const sanitizedContent = DOMPurify.sanitize(s, {ALLOWED_TAGS: []});
    const links = linkify.find(sanitizedContent, 'url');
    return links;
  }

  sanitize(s: string): string {
    const sanitizedContent = DOMPurify.sanitize(s, {ALLOWED_TAGS: []});
    return DOMPurify.sanitize(linkifyStr(sanitizedContent, this.options), {ALLOWED_TAGS: ['a'], ALLOWED_ATTR: ['target', 'href']});
  }

  sanitizeFull(s: string): string {
    const sanitizedContent = DOMPurify.sanitize(s, {ALLOWED_TAGS: []});
    return sanitizedContent;
  }
}
