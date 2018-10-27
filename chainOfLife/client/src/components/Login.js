import React, {Component} from 'react';
import Connect from '../views/Connect';
import EthereumIdentitySDK from 'universal-login-sdk';
import {providers, Wallet} from 'ethers';
import getLabel from '../utils';

class Login extends Component {
  constructor(props) {
    super(props);

    this.provider = new providers.JsonRpcProvider('http://localhost:18545');
    this.sdk = new EthereumIdentitySDK('http://localhost:3311', this.provider);
    this.tokenContractAddress = '0x850437540FE07d02045f88cAe122Bc66B1BdE957';
  }

  async update(event) {
    const {value} = event.target;
    this.setState({value});
  }

  async onNextClick() {
    const name = `${this.state.value}.chainoflife.eth`;
    const identityAddress = await this.sdk.identityExist(name);
    this.identityAddress = identityAddress;
    if (identityAddress) {
      const privateKey = await this.sdk.connect(identityAddress, await getLabel());
      this.privateKey = privateKey;
      // this.state.view == 'transfer';
      const {address} = new Wallet(privateKey);
      this.subscription = this.sdk.subscribe('KeyAdded', identityAddress, async (event) => {
        if (event.address === address) {
          this.props.addUniversalLoginInfoToState(privateKey, identityAddress);
        };
      });
    } else {
      alert(`Identity ${name} does not exist.`);
    }
  }

  async componentDidMount() {
    await this.sdk.start();
  }

  componentWillUnmount() {
    this.subscription.remove();
    this.sdk.stop();
  }

  render() {
    return (<Connect onChange={this.update.bind(this)} onNextClick={this.onNextClick.bind(this)}/>);
  }
}


export default Login;
