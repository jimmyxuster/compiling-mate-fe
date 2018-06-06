import React, {Component} from 'react';
import {Card, Row, Col} from 'antd';
import NfaGraph from '../NfaGraph/NfaGraph';
import ReTree from '../ReTree/ReTree';
import './ThompsonCard.css';

class ThompsonCard extends Component {

  constructor() {
    super();
    this.state = {
      currentId: null
    }
  }
  componentDidMount() {

  }

  render() {
    let nfaMap = {};
    let reTree = {};
    let data = this.props.data;
    if(data !== undefined){
      nfaMap = data.nfaMap;
      reTree = data.reTree;
    }
    let currentId = this.state.currentId;
    let currentGraphData = {nodes:[], links:[]};
    if(nfaMap !== {}) {
      currentGraphData = nfaMap[reTree.id];
    }
    if(currentId !== null) {
      currentGraphData = nfaMap[currentId];
    }
    return (
      <Card className="thompson-card" title="Thompson Algorithm" bordered={false}>
        <Row gutter={16}>
          <Col span={8}>
            <ReTree data={[]} />
          </Col>
          <Col span={16}>
            <NfaGraph data={currentGraphData} />
          </Col>
        </Row>
      </Card>
    )
  }
}

export default ThompsonCard;