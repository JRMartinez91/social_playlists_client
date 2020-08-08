import React, {Component} from 'react';
import './App.css';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Home from './components/Home'
import PlaylistByID from './components/PlaylistByID'
import CreatePlaylist from './components/CreatePlaylist'
import EditPlaylist from './components/EditPlaylist'
import Userpage from './components/Userpage'
import TrackByID from './components/TrackByID'
import AllPlaylists from './components/AllPlaylists'
import AllUsers from './components/AllUsers'
import TagSearch from './components/TagSearch'
import LoginPage from './components/LoginPage';

const backend = 'http://localhost:3000'

class App extends Component {
  constructor(props){
  super(props)
  this.state={
      login:false
    }
    this.parseLogin = this.parseLogin.bind(this)
    this.parseUserpage = this.parseUserpage.bind(this)
    this.forceLogout = this.forceLogout.bind(this)
  }

  getUser(){
    fetch('http://localhost:3000/users/session_id',{
      headers:{
        Authorization: `Bearer ${localStorage.getItem('mixtape_token')}`
      }
    })
    .then(response=>response.json())
    .then(json=>{
      if(json.id){
        this.setState({login:true,user:json})
      }
      console.log(json)
    })
  }

  forceLogout(){
    localStorage.setItem('mixtape_token',"")
    this.forceUpdate();
  }
  
  parseLogin(){
    if(this.state.login){
      //display 'log out' button
      return <a href="/home" onClick={this.forceLogout}>Log Out</a>
    } else {
      //display 'log in' button
      return <a href="/login">Log In</a>
    }
  }

  parseUserpage(){
    if(this.state.login){
      //display link to userpage
    return <p><a href={`/users/${this.state.user.id}`}>{this.state.user.username}</a></p>
    } else {
      return <p>Not Signed in</p>
    }
  }

  componentDidMount(){
    this.getUser();
  }

  render(){
    return(
      <BrowserRouter>
        {/* Things that show up on every page go here */}
        <h1>Share a Mixtape!</h1>
        {this.parseUserpage()}
        <nav>
          <a href="/home">Home</a>
          <a href="/new_playlist">Create New Playlist</a>
          <a href="/all">All Playlists</a>
          <a href="/allusers">All Users</a>
          <a href="/tagsearch">Tag Search</a>
          {this.parseLogin()}
        </nav>
      <Switch>
        {/* Individual Pages Go Here */}
        <Route path="/home" component={Home}/>
        <Route path="/playlist/:id" component={PlaylistByID}/>
        <Route path="/new_playlist" component={CreatePlaylist}/>
        <Route path="/edit_playlist/:id" component={EditPlaylist}/>
        <Route path="/users/:id" component={Userpage}/>
        <Route path="/track/:playlist_id/:track_position" component={TrackByID}/>
        <Route path="/all" component = {AllPlaylists}/>
        <Route path="/allusers" component = {AllUsers}/>
        <Route path="/tagsearch" component = {TagSearch}/>
        <Route path="/login" component={LoginPage}/>
      </Switch>
      </BrowserRouter>
    )
  }
}

export default App;
