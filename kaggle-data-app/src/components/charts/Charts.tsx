import React from 'react'

export default class Charts extends React.Component {
  constructor(props: any) {
    super(props)
  }

  csvToHashMap = (csvData: any) => {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    const hashMap: any = {};
  
    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(',');
      const obj: any = {};
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentLine[j];
      }
      hashMap[i - 1] = obj;
    }
    return hashMap;
  }

  async componentDidMount() {
    console.log('is this getting hit?');
    // Going to import the data from the csv here
    // Use a hash map as opposed to an array of objects
    const csvData = 
    `name,age,city
    John,30,New York
    Jane,25,London
    Peter,40,Paris`;
      
    const dataMap = this.csvToHashMap(csvData);
    console.log(dataMap);
  }

  render () {
    return (
        <>

        </>
      )
  }
}
