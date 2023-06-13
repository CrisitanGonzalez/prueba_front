import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Typography} from '@mui/material';
import DataList from './Datalist';


function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL + "task" ;
      const response = await axios.get(apiUrl);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Router>
      <div>
        <Typography variant="h3" component="h3" gutterBottom>
          Mantenedor de Datos
        </Typography>
        

        <Switch>
          <Route exact path="/">
            <DataList data={data} loading={loading} setData={setData} setSelectedItem={setSelectedItem} selectedItem={selectedItem}/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
