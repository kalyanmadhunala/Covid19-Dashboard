import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import {FcGenericSortingAsc, FcGenericSortingDesc} from 'react-icons/fc'
import Header from '../Header'
import Footer from '../Footer'
import SearchResult from '../SearchResult'
import './index.css'

const statesList = [
  {
    state_code: 'AN',
    state_name: 'Andaman and Nicobar Islands',
  },
  {
    state_code: 'AP',
    state_name: 'Andhra Pradesh',
  },
  {
    state_code: 'AR',
    state_name: 'Arunachal Pradesh',
  },
  {
    state_code: 'AS',
    state_name: 'Assam',
  },
  {
    state_code: 'BR',
    state_name: 'Bihar',
  },
  {
    state_code: 'CH',
    state_name: 'Chandigarh',
  },
  {
    state_code: 'CT',
    state_name: 'Chhattisgarh',
  },
  {
    state_code: 'DN',
    state_name: 'Dadra and Nagar Haveli and Daman and Diu',
  },
  {
    state_code: 'DL',
    state_name: 'Delhi',
  },
  {
    state_code: 'GA',
    state_name: 'Goa',
  },
  {
    state_code: 'GJ',
    state_name: 'Gujarat',
  },
  {
    state_code: 'HR',
    state_name: 'Haryana',
  },
  {
    state_code: 'HP',
    state_name: 'Himachal Pradesh',
  },
  {
    state_code: 'JK',
    state_name: 'Jammu and Kashmir',
  },
  {
    state_code: 'JH',
    state_name: 'Jharkhand',
  },
  {
    state_code: 'KA',
    state_name: 'Karnataka',
  },
  {
    state_code: 'KL',
    state_name: 'Kerala',
  },
  {
    state_code: 'LA',
    state_name: 'Ladakh',
  },
  {
    state_code: 'LD',
    state_name: 'Lakshadweep',
  },
  {
    state_code: 'MH',
    state_name: 'Maharashtra',
  },
  {
    state_code: 'MP',
    state_name: 'Madhya Pradesh',
  },
  {
    state_code: 'MN',
    state_name: 'Manipur',
  },
  {
    state_code: 'ML',
    state_name: 'Meghalaya',
  },
  {
    state_code: 'MZ',
    state_name: 'Mizoram',
  },
  {
    state_code: 'NL',
    state_name: 'Nagaland',
  },
  {
    state_code: 'OR',
    state_name: 'Odisha',
  },
  {
    state_code: 'PY',
    state_name: 'Puducherry',
  },
  {
    state_code: 'PB',
    state_name: 'Punjab',
  },
  {
    state_code: 'RJ',
    state_name: 'Rajasthan',
  },
  {
    state_code: 'SK',
    state_name: 'Sikkim',
  },
  {
    state_code: 'TN',
    state_name: 'Tamil Nadu',
  },
  {
    state_code: 'TG',
    state_name: 'Telangana',
  },
  {
    state_code: 'TR',
    state_name: 'Tripura',
  },
  {
    state_code: 'UP',
    state_name: 'Uttar Pradesh',
  },
  {
    state_code: 'UT',
    state_name: 'Uttarakhand',
  },
  {
    state_code: 'WB',
    state_name: 'West Bengal',
  },
]

class Home extends Component {
  state = {
    totalActiveCases: 0,
    totalConfirmedCases: 0,
    totalRecoveredCases: 0,
    totalDeceasedCases: 0,
    statesInfo: [],
    isLoading: true,
    search: '',
    filterSearchResult: [],
  }

  componentDidMount() {
    this.getTheCovidStateData()
  }

