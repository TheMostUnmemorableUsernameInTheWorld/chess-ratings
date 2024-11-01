import './Recent.css';
import { React, useState, useEffect } from 'react';
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

  const nameSort = (arr, fafb, fbfa) => {
    return (arr.sort((a, b) => {
        let fa = a.name.toLowerCase(),
            fb = b.name.toLowerCase();

        if (fa < fb) {
            return fafb;
        } 

        if (fa > fb) {
            return fbfa;
        }

        return 0;
    }))
  }

  const dateSort = (arr, reversed) => {
    return (arr.sort((a, b) => {
        let da = new Date(+a.points.at(-1)[0], +a.points.at(-1)[1] - 1, +a.points.at(-1)[2]),
            db = new Date(+b.points.at(-1)[0], +b.points.at(-1)[1] - 1, +b.points.at(-1)[2]);
        return reversed ? db - da : da - db;
    }))
  }

  const numSort = (arr, reversed) => {
    return (arr.sort((a, b) => {
        return reversed ? b.points.at(-1)[3] - a.points.at(-1)[3] : a.points.at(-1)[3] - b.points.at(-1)[3];
    }))
  }

   const sort = (state, col) => {
    if (state === 'asc') {
        if (col === 'variant') {
            const newRatings = nameSort(Object.values(ratings).filter(o => o.points.length), -1, 1);
            setRatings(newRatings);
        } else if (col === 'date') {
            const newRatings = dateSort(Object.values(ratings).filter(o => o.points.length), false);
            setRatings(newRatings);
        } else {
            const newRatings = numSort(Object.values(ratings).filter(o => o.points.length), false);
            setRatings(newRatings);
        }
    } else if (state === 'dsc') {
        if (col === 'variant') {
            const newRatings = nameSort(Object.values(ratings).filter(o => o.points.length), 1, -1);
            setRatings(newRatings);
        } else if (col === 'date') {
            const newRatings = dateSort(Object.values(ratings).filter(o => o.points.length), true);
            setRatings(newRatings);
        } else {
            const newRatings = numSort(Object.values(ratings).filter(o => o.points.length), true);
            setRatings(newRatings);
        }
    }
  }

  const fetchRatings = (state, sortee) => {
    fetch('https://lichess.org/api/user/ViciousWolf192/rating-history')
      .then (response => {
        return response.json()
      })
      .then (data => {
        if (state === 'default' && sortee === 'default') {
            setRatings(data);
            setHeaders(["Variant", "Date", "Rating"]);
            setLoaded(true);
        } else if (state === 'dsc') {
            if (sortee === 'variant') {
                sort('dsc', 'variant');
            } else if (sortee === 'date') {
                sort('dsc', 'date');
            } else {
                sort('dsc', 'rating');
            }
        } else {
            if (sortee === 'variant') {
                sort('asc', 'variant');
            } else if (sortee === 'date') {
                sort('asc', 'date');
            } else {
                sort('asc', 'rating');
            }
        }
      });
  }

  useEffect(() => {
    fetchRatings('default', 'default')
  }, []);

  function vCycle(vState) {
    if (vState === 'default') {
        setVState('dsc');
        setDState('default');
        setRState('default');
        fetchRatings('dsc', 'variant');
    } else if (vState === 'dsc') {
        setVState('asc');
        fetchRatings('asc', 'variant');
    } else {
        setVState('default');
        fetchRatings('default', 'default');
    }
  }

  function dCycle(dState) {
    if (dState === 'default') {
        setDState('dsc');
        setVState('default');
        setRState('default');
        fetchRatings('dsc', 'date');
    } else if (dState === 'dsc') {
        setDState('asc');
        fetchRatings('asc', 'date');
    } else {
        setDState('default');
        fetchRatings('default', 'default');
    }
  }

  function rCycle(rState) {
    if (rState === 'default') {
        setRState('dsc');
        setVState('default');
        setDState('default');
        fetchRatings('dsc', 'rating');
    } else if (rState === 'dsc') {
        setRState('asc');
        fetchRatings('asc', 'rating');
    } else {
        setRState('default');
        fetchRatings('default', 'default');
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
                  <tr key={item.name}>
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
