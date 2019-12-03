import { Component } from "../core";
var HelloEditor;
class Monaco extends Component {
  constructor(cfg) {
    super(cfg);

    require.config({
      paths: { vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.18.0/min/vs" }
    });

    require(["vs/editor/editor.main"], function() {
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

export default Monaco;
