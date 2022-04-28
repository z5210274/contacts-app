import './App.css';
import React, { useEffect, useState } from "react";
import { Collapse, Button } from "reactstrap";
import { DropdownButton, Dropdown } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import sorter from "sort-nested-json";

const contactsUrl = "https://jsonplaceholder.typicode.com/users/"

// I know it is very important for Reactjs break down this one App.js into multiple components in different files and directories.
// I would do that but I do not have the time to refactor.

function App() {
  // Set states for reading Json and page conditionals
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [users, setUsers] = useState([]);
    const [userAddress, setUserAddress] = useState([]);
    const [userCompany, setUserCompany] = useState([]);

    // Read Json
    useEffect(() => {
        fetch(contactsUrl)
            .then(res => res.json())
            .then(
                (data) => {
                    setIsLoaded(true);
                    setUsers(data);
                    setUserAddress(data.address);
                    setUserCompany(data.company);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
      }, [])
    
    // Query URL to set functionality of page to Search or Sort or basic
    const { search } = window.location;
    const query = new URLSearchParams(search).get('s');
    const sortQuery = new URLSearchParams(search).get('c');
    const [searchQuery, setSearchQuery] = useState(query || '');
    // Return correct list of users
    const filteredUsers = filterUsers(users, searchQuery);
    var finalUsers = filteredUsers;
    
    // Sort based off chosen category
    if (sortQuery === 'name') {
      const sortedFiltered = sorter.sort(filteredUsers).asc('name');
      finalUsers = sortedFiltered;
    } else if (sortQuery === 'company') {
      const sortedFiltered = sorter.sort(filteredUsers).asc('company.name');
      finalUsers = sortedFiltered;
    } else if (sortQuery === 'location') {
      const sortedFiltered = sorter.sort(filteredUsers).asc('address.city');
      finalUsers = sortedFiltered;
    }

    //const sortedFiltered = filteredUsers.sort(sort_by('name', false, (a) =>  a.toUpperCase()));

  
    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else if (finalUsers.length === 0) { // No users to display
        return (
          <React.Fragment>
            <Navbar/>
            <div className="container">
              <br></br>
              <br></br>
              <br></br>
              <h5>Sorry, no matches were found</h5>
              <h6>Please search for Name, Username, Company or City</h6>
            </div>
          </React.Fragment>
        );
    } else { // Normal run
        return (
          <React.Fragment>
            <Navbar/>
            <div className="container">
              <br></br>
              <ul>
                {finalUsers.map(user => (
                  <div>
                    <li className="mycard" key={user.id}>
                      <h3>{user.name}</h3> 
                      <h6>{user.company.name}</h6>
                      <div className="expandable">
                        <CollapseCard user={user} style="float: right"/>
                      </div>
                    </li>
                  </div>
                ))}
              </ul>
            </div>
          </React.Fragment>
        );
    }
}

// Navigation bar at top containing home button, searchbar and sort dropdown
function Navbar() {
  return (
    <header className="header">
      <h1 class="logo"><a href="/">Resonate</a></h1>
      <SearchBar/>
      <ul className="main-nav">
        <li><p1 className='vertical-center'>Sort By:</p1></li>
        <li><MyDropdown/></li>
      </ul>
    </header>
  )
}

// Collapsible card for contacts to display on page
function CollapseCard(props) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div>
        <Button color="transparent" onClick={() => {
            setIsOpen(!isOpen)
        }}><img className='expand' src={isOpen ? require('./74158.png') : require('./545651.png')}>
          </img></Button>
        <Collapse isOpen={isOpen}>
          <div className="extra">
            <h6>Online Details:</h6>
            {props.user.username}
            <br></br>
            {props.user.website}
          </div>
          <div className="extra1">
            <h6>Address:</h6>
            {props.user.address.city}
            <br></br>
            {props.user.address.zipcode}
          </div>
          <br></br>
          <div className="extra">
            <h6>Contact Details:</h6>
            {props.user.phone}
            <br></br>
            {props.user.email}
          </div>
        </Collapse>
    </div>
  );
}

// Search Bar
const SearchBar = ({ searchQuery, setSearchQuery }) => (
  <form action="/" method="get">
      <label htmlFor="header-search">
          <span className="visually-hidden">Search contacts</span>
      </label>
      <input
          value={searchQuery}
          onInput={e => setSearchQuery(e.target.value)}
          type="text"
          id="header-search"
          placeholder="Search contacts..."
          name="s" 
      />
      <button type="submit">Search</button>
  </form>
);

// Return requested array of users
const filterUsers = (users, query) => {
  if (!query) {
      return users;
  }
  
  return users.filter((users) => {
      var usersName = users.name.toLowerCase();
      var usersCompany = users.company.name.toLowerCase();
      var usersUsername = users.username.toLowerCase();
      var usersCity = users.address.city.toLowerCase();

      var merged = usersName.concat(' ' + usersCompany + ' ' + usersUsername + ' ' + usersCity);
      return merged.includes(query.toLowerCase());
  });
};

// Prototype sort function
const sort_by = (field, reverse, primer) => {
  const key = primer ?
    function(x) {
      return primer(x[field])
    } :
    function(x) {
      return x[field]
    };

  reverse = !reverse ? 1 : -1;

  return function(a, b) {
    return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
  }
}

// Dropdown menu to choose how to sort contacts
function MyDropdown() {
  return (
    <div className='dropdown'>
      <DropdownButton className='dropbtn' id="dropdown-item-button btn" title="A-Z">
        <Dropdown.Item as="button"><a href="/?c=name">Name</a></Dropdown.Item>
        <Dropdown.Item as="button"><a href="/?c=location">Location</a></Dropdown.Item>
        <Dropdown.Item as="button"><a href="/?c=company">Company</a></Dropdown.Item>
      </DropdownButton>
    </div>
  )
}


export default App;