  getTheCovidStateData = async () => {
    const apiUrl = 'https://apis.ccbp.in/covid19-state-wise-data'
    const options = {
      method: 'GET',
    }

    // Sending a GET request to the API using the fetch function
    const response = await fetch(apiUrl, options)

    // Checking if the response from the API is successful (status code 200)
    if (response.ok) {
      // Parsing the response body as JSON
      const data = await response.json()

      // Initializing variables to store aggregated data for national wide statistics
      let nationalWideCovidConfirmedCases = 0
      let nationalWideCovidRecoveredCases = 0
      let nationalWideCovidDeceasedCases = 0
      let nationalWideCovidActiveCases = 0

      // Iterating through the statesList array to calculate national wide statistics
      statesList.forEach(state => {
        if (data[state.state_code]) {
          const {total} = data[state.state_code]
          nationalWideCovidConfirmedCases += total.confirmed
            ? total.confirmed
            : 0
          nationalWideCovidRecoveredCases += total.recovered
            ? total.recovered
            : 0
          nationalWideCovidDeceasedCases += total.deceased ? total.deceased : 0
        }
      })

      // Calculating the active cases as the difference between confirmed and recovered/deceased cases
      nationalWideCovidActiveCases +=
        nationalWideCovidConfirmedCases -
        (nationalWideCovidRecoveredCases + nationalWideCovidDeceasedCases)

      // Creating an array of state-wise data with specific properties
      const states = statesList.map(each => ({
        stateName: each.state_name,
        stateCode: each.state_code,
        confirmed: Object.keys(data)
          .filter(state => state === each.state_code)
          .map(e => data[e].total.confirmed),
        recovered: Object.keys(data)
          .filter(state => state === each.state_code)
          .map(e => data[e].total.recovered),
        deceased: Object.keys(data)
          .filter(state => state === each.state_code)
          .map(e => data[e].total.deceased),
        other: Object.keys(data)
          .filter(state => state === each.state_code)
          .map(e => data[e].total.other),
        population: Object.keys(data)
          .filter(state => state === each.state_code)
          .map(e => data[e].meta.population),
      }))

      // Updating the component state with the aggregated data and states information
      this.setState({
        totalActiveCases: nationalWideCovidActiveCases,
        totalRecoveredCases: nationalWideCovidRecoveredCases,
        totalDeceasedCases: nationalWideCovidDeceasedCases,
        totalConfirmedCases: nationalWideCovidConfirmedCases,
        isLoading: false,
        statesInfo: states,
      })
    } else {
      // Logging an error message to the console if the API request fails
      console.error('Failed to fetch data:', response.status)

      // Updating the component state to indicate that data loading is complete (regardless of success/failure)
      this.setState({isLoading: false})
    }
  }

  renderLoadingView = () => (
    <div className="products-details-loader-container" testid="homeRouteLoader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderNationCovidData = () => {
    const {
      totalConfirmedCases,
      totalActiveCases,
      totalRecoveredCases,
      totalDeceasedCases,
    } = this.state

    return (
      <>
        <div className="Covid-container" testid="countryWideConfirmedCases">
          <p className="stats-title red">Confirmed</p>
          <img
            src="https://res.cloudinary.com/dzfr8ujso/image/upload/v1650906699/check-mark_1_o3kbj1.png"
            className="stats-icon"
            alt="country wide confirmed cases pic"
          />
          <p className="stats-number red">{totalConfirmedCases}</p>
        </div>
        <div testid="countryWideActiveCases" className="Covid-container">
          <p className="stats-title blue">Active</p>
          <img
            src="https://res.cloudinary.com/dzfr8ujso/image/upload/v1650906741/protection_1_re7mxu.png"
            className="stats-icon"
            alt="country wide active cases pic"
          />
          <p className="stats-number blue">{totalActiveCases}</p>
        </div>
        <div testid="countryWideRecoveredCases" className="Covid-container">
          <p className="stats-title green">Recovered</p>
          <img
            src="https://res.cloudinary.com/dzfr8ujso/image/upload/v1650906752/recovered_1_kpsqyj.png"
            className="stats-icon"
            alt="country wide recovered cases pic"
          />
          <p className="stats-number green">{totalRecoveredCases}</p>
        </div>
        <div testid="countryWideDeceasedCases" className="Covid-container">
          <p className="stats-title gray">Deceased</p>
          <img
            src="https://res.cloudinary.com/dzfr8ujso/image/upload/v1650906686/breathing_1_dkacsd.png"
            className="stats-icon"
            alt="country wide deceased cases pic"
          />
          <p className="stats-number gray">{totalDeceasedCases}</p>
        </div>
      </>
    )
  }

