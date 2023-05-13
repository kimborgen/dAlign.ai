import { useState } from 'react'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Box from '@mui/material/Box'; // Grid version 2
import Button from '@mui/material/Button'

export default function PromptAnswer({handleSubmit}) {
    const [prompt, setPrompt] = useState('');
    const [answer, setAnswer] = useState('');
    
    const handleButton = () => {
        handleSubmit("PromptAnswer", {
            prompt: prompt,
            answer: answer,
        })
    }
    
    return (
        <Grid 
            sx={{ height:"100%", paddingLeft: "10vw", paddingRight: "10vw", paddingTop: "10vh"}}
            direction="column" 
            alignItems="center"
            justifyContent="center"
            > 
            <TextField
                sx={{width: "100%", height:"30vh"}}
                id="standard-multiline-flexible"
                label="Create a unique prompt"
                multiline
                variant="standard"
                value={prompt}
                onChange={event => setPrompt(event.target.value)}
            />
            <TextField
                sx={{width: "100%", height: "30vh"}}
                id="standard-multiline-flexible"
                label="Create a helpfull and harmless answer"
                multiline
                variant="standard"
                value={answer}
                onChange={event => setAnswer(event.target.value)}
            />
            <Button onClick={handleButton}>Submit</Button>
        </Grid>
    )
}
