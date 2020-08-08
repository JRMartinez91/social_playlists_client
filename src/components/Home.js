import React, {Component} from 'react';

class Home extends Component{
    constructor(props){
        super(props)
        this.state={
            recentPlaylists:[]
        }
    }

    getPlaylists(){
        //Home page retrieves Playlists and displays them in chronological order
        fetch('https://share-a-mixtape.herokuapp.com/playlists/recent')
        .then(response=>response.json())
        .then(json => this.setState({recentPlaylists: json}))
        .catch(error => console.error(error))
        console.log("get Playlists")
    }

    componentDidMount(){
        this.getPlaylists();
    }

    render(){
        return(
            <>
            <h1>Home Page</h1>
            <h2>Recent Playlists:</h2>
            <ol>
            { this.state.recentPlaylists.map( playlist=>{
            return(
               <li>
                   <h3><a href={`/playlist/${playlist.id}`}>
                       {playlist.title}
                   </a></h3>
                   <h4><a href={`/users/${playlist.user.id}`}>
                       By {playlist.user.username}
                   </a></h4>
               </li> 
            )
        })}
            </ol>
            </>
        )
    }
}

export default Home