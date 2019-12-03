'use strict';

class Component {
  constructor(cfg) {
    this.config = cfg;
    if (!cfg.target) throw Error("Must have target property");
    this.target = cfg.target;
    this.comp = $(cfg.target);
    this.events = [];
  }

  addEvents() {
    this.events = [...this.events, ...arguments];
  }

  on(event, cb) {
    let exists = this.events.find(e => e === event);
    if (!exists) throw Error(`Event [${event}] is not registered`);
    $(this.target).on(event, cb);
  }

  trigger(event, data) {
    let exists = this.events.find(e => e === event);
    if (!exists) throw Error(`Event [${event}] is not registered`);
    $(this.target).trigger(event, data);
  }

  fire(event, data) {
    this.trigger(event, data);
  }

}

toastr.options = {
  positionClass: "toast-bottom-right"
};

class Monaco extends Component {
  constructor(cfg) {
    super(cfg);

    require.config({
      paths: {
        vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.18.0/min/vs"
      }
    });

    require(["vs/editor/editor.main"], function () {
      window.editor = monaco.editor.create(document.getElementById("editor"), {
        value: ["function x() {", '\tconsole.log("Hello world!");', "}"].join("\n"),
        language: "javascript",
        theme: "vs-dark"
      });
      window.result = monaco.editor.create(document.getElementById("result"), {
        language: "javascript",
        theme: "vs-dark",
        readOnly: true,
        minimap: {
          enabled: false
        }
      });
    });
  }

}

$(document).ready(() => {
  let editor = new Monaco({
    target: "editor"
  });
});

//# sourceMappingURL=index.js.map
