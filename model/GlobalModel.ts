'use client'

import { SorterResult } from 'antd/es/table/interface'

const orderDictionary = {
  ascend: 'ASC',
  descend: 'DESC'
}

const filtersDictionary: { [key: string]: 'ascend' | 'descend' | undefined} = {
  ASC: 'ascend',
  DESC: 'descend'
}
class GlobalModel {
  static generateOrder (sorter: SorterResult<any>) {
    const column = sorter.column?.dataIndex
    const order = sorter.order
    if (!column || !order) return ''
    return `${column} ${orderDictionary[order]}`
  }

  static getOrderFromFilters: (dataIndex: string, sorter?: string) => 'ascend' | 'descend' | undefined = (dataIndex, sorter = '') => {
    const [column, order] = sorter.split(' ')
    if (column !== dataIndex || !order) return undefined
    return filtersDictionary[order]
  }
}

export default GlobalModel
