import React, {Component} from 'react'

class Userpage extends Component{
    constructor(props){
        super(props)
        this.state = {
            user:{}
        }
        this.parsePlaylists = this.parsePlaylists.bind(this);
        // this.handleChange = this.handleChange.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
        // this.incrementEntryBoxes = this.incrementEntryBoxes.bind(this);
        // this.decrementEntryBoxes = this.decrementEntryBoxes.bind(this);
        // this.handleTrackFormChange = this.handleTrackFormChange.bind(this);
    }


    getUser(){
        fetch(`https://share-a-mixtape.herokuapp.com/users/${this.props.match.params.id}`)
        .then(response=>response.json())
        .then(json => this.setState({user: json}))
        .catch(error=>console.error(error));
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
              this.setState({login:true, session_id:json.id})
            }
        })
    }

    handleDelete(id,title){
         // event.preventDefault();
         if(this.state.login){
             let answer = prompt(`Are you sure you want to delete ${title}? Y/N`)
             if(answer=="y"||answer=="Y"){
                 fetch(`https://share-a-mixtape.herokuapp.com/playlists/${id}`,{
                     method:'DELETE'
                 })
             }
         }
    }
    

    componentDidMount(){
        this.getUser();
        this.checkLogin();
    }

    parsePlaylists(){
        let result =[]
        //check if user has been loaded
        if(this.state.user.playlists){
            //if user has any playlists..
            if(this.state.user.playlists.length>0){
                const playlists = this.state.user.playlists;
                playlists.map(playlist=>{
                    result.push(
                        <li>
                    <h3><a href={`/playlist/${playlist.id}`}>{playlist.title}</a></h3>
                    {this.state.login && this.state.session_id == playlist.user_id?
                        <>
                        <a href={`/edit_playlist/${playlist.id}`}>Edit</a> 
                        <button onClick={()=>{this.handleDelete(playlist.id,playlist.title)}}>Delete</button>
                        </>
                        : <></>}
                    </li>
                    )
                })
            } else {
                result = <li>No playlists created yet!</li>
            }
        } else {
            result = <li>...</li>
        }
    return result
    }

    render(){
        const user = this.state.user
        return(
            <>
            <h1>Userpage</h1>
            <h2>{user.username}</h2>
            <ul>
                {this.parsePlaylists()}
            </ul>
            </>
        )
    }
}

export default Userpage