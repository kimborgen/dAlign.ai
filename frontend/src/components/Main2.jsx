import {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import PromptAnswer from './PromptAnswer';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Button from '@mui/material/Button'
//import MetaMaskSDK from '@metamask/sdk';
import { SafeAuthKit } from '@safe-global/auth-kit';
import { Web3AuthOptions } from '@web3auth/modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import {
  ADAPTER_EVENTS,
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
  WALLET_ADAPTERS
} from '@web3auth/base'

export default function Main() {

  
  //const MMSDK = new MetaMaskSDK();
  //const ethereum = MMSDK.getProvider(); // You can also access via window.ethereum
  
  const [account, setAccount] = useState('')
  const [safeAuthKit, setSafeAuthKit] = useState(undefined)

  const handleLogin = async () => {
    //const accounts = await ethereum.request({ method: 'eth_requestAccounts', params: [] })
    //console.log(accounts)
    //setAccount(accounts[0])
    await safeAuthKit.signIn();
  }

// https://dashboard.web3auth.io/
const WEB3_AUTH_CLIENT_ID="BDOrZFRYf9u7W2jM9Z8vcV96SQcjdwbBosasyit-DlXzt8ViSF9mdHJGEv_UfiBw0zyhaYEqFiX6Q1sizjbEFWk"

// https://web3auth.io/docs/sdk/web/modal/initialize#arguments
const options = {
  clientId: WEB3_AUTH_CLIENT_ID,
  web3AuthNetwork: 'testnet',
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: '0x5',
    // https://chainlist.org/
    rpcTarget: `https://rpc.ankr.com/eth_goerli`
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

const pack = new Web3AuthModalPack(options, [openloginAdapter], modalConfig)

useEffect(async () => {
  const s = await SafeAuthKit.init(pack, {
    txServiceUrl: 'https://safe-transaction-goerli.safe.global'
  })
  setSafeAuthKit(s)
});


  const queryApi = "https://api.studio.thegraph.com/query/46798/dalign/v0.0.1"
  
  if (account === '') {
    return (
      <Grid 
        sx={{ height:"100%", paddingLeft: "10vw", paddingRight: "10vw", paddingTop: "10vh"}}
        direction="column" 
        alignItems="center"
        justifyContent="center"
        backgroundColor="yellow" 
        spacing={1}> 
          <Button onClick={handleLogin}>Log in with metamask</Button> 
        </Grid>
    )
  }

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