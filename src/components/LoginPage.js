import React, {Component} from 'react'

class LoginPage extends Component{
    constructor(props){
        super(props)
        this.state={

        }
        this.handleLogin = this.handleLogin.bind(this)
        this.handleCreateUser = this.handleCreateUser.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleLogin(event){
        event.preventDefault();
        fetch('http://localhost:3000/users/login',{
            body: JSON.stringify({user:{
                username:this.state.username,
                password:this.state.password
            }}),
            method:'POST',
            headers:{
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        })
        .then(response=>response.json())
        .then(json=>{
            localStorage.setItem('mixtape_token',json.token)
            console.log(json)
        })
    }

    handleCreateUser(event){
        event.preventDefault();
        fetch('http://localhost:3000/users',{
            body: JSON.stringify({
                username:this.state.new_username,
                password:this.state.new_password
            }),
            method:'POST',
            headers:{
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        })
        .then(newUser=>newUser.json())
        .then(jsonUser=>console.log(jsonUser))
        .catch(error=>console.error(error))
    }
    
    handleChange(event){
        this.setState({[event.target.id]:event.target.value})
    }

    render(){
        return(
            <>
            <h1>Login</h1>
            <h2>Sign in:</h2>
            <form onSubmit={this.handleLogin}>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" onChange={this.handleChange}/>
                <label htmlFor="password">Password:</label>
                <input type="text" id="password" onChange={this.handleChange}/>
                <input type="submit" value="Log in"/>
            </form>
            <h2>Or Create an Account:</h2>
            <form onSubmit={this.handleCreateUser}>
                <label htmlFor="new_username">Username:</label>
                <input type="text" id="new_username" onChange={this.handleChange}/>
                <label htmlFor="new_password">Password:</label>
                <input type="text" id="new_password" onChange={this.handleChange}/>
                <input type="submit" value="Create Account"/>
            </form>
            </>
        )
    }
}

export default LoginPage