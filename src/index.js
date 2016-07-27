import React, { PropTypes, Component } from 'react'
import EventListener from 'react-event-listener'
import { bind } from 'decko'
import remove from 'lodash/remove'
import last from 'lodash/last'

const renderItem = (item) => (
  <div>
    { item }
  </div>
)

class InfiniteScroll extends Component {
  constructor(props, context) {
    super(props, context)
    this.pool = []
    this.items = []
    this.start = 0
    this.end = 0
    this.state = {
      items: []
    }
  }

  itemStyle() {
    const { itemHeight } = this.props
    return {
      height: `${itemHeight}px`
    }
  }

  anchorStyle() {
    const { itemHeight } = this.props
    return {
      ...styles.anchor,
      top: `${itemHeight * this.start}px`
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.itemHeight !== nextProps.itemHeight) {
      this.calculatePool()
    }
  }

  componentDidMount() {
    this.calculateOffset()
    this.calculatePool()
  }

  calculateOffset() {
    let ele = this.container
    this.containerTop = 0
    while (ele !== null) {
      this.containerTop += ele.offsetTop
      ele = ele.offsetParent
    }
  }

  calculatePool() {
    const { offsetHeight } = this.container
    const { itemHeight } = this.props
    const poolSize = Math.floor(offsetHeight / itemHeight) + 6

    this.pool = []
    this.poolSize = poolSize
    for (let i = 0; i < poolSize; ++i) {
      this.pool.push(i)
    }

    this.calculateItem()
  }

  calculateItem(addItemStrategy = this.appendItem) {
    if (this.items.length - this.start < this.poolSize) {
      this.props.onRequestItem().then((items) => {
        this.addItem(items)
      })
      return
    }

    const { items } = this.state
    remove(items, ({ key }) => this.pool.indexOf(key) !== -1)

    while (this.pool.length) {
      const key = this.pool.shift()
      this::addItemStrategy(items, key)
    }

    this.setState({
      items
    })
  }

  appendItem(items, key) {
    items.push({
      key,
      item: this.items[this.start + (this.poolSize - this.pool.length - 1)]
    })
  }

  prependItem(items, key) {
    items.unshift({
      key,
      item: this.items[this.start + this.pool.length]
    })
  }

  addItem(items) {
    this.items = this.items.concat(items)
    this.calculateItem()
  }

  @bind
  handleScroll() {
    const { itemHeight } = this.props
    const { scrollY } = window
    const scrollLength = scrollY - this.containerTop
    if (scrollLength > (this.start + 4) * itemHeight) {
      this.start += 1
      this.pool.push(this.state.items[0].key)
      this.calculateItem()
    } else if (scrollLength < (this.start + 2) * itemHeight) {
      this.start -= 1
      this.pool.push(last(this.state.items).key)
      this.calculateItem(this.prependItem)
    }
  }

  @bind
  handleResize() {
    this.calculatePool()
  }

  @bind
  getContainer(container) {
    this.container = container
  }

  render() {
    const { renderItem } = this.props
    const { items } = this.state
    const itemStyle = this.itemStyle()
    const anchorStyle = this.anchorStyle()
    return (
      <div style={ styles.full } ref={ this.getContainer } >
        <EventListener target='window' onResize={ this.handleResize } />
        <EventListener target='document' onScroll={ this.handleScroll } />
        <div style={ anchorStyle }>
          {
            items.map(({ key, item }, idx) => (
              <div key={ idx } style={ itemStyle }>
                { renderItem(item) }
              </div>
            ))
          }
          <div style={ itemStyle }> loading... </div>
        </div>
      </div>
    )
  }

  static propTypes = {
    itemHeight: PropTypes.number.isRequired,
    renderItem: PropTypes.func.isRequired,
    onRequestItem: PropTypes.func.isRequired
  }

  static defaultProps = {
    itemHeight: 30,
    renderItem: renderItem
  }
}

const styles = {
  full: {
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  anchor: {
    position: 'absolute'
  }
}

export default InfiniteScroll
