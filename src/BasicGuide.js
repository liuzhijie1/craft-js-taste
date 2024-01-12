import { useNode, Editor, Element, Frame, useEditor } from "@craftjs/core";
import React from "react";
import { Button as MaterialButton, Paper, Box, Typography, Grid, Chip, FormControl, FormLabel, Slider, Switch, FormControlLabel } from "@material-ui/core";

const Text = ({ text, fontSize }) => {
  return (
    <div>
      <p style={{ fontSize }}>{text}</p>
    </div>
  )
}

const Button = ({ size, variant, color, children }) => {
  return (
    <MaterialButton size={size} variant={variant} color={color}>
      {children}
    </MaterialButton>
  )
}

const Container = ({ background, padding = 0, children }) => {
  return (
    <Paper style={{ margin: "5px 0", background, padding: `${padding}px` }}>
      {children}
    </Paper>
  )
}

const Card = ({ background, padding = 20 }) => {
  return (
    <Container background={background} padding={padding}>
      <div className="text-only">
        <Text text="Title" fontSize={20} />
        <Text text="Subtitle" fontSize={15} />
      </div>
      <div className="buttons-only">
        <Button size="small" text="Learn more" variant={"contained"} color={"primary"}>Leran more</Button>
      </div>
    </Container>
  )
}

const Toolbox = () => {
  return (
    <Box px={2} py={2}>
      <Grid container direction="column" alignItems="center" justify="center" spacing={1}>
        <Box pb={2}>
          <Typography>Drag to add</Typography>
        </Box>
        <Grid container direction="column" item>
          <MaterialButton variant="contained">Button</MaterialButton>
        </Grid>
        <Grid container direction="column" item>
          <MaterialButton variant="contained">Text</MaterialButton>
        </Grid>
        <Grid container direction="column" item>
          <MaterialButton variant="contained">Container</MaterialButton>
        </Grid>
        <Grid container direction="column" item>
          <MaterialButton variant="contained">Card</MaterialButton>
        </Grid>
      </Grid>
    </Box>
  )
}

const SettingsPanel = () => {
  return (
    <Box bgcolor="rgba(0, 0, 0, 0.06)" mt={2} px={2} py={2}>
      <Grid container direction="column" spacing={0}>
        <Grid item>
          <Box pb={2}>
            <Grid container alignItems="center">
              <Grid item xs><Typography variant="subtitle1">Selected</Typography></Grid>
              <Grid item><Chip size="small" color="primary" label="Selected" /></Grid>
            </Grid>
          </Box>
        </Grid>
        <FormControl size="small" component="fieldset">
          <FormLabel component="legend">Prop</FormLabel>
          <Slider
            defaultValue={0}
            step={1}
            min={7}
            max={50}
            valueLabelDisplay="auto"
          />
        </FormControl>
        <MaterialButton
          variant="contained"
          color="default"
        >
          Delete
        </MaterialButton>
      </Grid>
    </Box>
  )
}

const Topbar = () => {
  return (
    <Box px={1} py={1} mt={3} mb={1} bgcolor="#cbe8e7">
      <Grid container alignItems="center">
        <Grid item xs>
          <FormControlLabel
            control={<Switch checked={true} />}
            label="Enable"
          />
        </Grid>
        <Grid item>
          <MaterialButton size="small" variant="outlined" color="secondary">Serialize JSON to console</MaterialButton>
        </Grid>
      </Grid>
    </Box>
  )
};

// Text.craft = {
//   props: {
//     text: "Hi there!",
//     fontSize: 12
//   },
//   rules: {
//     canDrop: () => true,
//     canDrag: (node) => !!node.data.props.text === 'Drag',
//     canMoveIn: () => true,
//     canMoveOut: () => true
//   },
//   related: {

//   }
// }



function BasicGuide() {
  return (
    <div style={{ margin: "0 auto", width: "800px" }}>
      <Typography variant="h5" align="center">A super simple page editor</Typography>
      <Grid container spacing={3} style={{ paddingTop: "10px" }}>
        <Topbar />
        <Grid item xs>
          <Container padding={5} background="#eee">
            <Card />
          </Container>
        </Grid>
        <Grid item xs={3}>
          <Paper>
            <Toolbox />
            <SettingsPanel />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default BasicGuide;
