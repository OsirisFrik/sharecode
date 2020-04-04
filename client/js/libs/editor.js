import CodeMirror from 'codemirror';
import EventEmitter from 'events'

import 'codemirror/addon/hint/javascript-hint'
import 'codemirror/addon/hint/show-hint'

import 'codemirror/addon/hint/show-hint.css'

let editor;

class Editor extends EventEmitter {
  constructor() {
    super();
    editor = this.editor = CodeMirror(document.body, {
      mode: 'javascript',
      lineNumbers: true,
      theme: 'material-darker',
      tabSize: 2,
      extraKeys: {
        'Ctrl-Alt-A': 'autocomplete'
      },
      hintOptions: {
        completeSingle: false
      }
    });

    this.openedHint = false

    this.editor.on('keyup', (_inst, event) => this.autoComplete(_inst, event));
    this.editor.on('change', (_inst, change) => this.emit('change', change));

    window.$editor = this.editor
  }

  autoComplete(editor, event) {
    if (
      !this.openedHint &&
      event.key !== 'Escape' &&
      this.editor.getCursor().ch > 2
    ) {
      this.openedHint = true
      this.editor.showHint()
    } else {
      this.openedHint = false
      this.editor.closeHint()
    }
  }

  getValue() {
    return this.editor.getValue();
  }

  setValue(value) {
    this.editor.setValue(value);
  }

  /**
   * 
   * @param { CodeMirror.EditorChange } value 
   */
  remoteEdit(value) {
    let cursor = editor.getCursor();
    editor.replaceRange(value.text, value.from, value.to);
    editor.setCursor(cursor);
  }
}

export default Editor;
