import { useNode, Editor, Element, Frame, useEditor } from "@craftjs/core";
import React, { useEffect, useState } from "react";
import ContentEditable from 'react-contenteditable'
import { Button as MaterialButton, Paper, Box, Typography, Grid, Chip, FormControl, FormLabel, Slider, Switch, FormControlLabel, RadioGroup, Radio } from "@material-ui/core";
import ColorPicker from "material-ui-color-picker";

const Text = ({ text, fontSize, textAlign }) => {
  const { connectors: { connect, drag }, actions: { setProp }, hasSelectedNode, hasDraggedNode } = useNode((state) => ({
    hasSelectedNode: state.events.selected,
    hasDraggedNode: state.events.dragged,
    isActive: state.events.selected
  }));

  const [editable, setEditable] = useState(false);

  useEffect(() => {
    !hasSelectedNode && setEditable(false)
  }, [hasSelectedNode])

  return (
    <div ref={ref => connect(drag(ref))} onClick={e => setEditable(true)}>
      {/* <p style={{ fontSize }}>{text}</p> */}
      <ContentEditable
        html={text}
        onChange={e => setProp(prop => prop.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, ""))}
        tagName="p"
        style={{ fontSize: `${fontSize}px`, textAlign }}
        disabled={!editable}
      />
      {/* {
        hasSelectedNode && (
          <FormControl className="text-additional-setting" size="small">
            <FormLabel component="legend">Font size</FormLabel>
            <Slider
              defaultValue={fontSize}
              step={1}
              min={7}
              max={50}
              valueLabelDisplay="auto"
              onChange={(_, value) => {
                setProp(props => props.fontSize = value)
              }}
            />
          </FormControl>
        )
      } */}
    </div>
  )
}

const Button = ({ size, variant, color, children, text, ...props }) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <MaterialButton ref={ref => connect(drag(ref))} size={size} variant={variant} color={color} {...props}>
      {text}
    </MaterialButton>
  )
}

const ButtonSettings = () => {
  const { actions: { setProp }, props } = useNode(state => ({
    props: state.data.props
  }));

  return (
    <div>
      <FormControl size="small" component="fieldset">
        <FormLabel component="legend">Size</FormLabel>
        <RadioGroup defaultValue={props.size} onChange={e => setProp(props => props.size = e.target.value)}>
          <FormControlLabel label="Small" value="small" control={<Radio size="small" color="primary" />} />
          <FormControlLabel label="Medium" value="medium" control={<Radio size="small" color="primary" />} />
          <FormControlLabel label="Large" value="large" control={<Radio size="small" color="primary" />} />
        </RadioGroup>
      </FormControl>
      <FormControl component="fieldset">
        <FormLabel component="legend">Variant</FormLabel>
        <RadioGroup defaultValue={props.variant} onChange={e => setProp(props => props.variant = e.target.value)}>
          <FormControlLabel label="Text" value="text" control={<Radio size="small" color="primary" />} />
          <FormControlLabel label="Outlined" value="outlined" control={<Radio size="small" color="primary" />} />
          <FormControlLabel label="Contained" value="contained" control={<Radio size="small" color="primary" />} />
        </RadioGroup>
      </FormControl>
      <FormControl component="fieldset">
        <FormLabel component="legend">Color</FormLabel>
        <RadioGroup defaultValue={props.color} onChange={e => setProp(props => props.color = e.target.value)}>
          <FormControlLabel label="Default" value="default" control={<Radio size="small" color="default" />} />
          <FormControlLabel label="Primary" value="primary" control={<Radio size="small" color="primary" />} />
          <FormControlLabel label="Secondary" value="secondary" control={<Radio size="small" color="primary" />} />
        </RadioGroup>
      </FormControl>
    </div>
  )
}

Button.craft = {
  props: {
    size: 'small',
    variant: 'contained',
    color: 'primary',
    text: 'Click me'
  },
  related: {
    settings: ButtonSettings
  }
}

