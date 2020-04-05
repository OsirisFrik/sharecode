import * as monaco from 'monaco-editor';
import EventEmitter from 'events';

self.MonacoEnvironment = {
  baseUrl: 'src',
  getWorkerUrl: function (_moduleId, label) {
    if (label === 'json') {
      return './src/json.worker.bundle.js';
    }
    if (label === 'css') {
      return './src/css.worker.bundle.js';
    }
    if (label === 'html') {
      return './src/html.worker.bundle.js';
    }
    if (label === 'typescript' || label === 'javascript') {
      return './src/ts.worker.bundle.js';
    }
    return './src/editor.worker.bundle.js';
  }
};

let editor;

class Editor extends EventEmitter {
  constructor() {
    super();

    editor = this.editor = monaco.editor.create(document.getElementById('editor'), {
      language: 'javascript',
      theme: 'vs-dark'
    });

    this.user = true;

    this.editor.onKeyUp(() => this.user = true);
    this.editor.onDidChangeModelContent((e) => this._update(e.changes[0]));

    if (process.env.NODE_ENV === 'development') window.$editor = editor;
  }
  
  _update(e) {
    if (this.user) this.emit('change', e);
  }

  getValue() {
    return this.editor.getValue();
  }

  /**
   * @method setValue
   * @param { monaco.editor.IIdentifiedSingleEditOperation } value 
   */

  setValue(value) {
    value.range.endColumn = value.range.startColumn;
    value.forceMoveMarkers = true;
    this.user = false;

    if (value.text === '') {
      value.range.endColumn += 1;
      for (let i = 0; i < value.rangeLength; i++) {
        this.editor.executeEdits('remote', [value]);
      }
    } else {
      this.editor.executeEdits('remote', [value]);
      this.editor.setSelection({ ...value.range });
    }
  }
}

export default Editor;
