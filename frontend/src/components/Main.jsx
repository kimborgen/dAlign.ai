import { useEffect, useState, forwardRef} from 'react'
import {
  ADAPTER_EVENTS,
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
  WALLET_ADAPTERS
} from '@web3auth/base'
import { Box, Divider, Grid, Typography, Button } from '@mui/material'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { SafeAuthKit, Web3AuthModalPack } from '@safe-global/auth-kit';
import { Web3Auth, Web3AuthOptions } from '@web3auth/modal'
import { EthHashInfo } from '@safe-global/safe-react-components'
import AppBar from './AppBar'
import { ethers } from 'ethers'
import SafeApiKit from '@safe-global/api-kit'
import Safe, { EthersAdapter, getSafeContract, SafeFactory, SafeAccountConfig } from '@safe-global/protocol-kit'
import PromptAnswer from './PromptAnswer';
import { GelatoRelayPack } from '@safe-global/relay-kit'
import { MetaTransactionData, MetaTransactionOptions, OperationType } from '@safe-global/safe-core-sdk-types'
import { useQuery, gql } from "@apollo/client";
import { withApollo } from '@apollo/react-hoc';    
import Answer from './Answer'
import RateAnswers from './RateAnswers'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = forwardRef(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const txServiceUrl = 'https://safe-transaction-gnosis-chain.safe.global/'

function App({client}) {
  const [safeAuthSignInResponse, setSafeAuthSignInResponse] = useState(
    null
  )
  const [safeAuth, setSafeAuth] = useState()
  const [provider, setProvider] = useState(null)

  const [successOpen, setSuccessOpen] = useState(false);
  const handleSuccessClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSuccessOpen(false);
  };

  useEffect(() => {
    ;(async () => {
        // https://dashboard.web3auth.io/
        const WEB3_AUTH_CLIENT_ID="BDOrZFRYf9u7W2jM9Z8vcV96SQcjdwbBosasyit-DlXzt8ViSF9mdHJGEv_UfiBw0zyhaYEqFiX6Q1sizjbEFWk"
        // https://web3auth.io/docs/sdk/web/modal/initialize#arguments

        const options = {
            clientId: WEB3_AUTH_CLIENT_ID,
            web3AuthNetwork: 'testnet',
            chainConfig: {
                chainNamespace: CHAIN_NAMESPACES.EIP155,
                chainId: '0x64',
                // https://chainlist.org/
                rpcTarget: `https://rpc.gnosischain.com`
            },
            uiConfig: {
                theme: 'dark',
                loginMethodsOrder: ['google', 'facebook']
            }
        }

        // https://web3auth.io/docs/sdk/web/modal/initialize#configuring-adapters
        const modalConfig = {
        [WALLET_ADAPTERS.TORUS_EVM]: {
            label: 'torus',
            showOnModal: false
        },
        [WALLET_ADAPTERS.METAMASK]: {
            label: 'metamask',
            showOnDesktop: true,
            showOnMobile: false
        }
        }

        // https://web3auth.io/docs/sdk/web/modal/whitelabel#whitelabeling-while-modal-initialization
        const openloginAdapter = new OpenloginAdapter({
            loginSettings: {
                mfaLevel: 'mandatory'
            },
            adapterSettings: {
                uxMode: 'popup',
                whiteLabel: {
                name: 'Safe'
                }
            }
        })

        const adapter = new Web3AuthModalPack(options, [openloginAdapter], modalConfig)

        const s = await SafeAuthKit.init(adapter, {
            txServiceUrl: txServiceUrl
        })

        setSafeAuth(s)

        console.log("Sat safeaut", s)

    })()
  }, [])

  const login = async () => {
    if (!safeAuth) return
    console.log("GHET", safeAuth)
    const response = await safeAuth.signIn()
    console.log('SIGN IN RESPONSE: ', response)

    setSafeAuthSignInResponse(response)
    setProvider(safeAuth.getProvider())
  }

  const logout = async () => {
    if (!safeAuth) return

    await safeAuth.signOut()

    setProvider(null)
    setSafeAuthSignInResponse(null)
  }

//   const createSafe = async () => {
//     const provider = new ethers.providers.Web3Provider(safeAuth.getProvider());
//     const signer = provider.getSigner();

//     const ethAdapterOwner1 = new EthersAdapter({
//         ethers,
//         signerOrProvider: signer || provider
//     })

//     const safeService = new SafeApiKit({ txServiceUrl, ethAdapter: ethAdapterOwner1 })

//     // const safeSDK = await Safe.create({
//     //     ethAdapter,
//     //     safeAddress
//     //   })

//     const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapterOwner1 })

//     const safeAccountConfig = {
//         owners: [
//           await signer.getAddress()
//         ],
//         threshold: 1,
//         // ... (Optional params)
//       }
      
//       /* This Safe is tied to owner 1 because the factory was initialized with
//       an adapter that had owner 1 as the signer. */
//       console.log("Before deploying safe")
//       const safeSdkOwner1 = await safeFactory.deploySafe({ safeAccountConfig })

//       // Currently this results in: dex.ts:95     GET https://gas-api.metaswap.codefi.network/networks/100/suggestedGasFees 500
      
//       const safeAddress = await safeSdkOwner1.getAddress()
      
//       console.log('Your Safe has been deployed:', safeAddress)
//       console.log(`https://app.safe.global/gno:${safeAddress}`)

      
//   }


  const handleSubmit = async (task, content) => {
    console.log(task,content)
    console.log(task)
    console.log(content)
    const provider = new ethers.providers.Web3Provider(safeAuth.getProvider());
    const signer = provider.getSigner();
    const safeAddress = safeAuthSignInResponse.safes[0]

    const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: signer || provider
    })
      
    const safeSDK = await Safe.create({
        ethAdapter,
        safeAddress
    })
    
    console.log("signer", signer)
    console.log("Safe address", safeAddress)
    const chainId = 100
    const gasLimit = '1000000'
    // get safe address

    const dAlignContractAddress = "0xEd46eF4abfAD67b4466B8A23F6ACa528D19A84B0"
    const gelatoAPIKey = "aqNNWdaYEzL_Nn4L_WBcCbYyzzzY_j_rsg9PF4hOjew_"

    console.log("before ethers contract")
    const contract = new ethers.Contract(dAlignContractAddress, ABI, signer);
    console.log("after ethers contract")

    if (task == "RateAnswers") {
        const { data } = await contract.populateTransaction.rateAnswers(content.promptId, content.winner, content.loser);
        console.log("Transaction data: ", data)
        const safeTransactionData = {
            to: dAlignContractAddress,
            data: data,
            value: 0,
            operation: OperationType.Call
          }
        const options = {
            gasLimit,
            isSponsored: true
        }

        console.log("aaa")

        // const ethAdapter = new EthersAdapter({
        //     ethers,
        //     signerOrProvider: signer
        // })

        console.log("bbb")

        // const safeSDK = await Safe.create({
        //     ethAdapter,
        //     safeAddress
        // })

        console.log("ccc")

        const relayKit = new GelatoRelayPack(gelatoAPIKey)

        console.log("ddd")

        const safeTransaction = await safeSDK.createTransaction({ safeTransactionData })
        console.log("eee", safeTransaction)
        const signedSafeTx = await safeSDK.signTransaction(safeTransaction)
        console.log("fff", signedSafeTx)
        const safeSingletonContract = await getSafeContract({ ethAdapter, safeVersion: await safeSDK.getContractVersion() })
        console.log("ggg", safeSingletonContract)

        const encodedTx = safeSingletonContract.encode('execTransaction', [
            signedSafeTx.data.to,
            signedSafeTx.data.value,
            signedSafeTx.data.data,
            signedSafeTx.data.operation,
            signedSafeTx.data.safeTxGas,
            signedSafeTx.data.baseGas,
            signedSafeTx.data.gasPrice,
            signedSafeTx.data.gasToken,
            signedSafeTx.data.refundReceiver,
            signedSafeTx.encodedSignatures()
        ])
        console.log("hhh", encodedTx)

        const relayTransaction = {
            target: safeAddress,
            encodedTransaction: encodedTx,
            chainId,
            options
          }
          console.log("relayTrans", relayTransaction)
          const response = await relayKit.relayTransaction(relayTransaction)

          console.log("iii")
          
          console.log(`Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${response.taskId}`)

          setSuccessOpen(true)
    }

    

  }

  const nextTask = async () => {
    // You have 4 possible tasks, but I think we want to weigh ranking and evaluting quality

    // Generate an answer to a prompt

    


    // get all anwsers 

    // queryResult = await client.query({
    //     query: gql`
    //       query {
    //         answerAddeds(
    //             where: {promptId: "${prompt.DAlign_id}"}
    //         )
    //       }
    //     `,
    //   })


    
  }

  const [ start, setStart ] = useState(false)

  const startAligment = () => {
    setStart(true)
  }

  if (start) {
    return (
        <>
            <AppBar onLogin={login} onLogout={logout} isLoggedIn={!!provider} />
            <RateAnswers handleSubmit={handleSubmit} />
            <Snackbar open={successOpen} autoHideDuration={6000} onClose={handleSuccessClose}>
                <Alert onClose={handleSuccessClose} severity="success" sx={{ width: '100%' }}>
                    Success!
                </Alert>
            </Snackbar>
        </>

    )
  }

  return (
    <>
      <AppBar onLogin={login} onLogout={logout} isLoggedIn={!!provider} />
      {safeAuthSignInResponse?.eoa && (
        <Grid container>
          <Grid item md={4} p={4}>
            <Typography variant="h3" color="secondary" fontWeight={700}>
              Owner account
            </Typography>
            <Divider sx={{ my: 3 }} />
            <EthHashInfo
              address={safeAuthSignInResponse.eoa}
              showCopyButton
              showPrefix
              prefix={getPrefix('0x5')}
            />
          </Grid>
          <Grid item md={8} p={4}>
            <>
              <Typography variant="h3" color="secondary" fontWeight={700}>
                Available Safes
              </Typography>
              <Divider sx={{ my: 3 }} />
              {safeAuthSignInResponse?.safes?.length ? (
                safeAuthSignInResponse?.safes?.map((safe, index) => (
                  <Box sx={{ my: 3 }} key={index}>
                    <EthHashInfo address={safe} showCopyButton shortAddress={false} />
                    <Button onClick={startAligment}>Lets align!</Button>
                  </Box>
                ))
              ) : (
                <Typography variant="body1" color="secondary" fontWeight={700}>
                  No safe 
                </Typography>
              )}
            </>
          </Grid>
        </Grid>
      )}
    </>
  )
}

