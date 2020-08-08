import React, {Component} from 'react'

class TrackByID extends Component{
    constructor(props){
        super(props)
        this.state={
        }
        this.parseForwardButton = this.parseForwardButton.bind(this)
        this.parsePlaylistLink = this.parsePlaylistLink.bind(this)
        this.parseBackButton = this.parseBackButton.bind(this)
        this.parseTrackInfo = this.parseTrackInfo.bind(this)
        this.displayVideo = this.displayVideo.bind(this)
    }

    displayVideo(){
        if(this.state.playlist){
            let url = this.state.playlist.tracks[this.props.match.params.track_position-1].url
            url = url.replace('watch?v=','embed/')
            return(
                <iframe width="500" height="300"src={url} title="videoframe"></iframe>
            )
        }
    }

    getPlaylist(){
        fetch(`https://share-a-mixtape.herokuapp.com/playlists/${this.props.match.params.playlist_id}`)
        .then(response=>response.json())
        .then(json=>this.setState({playlist: json}))
        .catch(error=>console.error(error))
    }

    componentDidMount(){
        this.getPlaylist()
        setTimeout(console.log(this.state),5000);
    }

    parseTrackInfo(){
        if(this.state.playlist){
            const track = this.state.playlist.tracks[this.props.match.params.track_position-1]
            return(
                <>
                <h3>{track.title}</h3>
                <h3>{track.artist}</h3>
                </>
            )
        } else {
            return(
                <>
                <h3>Loading...</h3>
                </>
            )
        }
    }

    parsePlaylistLink(){
        if(this.state.playlist){
            return(
                <h3>
                <a href={`/playlist/${this.state.playlist.id}`}>Back To Playlist: {this.state.playlist.title}</a>
                </h3>
            )
        } else {
            return(
                <h3>Loading...</h3>
            )
        }
    }

    parseBackButton(){
        //generate a link to the previous track
        //of if this is the first track, disable link
        const playlist_id = this.props.match.params.playlist_id
        const track_position = this.props.match.params.track_position - 1;

        if(this.state.playlist){
            if(track_position < 1){
                return(
                    <h3>No Previous Track</h3>
                )
            } else {
                return(
                    <h3>
                        <a href={`/track/${playlist_id}/${track_position}`}>Previous Track</a>
                    </h3>
                )
            }
        } else{
            return( <h3>Loading...</h3>)
        }
    }

    parseForwardButton(){
        //generate a link to the next track
        //or if this is the last track, disable link
        const playlist_id = this.props.match.params.playlist_id
        const track_position = parseInt(this.props.match.params.track_position) + 1;
        if(this.state.playlist){
            console.log(this.state.playlist.tracks.length)
            console.log(track_position)
            if(track_position > this.state.playlist.tracks.length){
                return(
                    <h3>No Next Track</h3>
                )
            }else{
                return(
                    <h3>
                    <a href={`/track/${playlist_id}/${track_position}`}>Next Track</a>
                </h3>
                )
            }
        } else {
            return( <h3>Loading...</h3>)
        }

    }
    render(){
        return(
            <>
            <h1>Track by ID</h1>
            <div>
                {this.displayVideo()}
            </div>
            <div>
                {this.parseBackButton()}
                <div>
                    {this.parseTrackInfo()}
                </div>
                {this.parseForwardButton()}
            </div>
            <div>
                {this.parsePlaylistLink()}
            </div>
            </>
        )
    }
}

export default TrackByID