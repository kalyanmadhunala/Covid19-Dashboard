import {Link} from 'react-router-dom'
import {BiChevronRightSquare} from 'react-icons/bi'
import './index.css'

const SearchResult = props => {
  const {stateName, stateCode} = props

  return (
    <li className="search-result-list-content">
      <Link to={`/state/${stateCode}`} className="link-search">
        <div className="search-result">
          <h1 className="search-result-heading font-face-gm">{stateName}</h1>
          <div className="search-button">
            <p className="state-code">{stateCode}</p>
            <BiChevronRightSquare
              testid="searchResultChevronRightIcon"
              className="icon-right"
            />
          </div>
        </div>
      </Link>
    </li>
  )
}

export default SearchResult
