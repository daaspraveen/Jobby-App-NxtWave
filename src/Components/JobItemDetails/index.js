import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import {BsBriefcaseFill} from 'react-icons/bs'
import {HiExternalLink} from 'react-icons/hi'
import {IoLocationSharp} from 'react-icons/io5'
import {FaStar} from 'react-icons/fa'

import Header from '../Header'
import './index.css'

const apiStatusList = {
  intial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const SimilarJobItem = props => {
  const {similarJobDetails} = props
  const {id, location, title, rating} = similarJobDetails
  const companyLogoUrl = similarJobDetails.company_logo_url
  const employmentType = similarJobDetails.employment_type
  const jobDescription = similarJobDetails.job_description
  return (
    <Link to={`/jobs/${id}`} className="similar-jobcard-link">
      <li className="similar-li-jobCard">
        <div className="result-li-headbox">
          <img
            className="result-li-img similar-li-img"
            src={companyLogoUrl}
            alt="similar job company logo"
          />
          <div className="result-li-headsidebox">
            <h4 className="star-img-head">{title}</h4>
            <p className="star-img-box">
              <FaStar size={20} color="#fbbf24" />
              {rating}
            </p>
          </div>
        </div>
        <h2 className="result-desc-head">Description</h2>
        <p className="result-desc-para similar-li-descPara">{jobDescription}</p>
        <div className="result-li-spansBox similar-li-spansBox">
          <p className="result-li-spanPara similar-li-spanPara">
            <IoLocationSharp size={20} />
            {location}
          </p>
          <p className="result-li-spanPara similar-li-spanPara">
            <BsBriefcaseFill size={20} />
            {employmentType}
          </p>
        </div>
      </li>
    </Link>
  )
}

class JobItemDetails extends Component {
  state = {apiStatus: apiStatusList.intial, apiList: []}

  componentDidMount() {
    this.obtainJobId()
  }

  componentDidUpdate(prevProps) {
    const {match} = this.props
    const {id} = match.params
    if (prevProps.match.params.id !== id) {
      this.startJobIdApi(id)
    }
  }

  obtainJobId = () => {
    const {match} = this.props
    const {id} = match.params
    this.startJobIdApi(id)
  }

  startJobIdApi = async id => {
    this.setState({apiStatus: apiStatusList.loading})
    const url = `https://apis.ccbp.in/jobs/${id}`
    const cookieToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookieToken}`,
        'Content-Type': 'Application/json',
      },
    }
    const fetchJobIdData = await fetch(url, options)
    if (fetchJobIdData.ok) {
      const jobIdApiResp = await fetchJobIdData.json()
      // console.log(jobIdApiResp)
      this.setState({apiList: jobIdApiResp, apiStatus: apiStatusList.success})
    } else {
      // console.log('error1:')
      this.setState({apiStatus: apiStatusList.failure, apiList: []})
    }
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
      <h3 className="result-heading">Oops! Something Went Wrong</h3>
      <p className="result-para">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="result-btn"
        onClick={() => this.obtainJobId()}
      >
        Retry
      </button>
    </div>
  )

  renderSuccess = () => {
    const {apiList} = this.state
    const similarJobsList = apiList.similar_jobs
    return (
      <div className="success-JobDetails-container">
        {this.renderJobIdMainBox(apiList.job_details)}
        <h2 className="similar-job-heading">Similar Jobs</h2>
        <ul className="similar-jobs-ul">
          {similarJobsList.map(eachItem => (
            <SimilarJobItem key={eachItem.id} similarJobDetails={eachItem} />
          ))}
        </ul>
      </div>
    )
  }

  renderJobIdMainBox = jobDetailsList => {
    const {location, title, rating, skills} = jobDetailsList
    const companyLogoUrl = jobDetailsList.company_logo_url
    const companyWebsiteUrl = jobDetailsList.company_website_url
    const employmentType = jobDetailsList.employment_type
    const jobDescription = jobDetailsList.job_description
    const lifeAtCompanyDesc = jobDetailsList.life_at_company.description
    const lifeAtCompanyImageUrl = jobDetailsList.life_at_company.image_url
    const packagePerAnnum = jobDetailsList.package_per_annum

    return (
      <div className="result-li-box">
        <div className="result-li-headbox">
          <img
            className="result-li-img"
            src={companyLogoUrl}
            alt="job details company logo"
          />
          <div className="result-li-headsidebox">
            <h4 className="star-img-head">{title}</h4>
            <p className="star-img-box">
              <FaStar size={20} color="#fbbf24" />
              {rating}
            </p>
          </div>
        </div>
        <div className="result-li-spansBox">
          <p className="result-li-spanPara">
            <IoLocationSharp size={20} />
            {location} &nbsp; &nbsp;
            <BsBriefcaseFill size={20} />
            {employmentType}
          </p>
          <p className="result-li-spanLpa">{packagePerAnnum}</p>
        </div>
        <hr className="jobs-line" />
        <div className="result-desc-head-box">
          <h3 className="result-desc-head job-skills-head">Description</h3>
          <a
            href={companyWebsiteUrl}
            className="result-mainJob-Link"
            target="__blank"
          >
            Visit
            <HiExternalLink size={20} />
          </a>
        </div>
        <p className="result-desc-para">{jobDescription}</p>
        <h4 className="result-desc-head job-skills-head">Skills</h4>
        <ul className="job-skills-ul">
          {skills.map(eachItem => (
            <li key={eachItem.name} className="skills-li-box">
              <img
                className="skills-li-img"
                src={eachItem.image_url}
                alt={eachItem.name}
                width="30px"
              />
              <p className="skills-li-para">{eachItem.name}</p>
            </li>
          ))}
        </ul>
        <h4 className="result-desc-head job-life-head">Life at Company</h4>
        <div className="job-lifeAtCompany-box">
          <p className="job-lifeAtCompany-descPara">{lifeAtCompanyDesc}</p>
          <img
            className="job-lifeAtCompany-img"
            src={lifeAtCompanyImageUrl}
            alt="life at company"
          />
        </div>
      </div>
    )
  }

  rendersFunc = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusList.loading:
        return this.renderLoading()
      case apiStatusList.success:
        return this.renderSuccess()
      case apiStatusList.failure:
        return this.renderFailure()
      default:
        return this.renderFailure()
    }
  }

  render() {
    return (
      <div className="container">
        <Header />
        <div className="jobItem-container">{this.rendersFunc()}</div>
      </div>
    )
  }
}

export default withRouter(JobItemDetails)
