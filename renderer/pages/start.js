'use strict'

import Head from 'next/head'

const sjcl = require('sjcl')
const { dialog } = require('electron')
const bitcoin = require('bitcoinjs-lib')
const Promise = require('bluebird')

const moreEntropy = Promise.promisifyAll(require('more-entropy'))

const getEntropy = () => {
  let generator = new moreEntropy.Generator()
  return generator.generateAsync(192)
  .catch(function (response) {
    // The generate library always returns a success as an failure
    return response
  })
}

function generateKey() {
  const password = document.getElementById('password').value
  document.getElementById('password').value = ''
  return getEntropy()
  .then((entropy) => {
    const master = bitcoin.HDNode.fromSeedBuffer(Buffer.from(entropy))
    let privateKey = master.toBase58()
    let publicKey = master.neutered().toBase58()
    let encryptedPrivateKey = sjcl.encrypt(password, privateKey)
    alert(publicKey)
  })
}

function createWallet() {
  const cosignerOneXpub = document.getElementById('cosignerOneXpub').value
  const cosignerTwoXpub = document.getElementById('cosignerTwoXpub').value
  const cosignerThreeXpub = document.getElementById('cosignerThreeXpub').value
  const test = bitcoin.address.fromBase58Check(cosignerOneXpub)
      alert(test)
  return
  const pubKeys = [cosignerOneXpub, cosignerTwoXpub, cosignerThreeXpub]//.map((hex) => {return Buffer.from(hex, 'hex') })

  const witnessScript = bitcoin.script.multisig.output.encode(2, pubKeys)
  const scriptPubKey = bitcoin.script.witnessScriptHash.output.encode(bitcoin.crypto.sha256(witnessScript))
  const address = bitcoin.address.fromOutputScript(scriptPubKey)
  alert(address)
}

export default () => (
  <div>
    <Head>
      <scripts type="text/javascript" src="./static/ledger.min.js"></scripts>
    </Head>
    <span>Welcome to the token standards vault</span>
    <h2>Generate Key</h2>
    <input id="password" type="password" placeholder='Enter password'></input>
    <button onClick={generateKey}>Create</button>
    <h2>Create Wallet</h2>
    <input id="cosignerOneXpub" type="text" placeholder='Enter xpub for cosigner one'></input>
    <input id="cosignerTwoXpub" type="text" placeholder='Enter xpub for cosigner two'></input>
    <input id="cosignerThreeXpub" type="text" placeholder='Enter xpub for cosigner three'></input>
    <button onClick={createWallet}>Create Wallet</button>
  </div>
)