const ContainerSettings = () => {
  const { background, padding, actions: { setProp } } = useNode(state => ({
    background: state.data.props.background,
    padding: state.data.props.padding
  }))

  return (
    <div>
      <FormControl fullWidth={true} margin="normal" component="fieldset">
        <FormLabel component="legend">Background</FormLabel>
        <ColorPicker defaultValue={background || '#000'} value={background} onChange={color => {
          setProp(props => props.background = color, 500)
        }} />
        <FormControl fullWidth={true} margin="normal" component="fieldset">
          <FormLabel component="legend">Padding</FormLabel>
          <Slider defaultValue={padding} onChange={(_, value) => setProp(props => props.padding = value)} />
        </FormControl>
      </FormControl>
    </div>
  )
}

const Container = ({ background, padding = 0, children }) => {
  const { connectors: { connect, drag } } = useNode()
  return (
    <Paper ref={ref => connect(drag(ref))} style={{ margin: "5px 0", background, padding: `${padding}px` }}>
      {children}
    </Paper>
  )
}

Container.craft = {
  props: {
    background: '#ffffff',
    padding: 3
  },
  related: {
    settings: ContainerSettings
  }
}

const CardTop = ({ children }) => {
  const { connectors: { connect } } = useNode();
  return (
    <div ref={connect} className="text-only">
      {children}
    </div>
  )
}

CardTop.craft = {
  rules: {
    // Only accept Text
    canMoveIn: (incomingNodes) => incomingNodes.every(incomingNode => incomingNode.data.type === Text)
  }
}

const CardBottom = ({ children }) => {
  const { connectors: { connect } } = useNode();
  return (
    <div ref={connect}>
      {children}
    </div>
  )
}

CardBottom.craft = {
  rules: {
    canMoveIn: (incomingNodes) => incomingNodes.every(incomingNode => incomingNode.data.type === Button)
  }
}

const Card = ({ background, padding = 20 }) => {
  return (
    <Container background={background} padding={padding}>
      <Element id="text" canvas is={CardTop}>
        {/* <div className="text-only"> */}
        <Text text="Title" fontSize={20} />
        <Text text="Subtitle" fontSize={15} />
        {/* </div> */}
      </Element>
      <Element id="button" canvas is={CardBottom}>
        {/* <div className="buttons-only"> */}
        <Button size="small" text="Learn more" variant={"contained"} color={"primary"}>Leran more</Button>
        {/* </div> */}
      </Element>
    </Container>
  )
}

Card.craft = {
  props: {
    background: '#ffffff',
    padding: 3
  },
  related: {
    settings: ContainerSettings
  }
}

const Toolbox = () => {
  const { connectors, query } = useEditor();

  return (
    <Box px={2} py={2}>
      <Grid container direction="column" alignItems="center" justify="center" spacing={1}>
        <Box pb={2}>
          <Typography>Drag to add</Typography>
        </Box>
        <Grid container direction="column" item>
          <MaterialButton ref={ref => connectors.create(ref, <Button text="Click me" size={'small'} />)} variant="contained">Button</MaterialButton>
        </Grid>
        <Grid container direction="column" item>
          <MaterialButton ref={ref => connectors.create(ref, <Text text="Hi word" />)} variant="contained">Text</MaterialButton>
        </Grid>
        <Grid container direction="column" item>
          <MaterialButton ref={ref => connectors.create(ref, <Element is={Container} padding={20} canvas />)} variant="contained">Container</MaterialButton>
        </Grid>
        <Grid container direction="column" item>
          <MaterialButton ref={ref => connectors.create(ref, <Card />)} variant="contained">Card</MaterialButton>
        </Grid>
      </Grid>
    </Box>
  )
}

