import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

class About extends Component {
  state = {faqData: [], isLoading: true}

  componentDidMount() {
    this.getAboutFaqsData()
  }

  getAboutFaqsData = async () => {
    const apiUrl = 'https://apis.ccbp.in/covid19-faqs'
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    console.log(response)
    const data = await response.json()
    console.log(data)
    const formattedData = data.faq.map(each => ({
      answer: each.answer,
      category: each.category,
      qno: each.qno,
      question: each.question,
    }))
    this.setState({faqData: formattedData, isLoading: false})
  }

  renderFaqData = () => {
    const {faqData} = this.state
    return (
      <ul className="faqs-list-container" testid="faqsUnorderedList">
        {faqData.map(each => (
          <li className="faqs-list" key={each.qno}>
            <h1 className="faqs-question">{each.question}</h1>
            <p className="faqs-answer">{each.answer}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderLoader = () => (
    <>
      <div className="loader-container" testid="aboutRouteLoader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </>
  )

  render() {
    const {isLoading} = this.state
    return (
      <div className="about-container">
        <Header />

        <div className="main-container">
          <div className="container">
            <h1 className="about-heading">About</h1>
            <p className="about-description">Last update on march 28th 2021.</p>
            <p className="about-vaccine-title">
              COVID-19 vaccines be ready for distribution
            </p>
          </div>
          <div>{isLoading ? this.renderLoader() : this.renderFaqData()}</div>
          <Footer />
        </div>
      </div>
    )
  }
}
export default About
