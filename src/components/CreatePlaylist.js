import React, {Component} from 'react'

class CreatePlaylist extends Component {
    constructor(props){
        super(props)
        this.state = {
            title:'',
            tags:'',
            tracks:[
                {title0:'',
                artist0:'',
                url0:''}
            ],
            boxes:0
        }
        this.getUser = this.getUser.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.incrementEntryBoxes = this.incrementEntryBoxes.bind(this);
        this.decrementEntryBoxes = this.decrementEntryBoxes.bind(this);
        this.handleTrackFormChange = this.handleTrackFormChange.bind(this);
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

    componentDidMount(){
        this.getUser()
    }
    handleChange(event){
        this.setState({[event.target.id]: event.target.value})
    }

    handleTrackFormChange(index,event){
        let newTracks = this.state.tracks;
        newTracks[index] = {
            ...newTracks[index],
            [event.target.id]: event.target.value,
        }
        this.setState(
            {tracks: newTracks}
        )
    }

    handleSubmit(event){
        let newID
        event.preventDefault()
        //get the current user to determine the foreign key to assign to the playlist

        //this will be a multi step process
        //first a POST request will create a new playlist
        fetch('http://localhost:3000/playlists',{
            body: JSON.stringify({
                title:this.state.title,
                //get the ID of the currently logged in user   
                user_id:this.state.user.id
            }),
            method:'POST',
            headers:{
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        }).then(createdPlaylist=>createdPlaylist.json()
        ).then(jsonPlaylist => {
            //once this playlist has been created, we'll hold on to it's ID#
            //we will then use its ID# as a foreign key as we POST each of the tracks
            newID = jsonPlaylist.id;
            console.log('POST playlist: '+jsonPlaylist.title)
            console.log(newID);
            return newID
        }).then(newID=>{
            console.log("attempting track post");
            //handle positioning
            let pos = 1
            for(let i=0; i<=this.state.boxes; i++){
                //if title or URL is blank, ignore
                //else, post it.
                if(this.state.tracks[i]['title'+i] && this.state.tracks[i]['url'+i]){
                    console.log("loop: track post "+i);
                    fetch('http://localhost:3000/tracks',{
                        body: JSON.stringify({
                            title: this.state.tracks[i]['title'+i],
                            artist: this.state.tracks[i]['artist'+i],
                            url: this.state.tracks[i]['url'+i],
                            playlist_id: newID,
                            position: pos
                        }),
                        method:'POST',
                        headers:{
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json'
                        }
                    }).then(createdTrack => {return createdTrack.json()})
                    .then(jsonTrack => console.log(jsonTrack))
                    .catch(error=>console.error(error));   
                    //increment position only if a track has been added
                    pos += 1   
                }//end if
            }//end for
        })
        .catch(error=>console.error(error))
        
    }

    incrementEntryBoxes(){
        this.setState({boxes: this.state.boxes+1})
        let i = this.state.boxes+1
        let newTracks = this.state.tracks
        newTracks.push({
            ['title'+i]:'',
            ['artist'+i]:'',
            ['url'+i]:''
        })
        this.setState({ tracks: newTracks})
    }

    decrementEntryBoxes(){
        if(this.state.boxes>0){
            this.setState({boxes: this.state.boxes-1})
            this.state.tracks.pop();
        }
    }

    renderEntryBox(){
        //result is an array holding form entries
        let result = []
        //result begins as one entry box, as this.state.boxes begins as one
        //for every extra box, a for-loop loops one more time, adding another
        //  complete set of form labels 
        for(let i = 0; i <= this.state.boxes; i++){
            let newBox = (
                <fieldset>
                    <legend>Track {i+1}</legend>
                <label htmlFor={'title'+i}>Title</label>
                <input type='text' value={this.state.tracks[i]['title'+i]} onChange={(event)=>{this.handleTrackFormChange(i,event)}} id={'title'+i}/>
                <label htmlFor={'artist'+i}>Artist</label>
                <input type='text' value={this.state.tracks[i]['artist'+i]} onChange={(event)=>{this.handleTrackFormChange(i,event)}} id={'artist'+i}/>
                <label htmlFor={'url'+i}>URL</label>
                <input type='text' value={this.state.tracks[i]['url'+i]} onChange={(event)=>{this.handleTrackFormChange(i,event)}} id={'url'+i}/>
                </fieldset>
            )
            result.push(newBox);
        }

        return result;
        
    }


    render(){
        return(
            <>
            <h1>Create Playlist</h1>
            { this.state.login?
            <>
            <p>
                Entries with a blank Title or URL will be ignored!
            </p>
            <form onSubmit={this.handleSubmit}>
                <label htmlFor='title'>Playlist Title</label>
                <input type='text' onChange={this.handleChange} id='title'/>
                <label htmlFor='tags'>Tags:</label>
                <div>(Separate tags with spaces)</div>
                <input type='text' id='tags' onChange={this.handleChange}/>
                {this.renderEntryBox()}
                <input type='submit'/>
            </form>
            <button onClick={this.incrementEntryBoxes}>Add Another Track</button>
            <button onClick={this.decrementEntryBoxes}>Remove Last Track</button>
            </>
            : <p>You must log in to create a playlist!</p>}
            </>
    
        )
    }
}

export default CreatePlaylist