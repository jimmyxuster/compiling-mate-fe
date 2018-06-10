import React from 'react'
import {Row, Col, Button, Icon, Table, Steps, Switch, message} from 'antd'
import NodeChart from '../NodeChart/NodeChart'
import CfgInput from '../CfgInput/CfgInput'
import api from '../../service/api'
import {calcNodePositions, parseNodeStates} from '../../common/util'
import './SLR.css'

const {Column, ColumnGroup} = Table;
const {Step} = Steps;

class SLR extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            totalStep: -1,
            stepCount: 0,
            states: [],
            currData: [],
            currLinks: [],
            focusNode: null,
            terminals: [],
            nonTerminals: [],
            parseTable: [],
            tableDisplay: [],
            currentStep: 0,
            directMode: false,
        }

        this.backward = this.backward.bind(this)
        this.forward = this.forward.bind(this)
        this.handleChartItemClick = this.handleChartItemClick.bind(this)
        this.handleCloseDetail = this.handleCloseDetail.bind(this)
        this.handleDirectMode = this.handleDirectMode.bind(this)
    }

    fetchSolution(cfgs = [], startSymbol) {
        const data = {
            startSymbol,
            productions: cfgs,
        }
        api.parsingSyntaxProcessingOutput(data).then(res => {
            if (res.success) {
                this.setState({currentStep: 1});
                setTimeout(() => {
                    this.parseGraphData(res.data.treeSteps);
                    this.parseTable(res.data.symbols, res.data.parseTable.table);
                }, 0);
            } else {
                message.error('输入不合法：' + res.message);
            }
        }).catch((err) => {
            message.error('网络异常')
            console.log(err)
        })
    }

    parseGraphData(treeSteps = []) {
        let firstStep = treeSteps[0]
        if (firstStep.type !== 'add') {
            throw new Error('first step type must be add!')
        }
        let states = parseNodeStates(treeSteps)
        calcNodePositions(states[0].data)
        this.setState({
            totalStep: treeSteps.length,
            states,
            currData: states[0].data,
            currLinks: states[0].links
        })
    }

    parseTable(symbols, table) {
        let delim = symbols.indexOf('$')
        let terminals = []
        let nonTerminals = []
        if (delim >= 0) {
            terminals = symbols.slice(0, delim + 1)
            nonTerminals = symbols.slice(delim + 1)
        } else {
            terminals = symbols
        }
        terminals = ['state'].concat(terminals)
        table = table.map((row, index) => {
            let obj = Object.create(null)
            symbols.forEach((sym, index) => Object.assign(obj, {[sym]: row[index]}))
            obj.key = index
            Object.assign(obj, {state: index})
            return obj
        })
        this.setState({
            parseTable: table,
            terminals,
            nonTerminals
        })
        this.refreshParseTable(0)
    }

    refreshParseTable(stepCount) {
        let tableDisplay = []
        if (stepCount === this.state.totalStep - 1) {
            tableDisplay = this.state.parseTable
        } else {
            for (let i = 0; i < stepCount + 1; i++) {
                tableDisplay.push({state: i, key: i})
            }
        }
        this.setState({
            tableDisplay
        })
    }

    backward() {
        if (this.state.stepCount > 0) {
            this.refreshParseTable(this.state.stepCount - 1)
            let prevState = this.state.states[this.state.stepCount - 1]
            calcNodePositions(prevState.data)
            this.setState({
                currData: prevState.data,
                currLinks: prevState.links,
                stepCount: this.state.stepCount - 1
            })
        }
    }

    forward() {
        if (this.state.stepCount < this.state.totalStep - 1) {
            this.refreshParseTable(this.state.stepCount + 1)
            let nextState = this.state.states[this.state.stepCount + 1]
            calcNodePositions(nextState.data)
            this.setState({
                currData: nextState.data,
                currLinks: nextState.links,
                stepCount: this.state.stepCount + 1
            })
        }
    }

    handleChartItemClick(params) {
        let clickedId = params.data.id || params.name
        let clickedNode = this.state.currData.find(node => node.id === clickedId)
        if (clickedNode) {
            this.setState({
                focusNode: {text: clickedNode.name, production: clickedNode.rawProduction}
            })
        }
    }

    handleCloseDetail() {
        this.setState({focusNode: null})
    }

    handleDirectMode(checked) {
        this.setState({
            directMode: checked,
        });
    }

    handleSubmit = (submitObj) => {
        console.log(submitObj)
        this.fetchSolution(submitObj.cfgs, submitObj.startSymbol);
    }

    render() {
        const step1 = <CfgInput onSubmit={this.handleSubmit}/>;
        const step2 = (
            <Row>
                <Col span={12} className="slr__col">
                    {this.state.focusNode ? (
                        <div>
                            <Button className="slr_detail-button" ghost={true}
                                    onClick={this.handleCloseDetail}><Icon
                                type="left"/>返回</Button>
                            <div className="slr__detail">
                                <div className="slr__detail-node-wrapper">
                                    <div className="slr__detail-node">{this.state.focusNode.text}</div>
                                </div>
                                <div className="slr__detail-prod">
                                    {this.state.focusNode.production.productionLeft.map((prodLeft, index) =>
                                        <div key={`prod-${index}`}>
                                            <span>{prodLeft}</span>→<span>{this.state.focusNode.production.productionRight[index]}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : null}
                    <div style={{display: this.state.focusNode ? 'none' : 'block', position: 'relative'}}>
                        <NodeChart data={this.state.currData} links={this.state.currLinks} directMode={this.state.directMode}
                                   onClick={this.handleChartItemClick}/>
                        <div className="slr__operate-wrapper">
                            <Button.Group size="medium" className="slr__operate">
                                <Button type="primary" disabled={this.state.stepCount <= 0} onClick={this.backward}>
                                    <Icon type="left"/>上一步
                                </Button>
                                <Button type="primary" disabled={this.state.stepCount >= this.state.totalStep - 1}
                                        onClick={this.forward}>
                                    下一步<Icon type="right"/>
                                </Button>
                            </Button.Group>
                        </div>
                    </div>
                </Col>
                <Col span={12} className="slr__col">
                    <Table dataSource={this.state.tableDisplay} defaultExpandAllRows={true} pagination={false}>
                        <ColumnGroup title="Action Table">
                            {this.state.terminals.map(t => (
                                <Column
                                    align="center"
                                    title={t}
                                    dataIndex={t}
                                    key={t}
                                />
                            ))}
                        </ColumnGroup>
                        <ColumnGroup title="Goto Table">
                            {this.state.nonTerminals.map(nt => (
                                <Column
                                    align="center"
                                    title={nt}
                                    dataIndex={nt}
                                    key={nt}
                                />
                            ))}
                        </ColumnGroup>
                    </Table>
                </Col>
            </Row>
        );
        return (
            <div className="slr">
                {this.state.currentStep === 1 ? (
                    <div className="slr__toggle">
                        显示全部产生式：<Switch onChange={this.handleDirectMode}/>
                    </div>
                ):null}
                <Steps current={this.state.currentStep} size="small" className="slr__progress">
                    <Step key="input" title="输入CFG"/>
                    <Step key="compute" title="演示"/>
                </Steps>
                {this.state.currentStep === 0 ? step1 : step2}
            </div>
        )
    }
}

export default SLR