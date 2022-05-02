import React,{useState,useEffect} from 'react';
import {FormControl,Select,MenuItem ,Card,CardContent} from "@material-ui/core"
import './App.css';
import InfoBox from "./InfoBox";
import Table from "./Table";
import {sortData} from "./utils";
import LineGraph from "./LineGraph";
import Map from "./Map";
import "leaflet/dist/leaflet.css"
function App() {
  const [countries,setCountries] = useState([]);
  const[country,setCountry] = useState("worldwide");
  const[countryInfo,setCountryInfo] = useState({});
  const[tableData,setTableData] = useState([]);
  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response)=>response.json())
    .then((data)=>{
      setCountryInfo(data);
    })
  },[])
  useEffect(() => {
    const getCountriesData = async() => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data)=> {
        const countries = data.map((country) =>(
            {
              name: country.country,
              value : country.countryInfo.iso2,
            } ));
            const sortedData =sortData(data);
            setTableData(sortedData);
            setCountries(countries);
      });
    }
    getCountriesData();
  },[]);
  const onCountryChange = async(event)=>{
    const countryCode = event.target.value;
    setCountry(countryCode);
    const url = countryCode === "worldwide" ?"https://disease.sh/v3/covid-19/all"  : `https://disease.sh/v3/covid-19/countries/${countryCode}` ;
    await fetch(url)
    .then((response)=> response.json())
    .then((data)=>{
      setCountry(countryCode);
      setCountryInfo(data);
     
    })
    
  };
  console.log(countryInfo);
  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1> COVID TRACKER</h1>
          <FormControl className="app_dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}> 
            <MenuItem value="worldwide">Worldwide</MenuItem>            
                  {countries.map((country) => (
                    <MenuItem value={country.value}>{country.name}</MenuItem>
                  ))}
            </Select>
          </FormControl>
        </div>
        <div className="app_stats">
              <InfoBox title="CoronaVirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases}/>
              <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>
              <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
        </div>
        <Map />
      </div>
      <Card className="app_right">
        <CardContent>
          <h3>World wide cases</h3>
          <Table countries={tableData}/>
          <LineGraph casesType="cases"/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
