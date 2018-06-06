import React, {Component} from 'react';
import {Card, Row, Col} from 'antd';
import * as echarts from 'echarts';
import setTreeAndGraph from './GraphTool';
import './ThompsonCard.css';

import {mockTreeData, mockGraphData} from './MockData';

class ThompsonCard extends Component {

  componentDidMount() {
    let treeChart = echarts.init(document.getElementById('re_tree'));
    let graphChart = echarts.init(document.getElementById('thompson_graph'));

    setTreeAndGraph(mockTreeData, mockGraphData, treeChart, graphChart);

  }

  render() {
    return (
      <Card className="thompson-card" title="Thompson Algorithm" bordered={false}>
        <Row gutter={16}>
          <Col span={8}>
            <div id="re_tree"/>
          </Col>
          <Col span={16}>
            <div id="thompson_graph"/>
          </Col>
        </Row>
      </Card>
    )
  }
}

export default ThompsonCard;