import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl'
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'react-bootstrap/Image';

import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const ETHAPIURL = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2";
const BSCAPIURL = "https://api.thegraph.com/subgraphs/name/mmontes11/pancakeswap";
const MATICAPIURL = "https://api.thegraph.com/subgraphs/name/sameepsi/quickswap";

const tokensQuery = `
  query {
    pairs(orderDirection: desc,first: 500) {
   id,
   token0 {
     id,
     symbol,
     name,
   decimals
   },
   token1 {
     id,
     symbol,
     name,
   decimals
   }
 }
  }
`

const { ParaSwap } = require('paraswap');

const NETWORK = {
  ETHEREUM :1,
  POLYGON : 137,
  BINANCE : 56
}

function App() {
  const [network, setNetwork] = useState(NETWORK.ETHEREUM);
  const [paraSwap, setParaSwap] = useState(new ParaSwap(network));
  const [tokenPair, settokenPair] = useState([]);
  const [ethereumbuttom, setethereumbuttom] = useState(false);
  const [bscbuttom, setbscbuttom] = useState(false);
  const [polygonbuttom, setpolygonbuttom] = useState(false);
  const [uri, setUri] = useState(ETHAPIURL);
  var result=[];
  Array.prototype.pairs = function (func) {
    for (var i = 0; i < this.length - 1; i++) {
        for (var j = i; j < this.length - 1; j++) {
            func([this[i], this[j+1]]);
        }
    }
}

async function getTokens() {
  return paraSwap.getTokens();
}

async function run() {
  let result = [];
  const tokens = await getTokens();
  // console.log('tokens', tokens);
  tokens.pairs(function(pair){
    if(!result.includes(pair))
    result.push(pair)
});
console.log(result);
settokenPair(result)
}

useEffect(() => {
  // Runs ONCE after initial rendering
// run();
let client = new ApolloClient({
  uri: uri,
  cache: new InMemoryCache()
});

console.log("Listening for network to change and clicking"+client.uri);
client.query({
  query: gql(tokensQuery)
})
.then(data => settokenPair(data.data.pairs))
.catch(err => { console.log("Error fetching data: ", err) });
},[network,uri]);

useEffect(() => {
  // Runs ONCE after initial rendering
   // and after every rendering ONLY IF `network`changes
  setParaSwap(new ParaSwap(network))
},[network]);

const handleClickEthereum = () => {
    console.log('this is: Ethereum');
    settokenPair([])
    setNetwork(NETWORK.ETHEREUM);
    setUri(ETHAPIURL);
    setethereumbuttom(true)
    setpolygonbuttom(false)
    setbscbuttom(false);
  }

const handleClickBSC = () => {
     console.log('this is: BSC');
      settokenPair([])
      setNetwork(NETWORK.BINANCE);
      setUri(BSCAPIURL);
      setbscbuttom(true)
      setethereumbuttom(false)
      setpolygonbuttom(false)
    }
  const handleClickPolygon = () => {
        console.log('this is: Polygon');
        settokenPair([])
        setNetwork(NETWORK.POLYGON);
        setUri(MATICAPIURL);
        setpolygonbuttom(true);
        setethereumbuttom(false);
        setbscbuttom(false);
    }

    const loadData = async () =>
      await fetch("https://apiv4.paraswap.io/v2/prices/?from=0x4d44D6c288b7f32fF676a4b2DAfD625992f8Ffbd&to=0xdAC17F958D2ee523a2206206994597C13D831ec7&amount=1000000000000000000&fromDecimals=18&toDecimals=6&side=SELL&network=1")
        .then(res => (res.ok ? res : Promise.reject(res)))
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error =>{
          console.log(error);
        });

    const check0 = (token) => {
        console.log("Check 0",token);
        // let temp=token.token0;
        // token.token0= token.token1
        // token.token1=temp;
// console.log(token.token0.id,token.token1.id);
//   const priceRoute: OptimalRates = paraSwap.getRate(
//   token.token0.id,
//   token.token1.id,
//   1000000000000000000
// );
loadData();



      }
      const check1 = (token) => {
          console.log("Check 1",token);
          // let temp=token.token0;
          // token.token0= token.token1
          // token.token1=temp;


        }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Pair Analytics and Best Exchanges at a glance!
        </p>
        <Button disabled={ethereumbuttom} onClick={handleClickEthereum}  variant="primary">Ethereum</Button>{' '}
        <Button disabled={bscbuttom} onClick={handleClickBSC} variant="warning">BSC</Button>{' '}
        <Button disabled={polygonbuttom} onClick={handleClickPolygon} variant="info">Polygon</Button>{' '}
        {tokenPair && tokenPair.map((token, index) => (
          <Row key={index}>
          <Row>
          <Col> <p>{token.token0.symbol} / {token.token1.symbol} </p></Col>
    <Col> <Button variant="success">Current Destination {token.token1.symbol}</Button> </Col>
    <Col sm={2} className="my-1">
      <Form.Control id="inlineFormInputName" placeholder={token.token0.symbol} defaultValue="1" />
    </Col>
    <Col> <Button variant="success" onClick={() =>check0(token)}>Check Best Exchange</Button> </Col>
<Col><Button variant="success">Swap</Button> </Col>
</Row>
<Row>
<Col> <p>{token.token1.symbol} / {token.token0.symbol} </p></Col>
<Col> <Button variant="success">Current Destination {token.token0.symbol}</Button> </Col>
<Col sm={2} className="my-1">
<Form.Control id="inlineFormInputName" placeholder={token.token1.symbol} defaultValue="1" />
</Col>
<Col> <Button variant="success" onClick={() =>check1(token)}>Check Best Exchange</Button> </Col>
<Col>  <Button variant="success">Swap</Button> </Col>
</Row>
</Row>
            ))}
      </header>
<div>PoweredBy : SuperHeroes</div>
    </div>
  );
}

export default App;
