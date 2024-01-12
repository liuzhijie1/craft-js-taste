import { useNode, Editor, Element, Frame, useEditor } from "@craftjs/core";
import React from "react";

const Text = ({ text, fontSize }) => {
  const { connectors: { connect, drag }, isClicked, setProp } = useNode((node) => ({ isClicked: node.events.selected }));
  return <span contentEditable={isClicked} style={{ fontSize }} onKeyUp={(e) => {
    setProp(props => {
      props.text = e.target.innerText;
    })
  }}>
    {text}
  </span>
}

const TextToolbarSettings = () => {
  const { setProp, fontSize } = useNode((node) => ({
    fontSize: node.data.props.fontSize
  }))

  return (
    <div>
      <h2>Text settings</h2>
      <input
        type="number"
        value={fontSize}
        placeholder="Font size"
        onChange={e => setProp(prop => prop.fontSize = e.target.value)}
      />
    </div>
  )
}

const Toolbar = () => {
  const { selectededNodeId, toolbarSettings } = useEditor((state) => ({
    selectededNodeId: state.event.selected,
    toolbarSettings: state.nodes[state.events.selected].related.toolbar
  }))
  return (
    <div>
      <h2>My Awesome Toolbar</h2>
      {
        selectededNodeId && toolbarSettings ? React.createElement(toolbarSettings) : null
      }
    </div>
  )
}

const Hero = ({ background }) => {
  return (
    <div style={{ background }}>
      <Element is={Text} text="Hero Title" id="title_text" />
      <Element canvas is="section" id="droppable_container">
        <h2>I'm dropped here for now</h2>
      </Element>
    </div>
  )
}

Text.craft = {
  props: {
    text: "Hi there!",
    fontSize: 12
  },
  rules: {
    canDrop: () => true,
    canDrag: (node) => !!node.data.props.text === 'Drag',
    canMoveIn: () => true,
    canMoveOut: () => true
  },
  related: {
    toolbar: TextToolbarSettings
  }
}

const Container = ({ children }) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={dom => connect(drag(dom))} style={{ border: "1px solid red" }}>
      {children}
    </div>
  )
}


function App() {
  return (
    <Editor resolver={{ Container }}>
      <Frame>
        <Element is={Container} canvas>
          <h1>111</h1>
          <Container>
            <h2>Hi1</h2>
          </Container>
          <Element is={Container} canvas>
            <h2>Hi2</h2>
          </Element>
        </Element>
      </Frame>
    </Editor>
  );
}

export default App;
