import CodeMirror from 'codemirror';
import EventEmitter from 'events'

let editor;

class Editor extends EventEmitter {
  constructor() {
    super();
    editor = this.editor = CodeMirror(document.body, {
      mode: 'javascript',
      lineNumbers: true,
      theme: 'material-darker'
    });

    this.editor.on('change', (_inst, change) => this.emit('change', change));
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
