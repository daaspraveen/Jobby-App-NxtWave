import {Link} from 'react-router-dom'
import {BsBriefcaseFill} from 'react-icons/bs'
import {IoLocationSharp} from 'react-icons/io5'
import {FaStar} from 'react-icons/fa'
import './index.css'

const JobItem = props => {
  const {jobItemInfo} = props
  const {id, location, rating, title} = jobItemInfo
  const companyLogoUrl = jobItemInfo.company_logo_url
  const employmentType = jobItemInfo.employment_type
  const jobDescription = jobItemInfo.job_description
  const packagePerAnnum = jobItemInfo.package_per_annum
  return (
    <Link to={`/jobs/${id}`} className="result-li-link">
      <li className="result-li-box">
        <div className="result-li-headbox">
          <img
            className="result-li-img"
            src={companyLogoUrl}
            alt="company logo"
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
            {location} &nbsp; &nbsp; &nbsp;
            <BsBriefcaseFill size={20} />
            {employmentType}
          </p>
          <p className="result-li-spanLpa">{packagePerAnnum}</p>
        </div>
        <hr className="jobs-line" />
        <h4 className="result-desc-head">Description</h4>
        <p className="result-desc-para">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItem
