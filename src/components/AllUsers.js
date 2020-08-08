import React, {Component} from 'react'

class AllUsers extends Component{
    constructor(props){
        super(props)
        this.state = {
            users:[]
        }
        this.parseUsers = this.parseUsers.bind(this);
        // this.handleChange = this.handleChange.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
        // this.incrementEntryBoxes = this.incrementEntryBoxes.bind(this);
        // this.decrementEntryBoxes = this.decrementEntryBoxes.bind(this);
        // this.handleTrackFormChange = this.handleTrackFormChange.bind(this);
    }

    getUsers(){
        fetch('http://localhost:3000/users')
        .then(response=>response.json())
        .then(json=>this.setState({users:json}))
        .catch(error=>console.error(error))
    }

    componentDidMount(){
        this.getUsers()
    }

    parseUsers(){
        if(this.state.users.length>0){
            return(
                <>
                {this.state.users.map(user=>{
                    return(
                        <li>
                            <h3><a href={`/users/${user.id}`}>{user.username}</a></h3>
                            { user.playlists ? <p>{user.playlists.length} Playlists</p> : <h4>No Playlists</h4>}
                        </li>
                    )
                })}
                </>
            )
        }
    }
    render(){
        return(
            <>
            <h1>All Users</h1>
            <ul>
                {this.parseUsers()}
            </ul>
            </>
        )
    }
}

export default AllUsers