const SettingsPanel = () => {
  const { selected, actions } = useEditor((state, query) => {
    const [currentNodeId] = state.events.selected;
    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        settings: state.nodes[currentNodeId].related && state.nodes[currentNodeId].related.settings,
        isDeletable: query.node(currentNodeId).isDeletable()
      }
    }

    return {
      selected
    }
  })

  return (
    selected ? <Box bgcolor="rgba(0, 0, 0, 0.06)" mt={2} px={2} py={2}>
      <Grid container direction="column" spacing={0}>
        <Grid item>
          <Box pb={2}>
            <Grid container alignItems="center">
              <Grid item xs><Typography variant="subtitle1">Selected</Typography></Grid>
              <Grid item><Chip size="small" color="primary" label={selected.name} /></Grid>
            </Grid>
          </Box>
        </Grid>
        {
          selected.settings && React.createElement(selected.settings)
        }
        {/* <FormControl size="small" component="fieldset">
          <FormLabel component="legend">Prop</FormLabel>
          <Slider
            defaultValue={0}
            step={1}
            min={7}
            max={50}
            valueLabelDisplay="auto"
          />
        </FormControl> */}
        {
          selected.isDeletable ? (
            <MaterialButton
              variant="contained"
              color="default"
              onClick={() => {
                actions.delete(selected.id)
              }}
            >
              Delete
            </MaterialButton>
          ) : null
        }
      </Grid>
    </Box> : null
  )
}

const Topbar = () => {
  const { actions, query, enabled } = useEditor((state) => ({
    enabled: state.options.enabled
  }))

  return (
    <Box px={1} py={1} mt={3} mb={1} bgcolor="#cbe8e7">
      <Grid container alignItems="center">
        <Grid item xs>
          <FormControlLabel
            control={<Switch checked={enabled} onChange={(_, value) => actions.setOptions(options => options.enabled = value)} />}
            label="Enable"
          />
        </Grid>
        <Grid item>
          <MaterialButton size="small" variant="outlined" color="secondary" onClick={() => {
            console.log(query.serialize())
          }}>Serialize JSON to console</MaterialButton>
        </Grid>
      </Grid>
    </Box>
  )
};

const TextSettings = () => {
  const { actions: { setProp }, fontSize } = useNode(state => ({
    fontSize: state.data.props.fontSize
  }))

  return (
    <>
      <FormControl size="small" component="fieldset">
        <FormLabel component="legend">Font size</FormLabel>
        <Slider
          value={fontSize || 7}
          step={7}
          min={1}
          max={50}
          onChange={(_, value) => {
            setProp(props => props.fontSize = value)
          }}
        />
      </FormControl>
    </>
  )
}

Text.craft = {
  props: {
    text: "Hi",
    fontSize: 20
  },
  rules: {
    // canDrop: () => true,
    canDrag: (node) => node.data.props.text !== 'Drag',
    // canMoveIn: () => true,
    // canMoveOut: () => true
  },
  related: {
    settings: TextSettings
  }
}



function BasicGuide() {
  return (
    <div style={{ margin: "0 auto", width: "800px" }}>
      <Typography variant="h5" align="center">A super simple page editor</Typography>
      <Editor resolver={{ Card, Button, Text, Container, CardTop, CardBottom }}>
        <Grid container spacing={3} style={{ paddingTop: "10px" }}>
          <Topbar />
          <Grid item xs>
            <Frame>
              <Element is={Container} padding={5} background={'#eee'} canvas>
                {/* <Container padding={5} background="#eee"> */}
                <Card />
                <Button size="small" variant="outlined">Click Me</Button>
                <Text size="small" text="Hi world!" />
                <Element is={Container} padding={2} background={'#999'} canvas>
                  {/* <Container padding={6} background="#999"> */}
                  <Text size="small" text="It's me again!" />
                  {/* </Container> */}
                </Element>
                {/* </Container> */}
              </Element>
            </Frame>
          </Grid>
          <Grid item xs={3}>
            <Paper>
              <Toolbox />
              <SettingsPanel />
            </Paper>
          </Grid>
        </Grid>
      </Editor>
    </div>
  );
}

export default BasicGuide;
