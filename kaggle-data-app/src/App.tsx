import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Charts from './components/charts/Charts';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Working with Kaggle to get a pretty data set in here that is relevant to real ecommerce data yay</h1>
      <Charts />
    </>
  )
}

export default App
