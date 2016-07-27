import React from 'react'
import ReactDom from 'react-dom'
import InfiniteScroll from 'react-infinitescroll'
import 'ress'

let start = 1
const handleRequestItem = () => {
  return new Promise((resolve) => {
    const items = []
    for (let i = 0; i < 10; ++i) {
      items.push(start + i)
    }
    start += 10
    // A liite delay to simulate network latency
    setTimeout(() => resolve(items), 300)
  })
}

const App = () => (
  <InfiniteScroll onRequestItem={ handleRequestItem } />
)

ReactDom.render(
  <App />,
  document.getElementById('root')
)
