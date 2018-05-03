import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      inputValue: '',
      inputUsernameValue: '',
      inputPasswordValue: '',
      invalidSessionID: false
    }
  }
  refreshMessages = () => {
    fetch('/messages')
      .then(res => {
        return res.json()
      })
      .then(msgs => {
        this.setState({ messages: msgs })
      })
  }
  handleSubmit = event => {
    event.preventDefault();
    let bod = JSON.stringify({
      sessionID: this.state.sessionID,
      contents: this.state.inputValue
    });
    fetch('/sendMsg', {
      method: 'POST',
      body: bod
    })
      .then(response => response.text())
      .then(responseBody => {
        if (responseBody !== "success") {
          this.setState({ invalidSessionID: true })
        }
      })
  }

  handleUsernameSubmit = event => {
    event.preventDefault();
    let usrName = this.state.inputUsernameValue
    let bod = JSON.stringify({ username: usrName, password: this.state.inputPasswordValue });
    fetch('/login', { method: 'POST', body: bod })
      .then(response => response.text())
      .then(responseBody => {
        let parsed = JSON.parse(responseBody);
        let sessionID = parsed.sessionID;
        if (sessionID) {
          this.setState({ sessionID: sessionID, username: usrName });
          setInterval(this.refreshMessages, 500);
        } else {
          this.setState({ loginFailed: true })
        }
      })

  }

  handleChange = event => {
    this.setState({ inputValue: event.target.value })
  }

  handleUsernameChange = event => {
    this.setState({ inputUsernameValue: event.target.value })
  }
  handlePasswordChange = event => {
    this.setState({ inputPasswordValue: event.target.value })
  }
  askForUsername = () => {
    return (<div>

      <form onSubmit={this.handleUsernameSubmit}>
        <div>
          Username
          <input
            type="text"
            value={this.state.inputUsernameValue}
            onChange={this.handleUsernameChange}>
          </input>
          password
          <input
            type="text"
            value={this.state.inputPasswordValue}
            onChange={this.handlePasswordChange}>
          </input>
          <input type="submit"></input>
        </div>
      </form>
    </div >)
  }
  render() {
    if (!this.state.username) {
      return this.askForUsername();
    }
    if (this.state.loginFailed) {
      return (<div> Username or password invalid </div>)
    }
    if (this.state.invalidSessionID) {
      return (<div> Invalid session ID </div>)
    }
    return (
      <div>
        <div className="topcontainer">
          {this.state.messages.map(line => (<div> {line.username} : {line.contents} </div>))}
        </div>
        <div className="botcontainer">
          <form onSubmit={this.handleSubmit}>
            <div className="chat">
              <input
                type="text"
                value={this.state.inputValue}
                onChange={this.handleChange}>
              </input>
              <input type="submit"></input>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default App;
