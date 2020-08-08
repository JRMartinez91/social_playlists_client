import React, {Component} from 'react'

class TagSearch extends Component {
    constructor(props){
        super(props)
        this.state={
            playlists:[],
            alltags:[],
            searchterm: ''
        }
        this.parseAllTags = this.parseAllTags.bind(this)
        this.parsePlaylists = this.parsePlaylists.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(event){
        event.preventDefault()
        this.getPlaylists(this.state.searchterm)
    }

    handleChange(event){
        this.setState({[event.target.id]: event.target.value})
    }

    getPlaylists(searchTerm){
        fetch(`http://localhost:3000/playlists/tagsearch/${searchTerm}`)
        .then(response=>response.json())
        .then(json => this.setState({playlists: json}))
        .catch(error => console.error(error))
        console.log("get playlist")
    }

    getAllTags(){
        fetch('http://localhost:3000/playlists/alltags')
        .then(response=>response.json())
        .then(jsonTags => this.setState({alltags: jsonTags}))
        .catch(error=>console.error(error))
    }

    componentDidMount(){
        this.getAllTags()
    }

    search(searchTerm){
        this.getPlaylists(searchTerm);
    }

    parseAllTags(){
        //initialize an empty array
        let masterlist=[]
        //loop through each list of tags in alltags
        for(const obj of this.state.alltags){
            //if list has data in it
            if(obj.tags){
                //separate each word in the list
                let arr = obj.tags.split(" ")
                //if that word is not already in the masterlist, add it
                for(const e of arr){
                    if(!masterlist.includes(e)){
                        masterlist.push(e)
                    }
                }
            }
        }

        return(
            <div>
                {masterlist.map(e=>{
                    return(
                        <span onClick={()=>{this.getPlaylists(e)}}>{e}</span>
                    )
                })}
            </div>
        )
        
    }

    parsePlaylists(){
        //this will trigger when state is updated
        return(
            <div>
                {this.state.playlists.map(playlist=>{
                    return(
                        <p><a href={`/playlist/${playlist.id}`}>{playlist.title}</a></p>
                    )
                })}
            </div>
        )
    }

    render(){
        return(
            <>
            <h1>Tag Search</h1>
            <p>Search box goes here</p>
            <form onSubmit={this.handleSubmit}>
                <label htmlFor="searchterm">Enter a tag to search for:</label>
                <input type="text" id="searchterm" onChange={this.handleChange}/>
                <input type="submit" value="Search"/>
            </form>
            <p>List of all tags:</p>
            {this.parseAllTags()}
            <p>Search Results:</p>
            {this.parsePlaylists()}
            </>
        )
    }
}

export default TagSearch