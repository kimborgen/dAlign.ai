import * as React from 'react';
import Box from '@mui/material/Box';
import PromptAnswer from './PromptAnswer';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

export default function Main() {
    return (
      <Grid 
        sx={{ height:"100%", paddingLeft: "10vw", paddingRight: "10vw", paddingTop: "10vh"}}
        direction="column" 
        alignItems="center"
        justifyContent="center"
        backgroundColor="yellow" 
        spacing={1}> 
        <PromptAnswer />
      </Grid>
    );
  }