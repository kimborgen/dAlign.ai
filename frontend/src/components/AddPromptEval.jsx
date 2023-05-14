import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Box from '@mui/material/Box'; // Grid version 2
import Button from '@mui/material/Button'
import { useQuery, gql } from "@apollo/client";
import { withApollo } from '@apollo/react-hoc';    
import Rating from '@mui/material/Rating';


function AddPromptEval({ handleSubmit, client }) {
    const [prompt, setPrompt] = useState('...loading');
    const [promptId, setPromptId] = useState()
    const [ rating, setRating ] = useState()
    
    const getData = async () => {
         // First get all prompts
         console.log("Cl;iten ", client)
         let queryResult = await client.query({
             query: gql`
                 query {
                     promptCreateds {
                         DAlign_id
                         content
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
         setPrompt(promptIdContainer.content)
         setPromptId(promptIdContainer.DAlign_id)

         return true
        
    }

    // const callGetData = async () => {
    //     while(true) {
    //         let res = await getData()
    //         if (res) {
    //             break
    //         }
    //     }
    // }

    useEffect(() => {
       getData()
    }, [])    

    const handleSubmitLocal = () => {
        console.log("Rating", rating)
        const task = "AddPromptEval"        
        let content = {
            promptId: promptId,
            rating: rating - 1
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
                sx={{width: "100%", height:"20vh"}}
                id="standard-multiline-flexible"
                label="Prompt"
                multiline
                variant="standard"
                value={prompt}
                //onChange={event => setPrompt(event.target.value)}
            />
           
           <Rating
                sx={{width:"100%", justifySelf:"center", alignSelf:"center", height: "10vh"}}
                name="simple-controlled"
                value={rating}
                onChange={(event, newValue) => {
                setRating(newValue);
            }}
        />
            
            <Button onClick={handleSubmitLocal} disabled={rating==undefined}>Submit</Button>
        </Grid>
    )
}

export default withApollo(AddPromptEval)
