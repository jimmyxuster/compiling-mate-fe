import React, {Component} from 'react';
import {Card, Button, Row, Col, Table} from 'antd';
import * as echarts from 'echarts';
import {drawNfa} from '../../../utils/nfa';
import './NfaToDfaCard.css';
import {nfa, dfa} from './MockData';
import DfaGraph from '../DfaGraph/DfaGraph';

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
      dsPushStep: [],
      columns: [],
      tableData: []
    }
  }

  next = () => {
    let newTable = this.state.tableData;
    let links = this.state.dfaData.links;
    let step = this.state.step;
    if(step === -1) {
      newTable.push({
        DS: 'S0'
      })
    } else if(this.state.dsPushStep.find(item => item === step) !== undefined) {
      newTable.push({
        DS: 'S' + links[step].moveTo
      })
    }
    if(step !== -1)
      newTable[links[step].moveFrom][links[step].moveBy] = 'S' + links[step].moveTo;
    this.setState({
      step: step + 1,
      tableData: newTable
    })
  }

  back = () => {
    let newTable = this.state.tableData;
    let links = this.state.dfaData.links;
    let step = this.state.step;
    if(step === 0) {
      newTable = [];
    } else if(this.state.dsPushStep.find(item => item === step - 1) !== undefined) {
      newTable.pop();
    }
    if(step !== 0)
      newTable[links[step-1].moveFrom][links[step-1].moveBy] = null;
    
    this.setState({
      step: step - 1,
      tableData: newTable
    })
  }

  componentDidMount() {
    let nfaChart = echarts.init(document.getElementById('nfa_graph'));
    drawNfa(nfaChart, nfa);

    let dsStep = [];
    let current = -1;
    let columns = [];
    for (let i = 0; i < dfa.links.length; i++) {
      if (dfa.links[i].moveTo > current) {
        dsStep.push(i);
        current = dfa.links[i].moveTo;
      }
      if (columns.find(item => dfa.links[i].moveBy === item) === undefined) {
        columns.push(dfa.links[i].moveBy);
      }
    }
    this.setState({
      dfaData: dfa,
      maxStep: dfa.links.length,
      dsPushStep: dsStep,
      columns: [
        'DS', ...columns
      ]
    });
  }

  render() {
    let {states, links} = this.state.dfaData;
    let {step, dsPushStep, columns, tableData} = this.state;
    let columnsData = [];
    columns.forEach(val => {
      columnsData.push({title: val, dataIndex: val})
    })
    return (
      <Card className="retodfa-card" title="NFA to DFA Algorithm" bordered={false}>
        <div className="toolbar">
          <Button
            className="button"
            disabled={this.state.step === -1}
            onClick={this.back}
            type="primary">
            上一步
          </Button>
          <Button
            className="button"
            disabled={this.state.step === this.state.maxStep}
            onClick={this.next}
            type="primary">
            下一步
          </Button>
        </div>
        <Row gutter={16}>
          <Col span={16}>
            <div id="nfa_graph"/>
          </Col>
          <Col span={8}>
            <Table
              columns={columnsData}
              dataSource={tableData}
              pagination={false}
              bordered/>

          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <DfaGraph data={this.state.dfaData} edgeCount={step} nodeCount={tableData.length} />
          </Col>
          <Col span={12}>
            <div className="text-pad">
              {step === -1
                ? <p>点击下一步开始进行操作</p>
                : null}
              {/* {step >= 0 ? "DS: " + ds.map(item => 'S' + item + ' ') : null} */}
              {step >= 0
                ? <p>ε-closure({0}) = {'{' + states[0].toString() + '}'}
                    = S0
                    <br/>
                    push S0 into DS</p>
                : null}
              {step >= 0
                ? links
                  .slice(0, step)
                  .map((val, index) => {
                    if (dsPushStep.find(num => num === index) !== undefined) {
                      return <p key={index}>ε-closure(move(S{val.moveFrom}, {val.moveBy})) = ε-closure({'{' + states[val.moveFrom].toString() + '}'}) = {'{' + states[val.moveTo].toString() + '}'}
                        = S{val.moveTo}
                        <br/>
                        push S{val.moveTo} into DS</p>
                    }
                    return <p key={index}>ε-closure(move(S{val.moveFrom}, {val.moveBy})) = ε-closure({'{' + states[val.moveFrom].toString() + '}'}) = {'{' + states[val.moveTo].toString() + '}'}
                      = S{val.moveTo}
                    </p>
                  })
                : null}
            </div>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default NfaToDfaCard;