  showSearchList = () => {
    const {filteredSearchList} = this.state

    return (
      <ul
        className="search-result-container"
        testid="searchResultsUnorderedList"
      >
        {filteredSearchList.map(each => (
          <Link to={`/state/${each.state_code}`}>
            <SearchResult
              key={each.state_code}
              stateName={each.state_name}
              stateCode={each.state_code}
              id={each.state_code}
            />
          </Link>
        ))}
      </ul>
    )
  }

  whenButtonClicked = ascOrder => {
    const {statesInfo} = this.state
    const sortedStates = [...statesInfo].sort((a, b) => {
      const x = a.stateName.toUpperCase()
      const y = b.stateName.toUpperCase()

      if (ascOrder) {
        return x > y ? 1 : -1
      }
      return x < y ? 1 : -1
    })

    this.setState({
      statesInfo: sortedStates,
    })
  }

  renderAllStateCovidList = () => {
    const {statesInfo} = this.state
    return (
      <div
        className="state-wise-table-Covid-container"
        testid="stateWiseCovidDataTable"
      >
        <div className="table-header">
          <div className="table-heading-container">
            <p className="table-header-title">States/UT</p>
            <button
              type="button"
              className="order-btn"
              testid="ascendingSort"
              onClick={() => this.whenButtonClicked(true)}
            >
              <FcGenericSortingAsc className="order-icon" />
            </button>
            <button
              type="button"
              className="order-btn"
              testid="descendingSort"
              onClick={() => this.whenButtonClicked(false)}
            >
              <FcGenericSortingDesc className="order-icon" />
            </button>
          </div>
          <div className="table-tittle-content">
            <p className="table-header-title">Confirmed</p>
          </div>
          <div className="table-tittle-content">
            <p className="table-header-title">Active</p>
          </div>
          <div className="table-tittle-content">
            <p className="table-header-title">Recovered</p>
          </div>
          <div className="table-tittle-content">
            <p className="table-header-title">Deceased</p>
          </div>
          <div className="table-tittle-content">
            <p className="table-header-title">Population</p>
          </div>
        </div>
        <hr />
        {/* here to get the column wise details */}

        <ul className="state-wise-Covid-lists">
          {statesInfo.map(each => (
            <li key={each.state_code} className="state-list-content">
              <p className="state-Covid-details">{each.stateName}</p>
              <div className="home-column">
                <p className="confirmed-Covid-details">{each.confirmed}</p>
              </div>
              <div className="home-column">
                {/* here to find the Covid active cases  */}
                <p className="active-Covid-details">
                  {each.confirmed - each.recovered - each.deceased - each.other}
                </p>
              </div>
              <div className="home-column">
                <p className="recovered-Covid-details">{each.recovered}</p>
              </div>
              <div className="home-column">
                <p className="deceased-Covid-details">{each.deceased}</p>
              </div>
              <div className="home-column">
                <p className="population-Covid-details">{each.population}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  onSearchInput = event => {
    const searchItem = event.target.value
    const searchResult = statesList.filter(each =>
      each.state_name.toLowerCase().includes(searchItem.toLowerCase()),
    )
    this.setState({filterSearchResult: searchResult})
  }

  removeFilteredList = () => {
    this.setState({filterSearchResult: []})
  }

  render() {
    const {isLoading, search, filterSearchResult} = this.state

    // Render the SearchResult components based on filterSearchResult
    const showSearchList = filterSearchResult.map(each => (
      <SearchResult
        key={each.state_code}
        stateName={each.state_name}
        stateCode={each.state_code}
        id={each.state_code}
      />
    ))

    return (
      <div className="Home-container">
        <Header />
        <div className="container">
          <div className="main-container">
            <div className="search-container">
              <BsSearch data-testid="searchIcon" className="search-icon" />
              <input
                type="search"
                className="input"
                onChange={this.onSearchInput}
                placeholder="Enter the State"
              />
            </div>
          </div>
          {search.length > 0 ? showSearchList : ''}
          {showSearchList}
          {isLoading ? (
            this.renderLoadingView()
          ) : (
            <>
              <div className="country-states">
                {this.renderNationCovidData()}
              </div>
              <div>{this.renderAllStateCovidList()}</div>
            </>
          )}
        </div>
        <Footer />
      </div>
    )
  }
}
export default Home
