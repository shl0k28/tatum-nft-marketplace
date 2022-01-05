import { useEffect, useState } from 'react'
import { formatJsonRpcRequest } from '@json-rpc-tools/utils'
import QRCodeModal from 'algorand-walletconnect-qrcode-modal'
import algosdk from 'algosdk'
import WalletConnect from '@walletconnect/client'

const useAlgorand = () => {
    const connector = new WalletConnect({
        bridge: 'https://bridge.walletconnect.org',
        qrcodeModal: QRCodeModal
    })
    const [ accounts, setAccounts ] = useState<Array<string>>([])
    
    useEffect(() => {
        if(connector.connected){
            const connectedAccounts = connector.accounts
            setAccounts(connectedAccounts)
        }
    }, [])

    useEffect(() => {
        connector.on('connect', (err, payload) => {
            if(err) throw new Error(JSON.stringify(err))
            console.log(payload.params[0])
            setAccounts(payload.params[0].accounts)
        })
    })


    const connectAlgoWallet = async () => {
        if(!connector.connected){
            await connector.createSession()
        }
    }

    const disconnect = async () => {
        if(connector.connected){
            await connector.killSession()
        }
    }

    return {
        accounts,
        connectAlgoWallet,
        disconnect
    }
}

export { useAlgorand }