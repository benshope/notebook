import React from "react";
import { Runtime, Inspector } from "@observablehq/runtime";
import { parseCell } from "@observablehq/parser";

import { Compiler } from "./observable_compiler";

const compile = new Compiler();

// import styled from 'styled-components';

function App() {
  const runtime = new Runtime();
  const observableRef = React.useRef();

  const [notebook, setNotebook] = React.useState([
    'd3 = require("d3-array")',
    "html`I am a text node.`",
    'DOM.text("I am a text node.")',
    // eslint-ignore-next-line
    'html`This is escaped: ${DOM.text("<i>Hello!</i>")}`',
    "html`<input type=range min=0 max=10 step=1>`",
  ]);

  // compile.module().then((define) => {
  //   const runtime = new Runtime();
  //   const define = await compile.notebook({nodes: notebook.map(cell => ({value: cell}))});
  //   const module = runtime.module(define, Inpsector.into(document.body));
  // });

  React.useEffect(() => {
    if (observableRef) {
      observableRef.current.innerHTML = "";
      compile
        .notebook({ nodes: notebook.map((cell) => ({ value: cell })) })
        .then((define) => {
          runtime.module(define, Inspector.into(observableRef.current));
        });
    }
  }, [observableRef, notebook]);

  return (
    <div className="App">
      <div ref={observableRef}></div>
      {notebook.map((cell, i) => (
        <textarea
          style={{ width: "100%", height: "80px" }}
          key={i}
          value={cell}
          onChange={(e) => {
            const notebookCopy = [...notebook];
            notebookCopy[i] = e.currentTarget.value;
            setNotebook(notebookCopy);
          }}
        />
      ))}
      <button onClick={() => setNotebook([...notebook, ""])}>Add Cell</button>
    </div>
  );
}

export default App;
