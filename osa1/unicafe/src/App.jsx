import { useState } from 'react'

const Statistics = ({ good, neutral, bad }) => {
  return (
    <div>
    <h1>statistics</h1>
    good {good} <br />
    neutral {neutral} <br />
    bad {bad} <br />
    all {good + bad + neutral} <br /> 
    average {(good + bad + neutral) / 3} <br />
    positive {(good / (good + bad + neutral)) * 100} % <br />
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <button onClick={handleGoodClick}>good</button>
      <button onClick={handleNeutralClick}>neutral</button>
      <button onClick={handleBadClick}>bad</button>
      <Statistics good={good} neutral={neutral} bad={bad} />
      </div>
  )
}

export default App