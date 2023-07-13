import './Recent.css';
import { React, useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'

import * as fetch from 'node-fetch';

function Recent() {
  const [ratings, setRatings] = useState({});
  const [headers, setHeaders] = useState([""]);
  const [loaded, setLoaded] = useState(false);
  const [vState, setVState] = useState('default');
  const [dState, setDState] = useState('default');
  const [rState, setRState] = useState('default');

  const fetchRatings = () => {
    fetch('https://lichess.org/api/user/ViciousWolf192/rating-history')
      .then (response => {
        return response.json()
      })
      .then (data => {
        setRatings(data);
        setHeaders(["Variant", "Date", "Rating"]);
        setLoaded(true);
      });
  }

  useEffect(() => {
    fetchRatings()
  }, []);

  function vCycle(vState) {
    if (vState === 'default') {
        setVState('dsc');
        setDState('default');
        setRState('default');
    } else if (vState === 'dsc') {
        setVState('asc');
    } else {
        setVState('default');
    }
  }

  function dCycle(dState) {
    if (dState === 'default') {
        setDState('dsc');
        setVState('default');
        setRState('default');
    } else if (dState === 'dsc') {
        setDState('asc');
    } else {
        setDState('default');
    }
  }

  function rCycle(rState) {
    if (rState === 'default') {
        setRState('dsc');
        setVState('default');
        setDState('default');
    } else if (rState === 'dsc') {
        setRState('asc');
    } else {
        setRState('default');
    }
  }
  return (
    <div className="container" style={{display: loaded ? 'flex' : 'none'}}>
      <h2>Most Recent</h2>
      <table>
        <thead>
          <tr>
            <th onClick={() => vCycle(vState)}>{headers[0]} <span><FontAwesomeIcon fixedWidth transform="shrink-3" icon={vState === 'default' ? faSort : vState === 'asc' ? faSortUp : faSortDown} /></span></th>
            <th onClick={() => dCycle(dState)}>{headers[1]} <span><FontAwesomeIcon fixedWidth transform="shrink-3" icon={dState === 'default' ? faSort : dState === 'asc' ? faSortUp : faSortDown} /></span></th>
            <th onClick={() => rCycle(rState)}>{headers[2]} <span><FontAwesomeIcon fixedWidth transform="shrink-3" icon={rState === 'default' ? faSort : rState === 'asc' ? faSortUp : faSortDown} /></span></th>
          </tr>
        </thead>
        <tbody>
           {Object.values(ratings).filter(o => o.points.length).map((item) => {
                return (
                  <tr key={uuidv4()}>
                    <td className="variant">{item.name}</td>
                    <td className='date'>{item.points.at(-1)[1] + 1 + "/" + item.points.at(-1)[2] + "/" + item.points.at(-1)[0].toString().slice(2, 4) }</td>
                    <td className='rating'>{item.points.at(-1)[3]}</td>
                  </tr>
                )
           }) ?? null}
        </tbody>
      </table>
    </div>
  );
}

// const displayInfo = () => (
  
// )

export default Recent;
