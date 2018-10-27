import React, { Component } from 'react';

import Input from './Input';
import Login from './Login';
import GameList from './GameList';
import Waiting from './Waiting';
import ChainOfLifeController from '../chainoflife-controller';

import { Switch, Route } from 'react-router-dom';

class Root extends Component {

  constructor(props) {
    super(props);
    this.addUniversalLoginInfoToState = this.addUniversalLoginInfoToState.bind(this);
    this.props.eth.eventEmitter.on('data', event => {
      console.log(event);
    });

  }

  addUniversalLoginInfoToState(privKey, identityAddress) {
    const chainoflifeController = new ChainOfLifeController({
      identityAddress: identityAddress,
      privateKey: privKey
    });

    this.setState({
      chainoflifeController: chainoflifeController
    });

    console.log('state:',this.state)
  }

  render() {
    return (
      <Switch>
        <Route exact path='/' render={props => {
          return (<Login eth={this.props.eth} addUniversalLoginInfoToState={this.addUniversalLoginInfoToState} />);
        }} />
        <Route exact path='/list' render={props => {
          return (<GameList eth={this.props.eth} />);
        }} />
        <Route path='/create' render={props => {
          return (<Input size={1024} eth={this.props.eth} chainoflifeController={this.state.chainoflifeController} />);
        }} />
        <Route path='/join/:gameId' render={props => {
          return (<Input size={1024} eth={this.props.eth} gameId={props.match.params.gameId} chainoflifeController={this.state.chainoflifeController} />);
        }} />
        <Route path='/waiting/:gameId' render={props => {
          return (<Waiting eth={this.props.eth} gameId={props.match.params.gameId} />);
        }} />
      </Switch>
    );
  }
}

export default Root;