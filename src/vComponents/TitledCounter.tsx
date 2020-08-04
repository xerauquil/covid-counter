import React from 'react';
import { Grid, Theme, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';



interface TitledCounterProps {
  value: number;
  title: string;
  classes?: Record<'value' | 'label' | 'container', string>; // used to extend the given underlying component's className
  className?: string; // used to overwrite the container className.
  color?: string; // set color of the component
}

const useStyles = makeStyles<Theme, {color: string | undefined}>({
  root: ({ color }) => ({
    color,
    '& *': {
      fontFamily: 'Noto Sans, Roboto'
    },
  }),
  block: {
    display: 'block'
  }
});


// allow MUI to set this component's styles via TitledCounterProps.style
const TitledCounter: React.FC<TitledCounterProps> = ({ value, title, color = 'inherit', classes, className  }) => {
  const { root: containerClass  } = useStyles({ color });

  return (
    <Grid
      container
      direction='row'
      alignItems='center'
      justify='center'
      spacing={0}
      className={
        classnames(
          [
            { // if className isn't defined use default classes
              [containerClass]: !className
            },
            className,
            classes?.container
          ]
        )
      }
    >
      <Grid item xs={12}>
        <Typography className={classes?.value} align="center" component="div" variant="h2">
          {
            value
              .toLocaleString('en-US')
              .replace(/,/g, ' ')
          }
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography className={classes?.label} align="center" component="h2" variant="h2">
          {title}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default TitledCounter;

