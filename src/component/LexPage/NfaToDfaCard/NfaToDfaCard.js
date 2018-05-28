import React, { Component } from 'react';
import { Card, Button, Row, Col } from 'antd';
import * as echarts from 'echarts';
import { drawNfa } from '../../../utils/nfa';
import './NfaToDfaCard.css';
import {nfa, dfa} from './MockData';

class NfaToDfaCard extends Component {
  constructor() {
    super();
    this.state = {
      step: -1,
      maxStep: 0,
      nfaData: {},
      dfaData: {
        states: [],
        links: []
      },
      dsPushStep: []
    }
  }

  componentDidMount() {
    let nfaChart = echarts.init(document.getElementById('nfa_graph'));
    drawNfa(nfaChart, nfa);

    let dsStep = [];
    let current = -1;
    for(let i = 0; i < dfa.links.length; i++) {
      if(dfa.links[i].moveTo > current) {
        dsStep.push(i);
        current = dfa.links[i].moveTo;
      }
    }
    console.log(dsStep);
    this.setState({
      dfaData: dfa,
      maxStep: dfa.links.length,
      dsPushStep: dsStep
    });
  }

  render() {
    let {states, links} = this.state.dfaData;
    let {step, dsPushStep} = this.state;
    return (
    <Card className="retodfa-card" title="NFA to DFA Algorithm" bordered={false}>
      <div className="toolbar">
          <Button className="button" disabled={this.state.step===0} onClick={() => {this.setState({step: step - 1})}}
              type="primary">
              上一步
          </Button>
          <Button className="button" disabled={this.state.step===this.state.maxStep} onClick={() => {this.setState({step: step + 1})}}
              type="primary">
              下一步
          </Button>
      </div>
      <Row gutter={16}>
        <Col span={12}>
          <div id="nfa_graph" />
        </Col>
        <Col span={12}>
          <div className="text-pad" >
            {step === -1 ? <p>点击下一步开始进行操作</p>: null}
            {/* {step >= 0 ? "DS: " + ds.map(item => 'S' + item + ' ') : null} */}
            {step >= 0 ? <p>ε-closure({0}) = {'{' + states[0].toString() + '}'} = S0 <br/> push S0 into DS</p> : null}
            {step >= 0 ? links.slice(0,step).map((val, index) => {
              if(dsPushStep.find(num => num === index) !== undefined){
                return <p key={index}>ε-closure(move(S{val.moveFrom}, {val.moveBy})) = ε-closure({'{' + states[val.moveFrom].toString() + '}'}) = {'{' + states[val.moveTo].toString() + '}'} = S{val.moveTo} <br/> push S{val.moveTo} into DS</p>
              }
              return <p key={index}>ε-closure(move(S{val.moveFrom}, {val.moveBy})) = ε-closure({'{' + states[val.moveFrom].toString() + '}'}) = {'{' + states[val.moveTo].toString() + '}'} = S{val.moveTo} </p>
            }) : null}
          </div>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <div className="dfa_graph" />
        </Col>
        <Col span={12}>
          <div className="jump-table" />
        </Col>
      </Row>
    </Card>
    );
  }
}

export default NfaToDfaCard;
