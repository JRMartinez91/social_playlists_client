import React,{Component} from 'react'

class AllPlaylists extends Component{
    constructor(props){
        super(props)
        this.state = {
            playlists:{}
        }       
        this.parsePlaylists = this.parsePlaylists.bind(this)
    }

    getPlaylists(){
        fetch(`https://share-a-mixtape.herokuapp.com/playlists/`)
        .then(response=>response.json())
        .then(json => this.setState({playlists: json}))
        .catch(error => console.error(error))
    console.log("get playlist")
    }

    componentDidMount(){
        this.getPlaylists();
    }

    parsePlaylists(){
        if(this.state.playlists.length>0){
            return(
                <>
                {this.state.playlists.map(playlist=>{
                    return(
                        <li>
                            <a href={`/playlist/${playlist.id}`}>{playlist.title}</a>
                            <p>{playlist.tags ? playlist.tags : "No Tags"}</p>
                        </li>
                    )
                })}
                </>
            )
        }
    }

    render(){
        const playlists = this.state.playlists
        console.log(playlists)
        return(
            <>
            <h1>All Playlists</h1>
            <ol>
                {this.parsePlaylists()}
            </ol>
            </>
        )
    }
}

export default AllPlaylists