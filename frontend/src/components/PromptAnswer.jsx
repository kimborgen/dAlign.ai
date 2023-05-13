import { useState } from 'react'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Box from '@mui/material/Box'; // Grid version 2



export default function PromptAnswer() {
    const [prompt, setPrompt] = useState('');
    const [answer, setAnswer] = useState('');

    return (
        <Grid 
            sx={{ height:"100%", paddingLeft: "10vw", paddingRight: "10vw", paddingTop: "10vh"}}
            direction="column" 
            alignItems="center"
            justifyContent="center"
            backgroundColor="yellow" 
            > 
            <TextField
            sx={{width: "100%", height:"40vh"}}
            id="standard-multiline-flexible"
            label="Create a unique prompt"
            multiline
            variant="standard"
            value={prompt}
                onChange={event => {
                    setPrompt(event.target.value);
                }}
            />
            <TextField
            sx={{width: "100%", height: "40vh"}}
            id="standard-multiline-flexible"
            label="Create a helpfull and harmless answer"
            multiline
            variant="standard"
            value={answer}
                onChange={event => {
                    setAnswer(event.target.value);
                }}
            />
        </Grid>
    )
}