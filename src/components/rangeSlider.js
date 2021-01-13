import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';


const useStyles = makeStyles({
  root: {
    width: 300,
  },
});
const PrettoSlider = withStyles({
    root: {
      color: '#52af77',
      height: 8,
    },
    thumb: {
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      marginTop: -8,
      marginLeft: -12,
      '&:focus, &:hover, &$active': {
        boxShadow: 'inherit',
      },
    },
    active: {},
    valueLabel: {
      left: 'calc(-50% + 4px)',
    },
    track: {
      height: 8,
      borderRadius: 4,
    },
    rail: {
      height: 8,
      borderRadius: 4,
    },
  })(Slider);


// Props = start, end, type (bpm, popularity, etc.), min, max, step
export function RangeSlider(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState([props.start, props.end]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    props.sendData(newValue, props.type);

  };

  return (
    <div className={classes.root}>
      <Typography id="range-slider" gutterBottom>
        {props.type == "Tempo"? props.type + ' (BPM)' : props.type} Range
      </Typography>
      <PrettoSlider
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider" 
        min={props.min}
        max={props.max}
        step={props.step}
      />
    </div>
  );
}