const getPrefix = (chainId) => {
  switch (chainId) {
    case '0x1':
      return 'eth'
    case '0x5':
      return 'gor'
    case '0x100':
      return 'gno'
    case '0x137':
      return 'matic'
    default:
      return 'eth'
  }
}

const ABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "x",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "y",
          "type": "uint256"
        }
      ],
      "name": "PRBMath_MulDiv18_Overflow",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "x",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "y",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "denominator",
          "type": "uint256"
        }
      ],
      "name": "PRBMath_MulDiv_Overflow",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "int256",
          "name": "x",
          "type": "int256"
        }
      ],
      "name": "PRBMath_SD59x18_Convert_Overflow",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "int256",
          "name": "x",
          "type": "int256"
        }
      ],
      "name": "PRBMath_SD59x18_Convert_Underflow",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "PRBMath_SD59x18_Div_InputTooSmall",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "SD59x18",
          "name": "x",
          "type": "int256"
        },
        {
          "internalType": "SD59x18",
          "name": "y",
          "type": "int256"
        }
      ],
      "name": "PRBMath_SD59x18_Div_Overflow",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "SD59x18",
          "name": "x",
          "type": "int256"
        }
      ],
      "name": "PRBMath_SD59x18_Exp2_InputTooBig",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "SD59x18",
          "name": "x",
          "type": "int256"
        }
      ],
      "name": "PRBMath_SD59x18_Log_InputTooSmall",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "PRBMath_SD59x18_Mul_InputTooSmall",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "SD59x18",
          "name": "x",
          "type": "int256"
        },
        {
          "internalType": "SD59x18",
          "name": "y",
          "type": "int256"
        }
      ],
      "name": "PRBMath_SD59x18_Mul_Overflow",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "promptId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "answerId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "content",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "submittedBy",
          "type": "address"
        }
      ],
      "name": "AnswerAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "promptId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "winningAnswerId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "losingAnswerId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "SD59x18",
          "name": "newWinnerElo",
          "type": "int256"
        },
        {
          "indexed": false,
          "internalType": "SD59x18",
          "name": "newLoserElo",
          "type": "int256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "submittedBy",
          "type": "address"
        }
      ],
      "name": "AnswersRated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "id",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "content",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "submittedBy",
          "type": "address"
        }
      ],
      "name": "PromptCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "promptId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newTotalQuality",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newNumberOfQualityVotes",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "submittedBy",
          "type": "address"
        }
      ],
      "name": "PromptQualityEvaluated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "promptId",
          "type": "bytes32"
        },
        {
          "internalType": "string",
          "name": "content",
          "type": "string"
        }
      ],
      "name": "addAnswer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "answers",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "id",
          "type": "bytes32"
        },
        {
          "internalType": "string",
          "name": "content",
          "type": "string"
        },
        {
          "internalType": "SD59x18",
          "name": "eloScore",
          "type": "int256"
        },
        {
          "internalType": "uint256",
          "name": "numberOfRatings",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "submittedBy",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "content",
          "type": "string"
        }
      ],
      "name": "createPrompt",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "promptId",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "quality",
          "type": "uint256"
        }
      ],
      "name": "evaluatePromptQuality",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "promptToAnswers",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "prompts",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "id",
          "type": "bytes32"
        },
        {
          "internalType": "string",
          "name": "content",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "totalQuality",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "numberOfQualityVotes",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "submittedBy",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "promptId",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "winnerId",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "loserId",
          "type": "bytes32"
        }
      ],
      "name": "rateAnswers",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]

export default withApollo(App)