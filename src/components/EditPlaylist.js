import React, {Component} from 'react'

class EditPlaylist extends Component {
    constructor(props){
        super(props)
        this.state = {
            playlist:{},
            title:'',
            tags:'',
            tracks:[],
            boxes:0,
            initialBoxes:0
        }
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleTagChange = this.handleTagChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.incrementEntryBoxes = this.incrementEntryBoxes.bind(this);
        this.decrementEntryBoxes = this.decrementEntryBoxes.bind(this);
        this.handleTrackFormChange = this.handleTrackFormChange.bind(this);
        this.addTracksToState = this.addTracksToState.bind(this);
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
        })
    }

    getPlaylist(){
        console.log("get playlist")
        fetch(`http://localhost:3000/playlists/${this.props.match.params.id}`)
        .then(response=>response.json())
        .then(json => {
            this.setState({
                playlist: json,
                title: json.title,
                tags: json.tags,
                boxes:json.tracks.length-1,
                initialBoxes:json.tracks.length-1
            })
        }
        )
        .catch(error => console.error(error))
    
    }

    componentDidMount(){
        this.getPlaylist(); 
        this.getUser(); 
    }

    handleChange(event){
        this.setState({[event.target.id]: event.target.value})
    }

    handleTitleChange(event){
        let newPlaylist = this.state.playlist
        newPlaylist.title = event.target.value
        this.setState({playlist: newPlaylist})
    }

    handleTagChange(event){
        let newPlaylist = this.state.playlist
        newPlaylist.tags = event.target.value
        this.setState({playlist: newPlaylist})
    }


    handleSubmit(event){
        event.preventDefault()
        let newID = ''
        //this will be a multi step process
        //first a POST request will create a new playlist
        console.log(this.state.tags);
        fetch(`http://localhost:3000/${this.state.playlist.id}`,{
            body: JSON.stringify({
                title:this.state.playlist.title,
                //get the ID of the currently logged in user   
                user_id:this.state.playlist.user_id,
                tags:this.state.tags
            }),
            method:'PUT',
            headers:{
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        }).then(
            createdPlaylist=>createdPlaylist.json()
        ).then(jsonPlaylist => {
            //once this playlist has been created, we'll hold on to it's ID#
            //we will then use its ID# as a foreign key as we POST each of the tracks
            newID = jsonPlaylist.id;
            console.log(jsonPlaylist)
            console.log('UPDATE playlist: '+jsonPlaylist.title)
            console.log('tags:',jsonPlaylist.tags )
            console.log(newID);
            return newID
        }).then(newID=>{
            console.log("attempting track post");
            ////////////
            // IMPORTANT
            //  ==> this part of the code must be redesigned to allow
            //  adding NEW TRACKS to the edited playlist.
            //  basically running a PUT for every number up to the original
            //  length of playlist.tracks, and THEN running a POST for every
            //  fieldset ABOVE that number.
            //  ==> DELETE should be handled separately.
            //  give every fieldset a thing that will mark it for deletion, stored
            //  as an attribute of the track object in state.
            //  as the following loop iterates, if a 'marked for deletion' attr is found,
            //  run a DELETE request instead of a PUT.
            ///////////

            //handle positioning
            let pos = 1

            //run PUT requests for each track up to the amount that were
            //already in the playlist
            for(let i=0; i<=this.state.initialBoxes; i++){
                console.log("PUT: track",i+1,this.state.playlist.tracks[i].title)
                //if title or URL is blank, ignore
                //else, post it.
                if(this.state.playlist.tracks[i]['title'] && this.state.playlist.tracks[i]['url']){
                    fetch(`http://localhost:3000/${this.state.playlist.tracks[i].id}`,{
                        body: JSON.stringify({
                            title: this.state.playlist.tracks[i]['title'],
                            artist: this.state.playlist.tracks[i]['artist'],
                            url: this.state.playlist.tracks[i]['url'],
                            playlist_id: this.state.playlist.id,
                            position: pos
                        }),
                        method:'PUT',
                        headers:{
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json'
                        }
                    }).then(createdTrack => {return createdTrack.json()})
                    // .then(jsonTrack => console.log(jsonTrack))
                    .catch(error=>console.error(error));     
                    //increment position only if a track is added
                    pos += 1 
                }//end if
            }//end for
            //run POST requests for every track that was newly added
            for(let i=this.state.initialBoxes+1; i<=this.state.boxes; i++){
                //if title or URL is blank, ignore
                //else, post it.
                if(this.state.tracks[i]['title'] && this.state.tracks[i]['url']){
                    console.log("POST: track ",i+1,this.state.playlist.tracks[i].title)
                    fetch('http://localhost:3000/tracks',{
                        body: JSON.stringify({
                            title: this.state.tracks[i]['title'],
                            artist: this.state.tracks[i]['artist'],
                            url: this.state.tracks[i]['url'],
                            playlist_id: newID,
                            position: pos
                        }),
                        method:'POST',
                        headers:{
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json'
                        }
                    }).then(createdTrack => {return createdTrack.json()})
                    // .then(jsonTrack => console.log(jsonTrack))
                    .catch(error=>console.error(error));     
                    //increment position only if a track has been added
                    pos += 1 
                }//end if
            }//end for
        })
    }

    handleDelete(index,event){
        // event.preventDefault();
        let answer = prompt(`Are you sure you want to delete ${this.state.playlist.tracks[index].title}? Y/N`)
        if(answer=="y"||answer=="Y"){
            fetch(`http://localhost:3000/${this.state.playlist.tracks[index].id}`,{
                method:'DELETE'
            })
            // this.forceUpdate();
        }
    }

    handleTrackFormChange(index,event){
        let newTracks = this.state.playlist.tracks;
        let fieldName = event.target.id
        fieldName = fieldName.replace(/[0-9]/,'');
        newTracks[index] = {
            ...newTracks[index],
            [fieldName]: event.target.value,
        }
        let newPlaylist = this.state.playlist
        newPlaylist={
            ...newPlaylist,
            tracks: newTracks
        }
        this.setState({playlist: newPlaylist})
    }

    incrementEntryBoxes(){
        this.setState({boxes: this.state.boxes+1})
        let newTracks = this.state.playlist.tracks
        newTracks.push({
            title:'',
            artist:'',
            url:''
        })
        this.setState({ tracks: newTracks})
    }

 
    decrementEntryBoxes(){
        if(this.state.boxes>this.state.initialBoxes){
            this.setState({boxes: this.state.boxes-1})
            this.state.playlist.tracks.pop();
        }
    }

    addTracksToState(){
        //if the retrieved playlist has not yet had its tracks recorded in state
        if(this.state.playlist.tracks){
            let data = this.state.playlist
            console.log(this.state.playlist);
            if(this.state.playlist.tracks.length !== this.state.tracks.length){
                let ln = 0
                console.log("attempting addTrackstoState")
                console.log("playlist found")
                ln = data.tracks.length
                this.setState({boxes: ln-1})
                //loop through retrieved playlist and set the state to match it
                let newTracks = this.state.tracks;
                for(let i = 0; i<=ln; i++){
                    newTracks[i] = {
                        ['title'+i]: data.tracks[i].title,
                        ['artist'+i]: data.tracks[i].artist,
                        ['url'+i]: data.tracks[i].url
                    }
                }
                this.setState({tracks: newTracks});
            }
        }
    }

    renderEntryBox(){
        //render an entry box for each track in the playlist
        //result is an array holding form entries
        let result = []
        //result begins as one entry box, as this.state.boxes begins as one
        //for every extra box, a for-loop loops one more time, adding another
        //  complete set of form labels 
        if(this.state.playlist.tracks){
            if(this.state.playlist.tracks.length>0){
                for(let i = 0; i < this.state.playlist.tracks.length; i++){
                    let newBox = (
                        <fieldset>
                            <legend>Track {i+1}</legend>
                        <label htmlFor={'title'+i}>Title</label>
                        <input type='text' value={this.state.playlist.tracks[i]['title']} onChange={(event)=>{this.handleTrackFormChange(i,event)}} id={'title'+i}/>
                        <label htmlFor={'artist'+i}>Artist</label>
                        <input type='text' value={this.state.playlist.tracks[i]['artist']} onChange={(event)=>{this.handleTrackFormChange(i,event)}} id={'artist'+i}/>
                        <label htmlFor={'url'+i}>URL</label>
                        <input type='text' value={this.state.playlist.tracks[i]['url']} onChange={(event)=>{this.handleTrackFormChange(i,event)}} id={'url'+i}/>
                        {i<=this.state.initialBoxes ? <button onClick={(event)=>{this.handleDelete(i,event)}}>Delete {i+1}</button> : ''}
                        </fieldset>
                    )
                    // console.log("made box ",i)
                    result.push(newBox);
                }
            }
        }

        return result;
        
    }

    render(){
        // this.addTracksToState();
        return(
            <>
            <h1>Edit Playlist</h1>
            { this.state.login && this.state.user.id == this.state.playlist.user_id?
            <>
            <form onSubmit={this.handleSubmit}>
                <label htmlFor='title'>Playlist Title</label>
                <input type='text' onChange={this.handleTitleChange} value={this.state.playlist.title} id='title'/>
                <label htmlFor='tags'>Tags:</label>
                <input type='text' id='tags' value={this.state.tags} onChange={this.handleChange}/>
                <div>(Separate tags with spaces)</div>
                {this.renderEntryBox()}
                <input type='submit'/>
            </form>
            <button onClick={this.incrementEntryBoxes}>Add Track</button>
            <button onClick={this.decrementEntryBoxes}>Remove Last Track</button>
            </>:
            <p>You are not authorized to edit this playlist!</p>
            }
            </>
        )
    }
}

export default EditPlaylist