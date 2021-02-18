import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

const App = () => {
  const [path, setPath] = useState("/");
  const [entries, setEntries] = useState([]);

  useEffect(() => fetchEntries(), []);

  const fetchEntries = path => {
    let url = 'http://localhost:5000/';
    if (path !== undefined) {
      url += `?path=${path}`
    }
    console.log(url);
    fetch(url)
      .then(response => response.json())
      .then(data => {
        data.unshift({ name: "..", type: "DIRECTORY"});
        setEntries(data);
      })
      .catch(err => console.log(err));
  }

  const loadNewEntries = (e, path) => {
    e.preventDefault();
    fetchEntries(path);
  };

  return (
    <div>
      <ul>
        {entries && entries.length > 0 && entries.map((entry, idx) => 
          <li key={`${entry.name}-${idx}`}><a href="" onClick={(e) => loadNewEntries(e, entry.name)}>{entry.name} ({entry.type})</a></li>
        )}
      </ul>
    </div>
  );
}

export default App;
