import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Box from '@mui/material/Box'; // Grid version 2
import Button from '@mui/material/Button'
import { useQuery, gql } from "@apollo/client";
import { withApollo } from '@apollo/react-hoc';    


function RateAnswers({ handleSubmit, client }) {
    const [prompt, setPrompt] = useState('...loading');
    const [promptId, setPromptId] = useState()
    const [answer1, setAnswer1] = useState('...loading');
    const [answer2, setAnswer2] = useState('...loading');
    const [answerIdContent, setAnswerIdContent] = useState(undefined)
    const [chosen, setChosen ] = useState(undefined);
    
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

         // now get all answers
 
         queryResult = await client.query({
             query: gql`
                 query {
                    answerAddeds(
                        where: {promptId: "${promptIdContainer.DAlign_id}"}
                    ) {
                        answerId
                        content
                    }
                 }
             `
         })

         let answers = [...queryResult.data.answerAddeds]
         if (answers.lenght < 2) {
            console.log("Error, must have two or more answers, pick another prompts")
            return false 
         }
         console.log(queryResult.data.answerAddeds,queryResult.data.answerAddeds.length)
         if (queryResult.data.answerAddeds.length > 2) {
            answers = answers.sort(() => Math.random() - 0.5).slice(0, 2);
         } 
         console.log(answers)
        
         setAnswerIdContent(answers)
         setAnswer1(answers[0].content)
         setAnswer2(answers[1].content)

         return true
        
    }

    const callGetData = async () => {
        while(true) {
            let res = await getData()
            if (res) {
                break
            }
        }

    }

    useEffect(() => {
       callGetData()
    }, [])    

    const handleSubmitLocal = () => {
        const task = "RateAnswers"
        if (chosen == 2) {
            console.error("not implemented")
        }
        console.log("answerIdContetn", answerIdContent, chosen, (((chosen + 1 % 2) + 2) % 2) )
        
        
        let content = {
            winner: answerIdContent[chosen].answerId,
            loser: answerIdContent[(((chosen + 1 % 2) + 2) % 2)].answerId, // proper modulo 2
            promptId: promptId
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
                label="Prompt"
                multiline
                variant="standard"
                value={prompt}
                //onChange={event => setPrompt(event.target.value)}
            />
            <Stack 
                direction="row"
                justifyContent="space-evenly"
                alignItems="center"
                spacing={0}
            >
                <Button
                    sx={{width: '100%'}}
                    onClick={event => setChosen(0)}
                >
                <TextField
                    sx={{width: "100%", height: "30vh"}}
                    id="standard-multiline-flexible"
                    label="Answer1"
                    multiline
                    variant="standard"
                    value={answer1}
                />
                </Button>
                <Button
                    onClick={event => setChosen(1)}
                    sx={{width: '100%'}}
                    >
                    <TextField
                        sx={{width: "100%", height: "30vh"}}
                        id="standard-multiline-flexible"
                        label="Answer2"
                        multiline
                        variant="standard"
                        value={answer2}
                    />
                </Button>
                <Button
                    sx={{width: '100%'}}
                    onClick={event => setChosen(2)}
                    >
                    <TextField
                        sx={{width: "100%", height: "30vh"}}
                        id="standard-multiline-flexible"
                        label="Optionally"
                        multiline
                        variant="standard"
                        value={"None of the answers"}
                    />
                </Button>
            </Stack>
            
            <Button onClick={handleSubmitLocal}>Submit {chosen}</Button>
        </Grid>
    )
}

export default withApollo(RateAnswers)
