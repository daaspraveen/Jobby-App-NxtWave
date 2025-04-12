import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {BsSearch} from 'react-icons/bs'

import Header from '../Header'
import JobItem from '../JobItem'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusList = {
  initial: 'INITIAL',
  in_progress: 'IN PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    inputSearch: '',
    apiStatus: apiStatusList.initial,
    apiList: [],
    profileData: [],
    empsFilterList: [],
    salsFilter: '',
  }

  componentDidMount() {
    this.setState({apiStatus: apiStatusList.in_progress})
    this.startProfileApi()
    this.startJobsApi()
  }

  startProfileApi = async () => {
    const profileUrl = 'https://apis.ccbp.in/profile'
    const cookieData = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookieData}`,
      },
    }
    const fetchingProfile = await fetch(profileUrl, options)
    if (fetchingProfile.ok) {
      const profileResp = await fetchingProfile.json()
      this.setState({profileData: profileResp.profile_details})
    } else {
      this.setState({profileData: ''})
    }
  }

  startJobsApi = async () => {
    const {inputSearch, empsFilterList, salsFilter} = this.state
    const empsFilterStr =
      empsFilterList.length > 1
        ? empsFilterList.join(',')
        : empsFilterList[0] || ''
    // console.log('empsFilterStr:== ', empsFilterStr)
    const url = `https://apis.ccbp.in/jobs?employment_type=${empsFilterStr}&minimum_package=${salsFilter}&search=${inputSearch}`
    // console.log(url)
    const cookieData = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookieData}`,
      },
    }
    const fetching = await fetch(url, options)
    const response = await fetching.json()
    // console.log('resp', response)
    if (response) {
      // console.log(response.total)
      this.setState({apiStatus: apiStatusList.success, apiList: response})
    } else {
      this.setState({
        apiStatus: apiStatusList.failure,
        apiList: [],
      })
      console.log('Error 1: ')
    }
  }

  filterEmpCBox = employsDetails => {
    const {employmentTypeId, label} = employsDetails
    return (
      <li className="filter-input-box" key={employmentTypeId}>
        <label htmlFor={employmentTypeId} className="filter-input-label">
          <input
            type="checkbox"
            className="filter-input"
            id={employmentTypeId}
            value={label}
            onChange={this.updateEmplyTypeApi}
          />
          {label}
        </label>
      </li>
    )
  }

  filterSalCBox = salarysDetails => {
    const {salaryRangeId, label} = salarysDetails
    return (
      <li className="filter-input-box" key={salaryRangeId}>
        <label htmlFor={salaryRangeId} className="filter-input-label">
          <input
            type="radio"
            className="filter-input"
            id={salaryRangeId}
            name="salaryRange"
            value={salaryRangeId}
            onChange={this.updateSalaryApi}
          />
          {label}
        </label>
      </li>
    )
  }

  updateSearchInput = e => {
    this.setState({inputSearch: e.target.value}, () => {
      this.startJobsApi()
    })
  }

  updateEmplyTypeApi = e => {
    const selectedEmplType = e.target
    const {empsFilterList} = this.state
    const formatSelectedEmpType = selectedEmplType.value
      .replace(' ', '')
      .toUpperCase()
    let updatedEmpFilterList
    if (selectedEmplType.checked) {
      updatedEmpFilterList = [...empsFilterList, formatSelectedEmpType]
    } else {
      updatedEmpFilterList = empsFilterList.filter(
        empType => empType !== formatSelectedEmpType,
      )
    }
    this.setState({empsFilterList: updatedEmpFilterList}, () => {
      this.startJobsApi()
    })
  }

  updateSalaryApi = e => {
    const selectedSalary = e.target
    if (selectedSalary.checked) {
      this.setState({salsFilter: selectedSalary.value}, () => {
        this.startJobsApi()
      })
    }
  }

  renderProfileBox = () => {
    const {profileData} = this.state
    return (
      <>
        {profileData ? (
          <div className="profile-box" id="profile-box">
            <img
              src={profileData.profile_image_url}
              alt="profile"
              className="profile-img"
            />
            <h3 className="profile-name">{profileData.name}</h3>
            <p className="profile-role">{profileData.short_bio}</p>
          </div>
        ) : (
          <div className="profile-box error-profile-box" id="profile-box">
            <button
              type="button"
              className="result-btn"
              onClick={() => this.startProfileApi()}
            >
              Retry
            </button>
          </div>
        )}
      </>
    )
  }

  renderLoading = () => (
    <div className="result-container loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailure = () => (
    <div className="result-container failure-container">
      <img
        className="result-main-img"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="result-heading">Oops! Something Went Wrong</h1>
      <p className="result-para">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="result-btn"
        onClick={() => this.startJobsApi()}
      >
        Retry
      </button>
    </div>
  )

  renderSuccess = () => {
    const {apiList} = this.state
    return apiList.total !== 0 ? (
      <ul className="result-container success-container">
        {apiList.jobs.map(eachItem => (
          <JobItem key={eachItem.id} jobItemInfo={eachItem} />
        ))}
      </ul>
    ) : (
      <div className="result-container nojobs-container">
        <img
          className="result-main-img"
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1 className="result-heading">No Jobs Found</h1>
        <p className="result-para">
          We could not find any jobs. Try Other filters
        </p>
      </div>
    )
  }

  rendersFunc = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusList.in_progress:
        return this.renderLoading()
      case apiStatusList.success:
        return this.renderSuccess()
      case apiStatusList.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    const {inputSearch} = this.state
    return (
      <div className="container">
        <Header />
        <div className="jobs-container">
          <div className="jobs-side1-box">
            <div className="search-input-box mobile-search-input-box">
              <input
                type="search"
                className="search-input"
                placeholder="Search"
                value={inputSearch}
                onChange={e => this.setState({inputSearch: e.target.value})}
              />
              <button
                type="button"
                className="search-btn"
                data-testid="searchButton"
                onClick={this.startJobsApi}
              >
                <BsSearch className="search-icon" size={25} color="#fff" />
              </button>
            </div>
            {this.renderProfileBox()}
            <hr className="jobs-line" />
            <div className="filter-types-box">
              <h1 className="filter-head">Type of Employment</h1>
              <ul className="filter-ul-box">
                {employmentTypesList.map(eachItem =>
                  this.filterEmpCBox(eachItem),
                )}
              </ul>
            </div>
            <hr className="jobs-line" />
            <div className="filter-types-box">
              <h1 className="filter-head">Salary Range</h1>
              <ul className="filter-ul-box">
                {salaryRangesList.map(eachItem => this.filterSalCBox(eachItem))}
              </ul>
            </div>
          </div>

          <div className="jobs-side2-box">
            <div className="desktop-search-input-outerbox">
              <div className="search-input-box desktop-search-input-box">
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search"
                  value={inputSearch}
                  onChange={this.updateSearchInput}
                />
                <button
                  type="button"
                  className="search-btn"
                  data-testid="searchButton"
                  onClick={this.startJobsApi}
                >
                  <BsSearch className="search-icon" size={25} color="#fff" />
                </button>
              </div>
            </div>
            <div className="jobs-results-container">{this.rendersFunc()}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
