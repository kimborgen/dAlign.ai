import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Box from '@mui/material/Box'; // Grid version 2
import Button from '@mui/material/Button'
import { useQuery, gql } from "@apollo/client";
import { withApollo } from '@apollo/react-hoc';    


function AddPrompt({ handleSubmit, client }) {
    const [ prompt, setPrompt] = useState('');
    //const [ answer, setAnswer ] = useState(' ')


    const handleSubmitLocal = () => {
        const task = "AddPrompt"        
        let content = {
            prompt: prompt,
        
        }
        handleSubmit(task,content)
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
                label="Create a unique and tought-provoking prompt"
                multiline
                variant="standard"
                value={prompt}
                onChange={event => setPrompt(event.target.value)}
            />
            
            <Button onClick={handleSubmitLocal}>Submit</Button>
        </Grid>
    )
}

export default withApollo(AddPrompt)
