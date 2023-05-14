import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Box from '@mui/material/Box'; // Grid version 2
import Button from '@mui/material/Button'
import { useQuery, gql } from "@apollo/client";
import { withApollo } from '@apollo/react-hoc';    


function Answer({ handleSubmit, client }) {
    const [prompt, setPrompt] = useState('loading');
    const [answer, setAnswer] = useState('');
    
    const getData = async () => {
         // First get all prompts
         console.log("Cl;iten ", client)
         let queryResult = await client.query({
             query: gql`
                 query {
                     promptCreateds {
                         DAlign_id
                     }
                 }
             `,
         })
         console.log(queryResult.data)
         let allPrompts = queryResult.data.promptCreateds
         console.log(allPrompts)
         const randomIndex = Math.floor(Math.random() * allPrompts.length);
         let promptIdContainer = allPrompts[randomIndex]
         console.log(promptIdContainer.DAlign_id)
 
         queryResult = await client.query({
             query: gql`
                 query {
                     promptCreateds(where: {DAlign_id: "${promptIdContainer.DAlign_id}"}) {
                         content
                         DAlign_id
                     }
                 }
             `
         })
 
         console.log(queryResult)
         let prompt = queryResult.data.promptCreateds[0].content
         setPrompt(prompt)
    }

    useEffect(() => {
       getData()
    }, [])
    
    
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
                label="Prompt"
                multiline
                variant="standard"
                value={prompt}
                //onChange={event => setPrompt(event.target.value)}
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
            <Button onClick={handleSubmit}>Submit</Button>
        </Grid>
    )
}

export default withApollo(Answer)
