import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

const App = () => {
  const [path, setPath] = useState([]);
  const [entries, setEntries] = useState([]);

  useEffect(() => fetchEntries(), [path]);

  const fetchEntries = () => {
    let url = 'http://localhost:5000/';
    if (path !== undefined && path.length > 0) {
      url += `?path=${path.join('/')}`
    }

    fetch(url)
      .then(response => response.json())
      .then(data => {
        data.unshift({ name: "..", type: "DIRECTORY"});
        setEntries(data);
      })
      .catch(err => console.log(err));
  }

  const loadNewEntries = (e, entry) => {
    e.preventDefault();
      if (entry.type === 'DIRECTORY') {
        if (entry.name === '..') {
        setPath(oldPath => oldPath.splice(-1, 1));
      } else {
        setPath(oldPath => [...oldPath, entry.name]);
      }
    }
  };

  return (
    <div>
      <ul>
        {entries && entries.length > 0 && entries.map((entry, idx) => 
          <li key={`${entry.name}-${idx}`}><a href="" onClick={(e) => loadNewEntries(e, entry)}>{entry.name} ({entry.type})</a></li>
        )}
      </ul>
    </div>
  );
}

export default App;
