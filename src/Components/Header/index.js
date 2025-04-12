import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Header = props => {
  const headerLogoutBtn = () => {
    // console.log('logout')
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <nav className="header">
      <Link to="/">
        <img
          className="header-logo-img"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
      </Link>
      <ul className="header-menus-box desktop-menu-box">
        <li>
          <Link to="/" className="header-link">
            Home
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="header-link">
            Jobs
          </Link>
        </li>
        <li>
          <button
            type="button"
            className="desktop-logout-btn"
            onClick={headerLogoutBtn}
          >
            Logout
          </button>
        </li>
      </ul>
      <div className="mobile-menus-box">
        <Link to="/" className="header-link">
          <AiFillHome size={25} />
        </Link>
        <Link to="/jobs" className="header-link">
          <BsBriefcaseFill size={25} />
        </Link>
        <button
          type="button"
          className="mobile-logout-btn"
          onClick={headerLogoutBtn}
        >
          <FiLogOut size={25} color="#fff" />
        </button>
      </div>
    </nav>
  )
}

export default withRouter(Header)
