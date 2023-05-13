import { useEffect, useState } from 'react'
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

const txServiceUrl = 'https://safe-transaction-gnosis-chain.safe.global/'

function App() {
  const [safeAuthSignInResponse, setSafeAuthSignInResponse] = useState(
    null
  )
  const [safeAuth, setSafeAuth] = useState()
  const [provider, setProvider] = useState(null)

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
    const provider = new ethers.providers.Web3Provider(safeAuth.getProvider());
    const signer = provider.getSigner();
    const safeAddress = safeAuthSignInResponse.safes[0]
    console.log("Safe address", safeAddress)
    const chainId = 100
    const gasLimit = '1000000'
    // get safe address

  }

  const [ start, setStart ] = useState(false)

  const startAligment = () => {
    setStart(true)
  }

  if (start) {
    return (
        <>
            <AppBar onLogin={login} onLogout={logout} isLoggedIn={!!provider} />
            <PromptAnswer handleSubmit={handleSubmit} />
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

export default App