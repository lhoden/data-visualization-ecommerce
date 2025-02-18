import { useState, useEffect } from 'react'
import './App.css'
import Map from './components/map/Map';
import StandardChart from './components/standard-chart/StandardChart';
import RainbowChart from './components/rainbow-chart/RainbowChart';
import PieChart from './components/pie-chart/PieChart';
import { Button } from '@mui/material';
import { csv } from "d3-fetch";
import * as am5 from "@amcharts/amcharts5";

function App() {
  const [mapIsActive, setMapIsActive] = useState(true);
  const [standardChartIsActive, setStandardChartIsActive] = useState(false);
  const [rainbowChartIsActive, setRainbowChartIsActive] = useState(false);
  const [pieChartIsActive, setPieChartIsActive] = useState(false);
  const [data, setData] = useState([]);
  const [mapChartData, setMapChartData] = useState<any[]>([]);
  const [rainbowChartData, setRainbowChartData] = useState<any[]>([]);
  const [pieChartData, setPieChartData] = useState<any[]>([]);
  const [overallRevenue, setOverallRevenue] = useState(0);
                
  useEffect(() => {
    csv('data.csv').then((data: any) => {
      setData(data);
      sectionChartData(data);
    });
  }, []);

  const handleMapToggle = (id: string) => {
    setMapIsActive(false);
    setStandardChartIsActive(false);
    setRainbowChartIsActive(false);
    setPieChartIsActive(false);
    if (id.includes('map')) {
      setMapIsActive(true);
    } else if (id.includes('standard')) {
      setStandardChartIsActive(true);
    } else if (id.includes('rainbow')) {
      setRainbowChartIsActive(true);
    } else if (id.includes('pie')) {
      setPieChartIsActive(true);
    }
  }

  // TODO: lets optimize this to go ahead and get the data for all the charts based on country 
  // we're already filtering based on the country name, lets get everything else too
  const sectionChartData = (data: any) => {
    let countries: any[] = [];
    let result: any[] = [];
    let organizedData: any[] = [];
    let dates: any[] = [];
    let datedData: any[] = [];
    let count = 0;
    let revenue = 0;
    data.forEach((invoice: any) => {
      if (!countries.includes(invoice['Country'])) {
        countries.push(invoice['Country']);
      } 
      // setting count of 20 so that we only pull the first 20 dates
      if (!dates.includes(invoice['InvoiceDate'].substring(0, invoice['InvoiceDate'].indexOf(' '))) && count < 21) {
        dates.push(invoice['InvoiceDate'].substring(0, invoice['InvoiceDate'].indexOf(' ')));
        count++;
      }
    });
    countries.forEach((country) => {
      let sum = 0;
      // Take the data and filter by the current country
      // Then add all the unit prices together
      // Then append the sum and the country name to the result array
      const filterByCountry = data.filter((invoice: any) => invoice['Country'] === country);
      filterByCountry.forEach((invoice: any) => {
        sum += parseFloat(invoice['UnitPrice']);
        revenue += parseFloat(invoice['UnitPrice']);
      });
      result.push({value: sum, category: country});
      // An array of arrays so that we can send this to the map and allow the user to click 
      // a location and a dialog will pop up with a table of the rows associated with that country
      organizedData.push(filterByCountry);
    });
    // Getting the total # of orders for each date 
    dates.forEach((date) => {
      let newDate = new Date(date);
      am5.time.add(newDate, "day", 1);
      const filterByDate = data.filter((invoice: any) => invoice['InvoiceDate'].substring(0, invoice['InvoiceDate'].indexOf(' ')) === date);
      datedData.push({date: newDate.getTime(), value: filterByDate.length});
    });
    console.log('curious about this: ', revenue);
    setOverallRevenue(revenue);
    setPieChartData(result);
    setMapChartData(organizedData);
    setRainbowChartData(datedData);
  }
  
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // maybe try loading the data here and then passing it to each individual component ... 
  // try this but ultimately recognize that it might be better to go ahead and pass it in for each individual component

  return (
    <>
      <Button onClick={() => {handleMapToggle('map')}}>Map</Button>
      {/* <Button onClick={() => {handleMapToggle('standard')}}>Standard Chart</Button> */}
      <Button onClick={() => {handleMapToggle('rainbow')}}>Rainbow Chart</Button>
      <Button onClick={() => {handleMapToggle('pie')}}>Pie Chart</Button>
      {mapIsActive &&
        <Map data={mapChartData} />
      }
      {standardChartIsActive &&
        <StandardChart/>
      }
      {rainbowChartIsActive &&
        <RainbowChart data={rainbowChartData} />
      }
      {pieChartIsActive &&
        <PieChart data={pieChartData} totalRevenue={overallRevenue.toFixed(2)} />
      }
    </>
  )
}

export default App
