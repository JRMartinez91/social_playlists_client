import React, {Component} from 'react'

class PlaylistByID extends Component{
    constructor(props){
        super(props)
        this.state={
            playlist:{}
        }
        this.parseTracks = this.parseTracks.bind(this);
        this.parseUser = this.parseUser.bind(this);
    }

    checkLogin(){
        fetch('https://share-a-mixtape.herokuapp.com/users/session_id',{
          headers:{
            Authorization: `Bearer ${localStorage.getItem('mixtape_token')}`
          }
        })
        .then(response=>response.json())
        .then(json=>{
          if(json.id){
            this.setState({login:true,user:json})
          }
        })
    }

    getPlaylist(){
        fetch(`https://share-a-mixtape.herokuapp.com/${this.props.match.params.id}`)
            .then(response=>response.json())
            .then(json => this.setState({playlist: json}))
            .catch(error => console.error(error))
        
        console.log("get playlist")
    }

    componentDidMount(){
        this.getPlaylist();
        this.checkLogin();
    }

    parseUser(){
        const user = this.state.playlist.user;
        let result = <p>Loading...</p>
        if(user){
            result = (
                <h3><a href={`/users/${user.id}`}>By {user.username}</a></h3>
            )
        }
        return result;
    }

    parseTracks(){
        const tracks = this.state.playlist.tracks;
        const playlist_id = this.state.playlist.id
        let trackList = [];
        //if playlist is not empty
        if(tracks){
            if(tracks.length >0){
                tracks.map(track=>{
                    trackList.push(
                        <a href={`/track/${playlist_id}/${track.position}`}>
                        <li key={track.id}><ul>
                            <li>{track.title}</li>
                            <li>{track.artist}</li>
                            {/* <li>{track.url}</li> */}
                        </ul></li>
                        </a>
                    )
                })
            } else {
                trackList = <p>Playlist has no tracks!</p>
            }
        } else {
            trackList = <p>Loading track list...</p>
        }
        return trackList;

    }

    render(){
        return(
            <>
            <h1>Playlist By ID</h1>
            <h2>{this.state.playlist.title}</h2>
            <h4>Tags: {this.state.playlist.tags}</h4>
            {this.state.user && (this.state.user.id == this.state.playlist.user_id) ?
            <><a href={`/edit_playlist/${this.state.playlist.id}`}>Edit</a></>:<></>}
            {this.parseUser()}
            <ol>
               {this.parseTracks()}
            </ol>
            </>
        )
    }
}

export default PlaylistByID;