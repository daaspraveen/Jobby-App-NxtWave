import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {username: 'rahul', password: 'rahul@2021', errorPara: ''}

  submitFunc = async e => {
    e.preventDefault()
    const {username, password} = this.state
    const userLoginDetails = {
      username,
      password,
    }
    // console.log(userLoginDetails)
    if (!username || !password) {
      this.setState({errorPara: '*Username or password is invalid'})
      return
    }
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userLoginDetails),
    }
    const fetching = await fetch(url, options)
    const response = await fetching.json()
    if (fetching.ok) {
      this.resetFormInputs()
      // console.log(response)
      this.setState({errorPara: ''})
      Cookies.set('jwt_token', response.jwt_token, {
        expires: 3,
      })
      this.moveToHomePage()
    } else {
      this.resetFormInputs()
      this.setState({errorPara: `*${response.error_msg}`})
    }
  }

  moveToHomePage = () => {
    const {history} = this.props
    history.replace('/')
  }

  updateInputUsername = e => {
    this.setState({username: e.target.value})
  }

  updateInputPassword = e => {
    this.setState({password: e.target.value})
  }

  resetFormInputs = () => {
    this.setState({username: '', password: '', errorPara: ''})
  }

  render() {
    const cookieData = Cookies.get('jwt_token')
    if (cookieData !== undefined) {
      return <Redirect to="/" />
    }
    const {username, password, errorPara} = this.state
    const errorFormBoxStyle = !errorPara ? '' : 'error-form-box'
    return (
      <div className="login-container">
        <div className={`login-form-box ${errorFormBoxStyle}`}>
          <form className="form" onSubmit={this.submitFunc}>
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="form-logo"
            />
            <div className="input-box">
              <label htmlFor="username-input" className="input-label">
                USERNAME
              </label>
              <input
                type="text"
                id="username-input"
                className="form-input"
                placeholder="Username"
                value={username}
                onChange={this.updateInputUsername}
              />
            </div>
            <div className="input-box">
              <label htmlFor="password-input" className="input-label">
                PASSWORD
              </label>
              <input
                type="password"
                id="password-input"
                className="form-input"
                placeholder="Password"
                value={password}
                onChange={this.updateInputPassword}
              />
            </div>
            <button type="submit" className="login-btn">
              Login
            </button>
            <p className="login-error-para">{errorPara}</p>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
