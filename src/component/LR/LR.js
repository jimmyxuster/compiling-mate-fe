import React from 'react'
import {Row, Col, Button, Icon, Table, Steps, Switch, Input, message} from 'antd'
import NodeChart from '../NodeChart/NodeChart'
import CfgInput from '../CfgInput/CfgInput'
import api from '../../service/api'
import {calcNodePositions, parseNodeStates} from '../../common/util'
import './LR.css'

const {Column, ColumnGroup} = Table;
const {Step} = Steps;
const {Search} = Input;

class LR extends React.Component {

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
            conflicts: [],
            actionOutputStep: 0,
            actionOutput: [],
        }

        this.backward = this.backward.bind(this)
        this.forward = this.forward.bind(this)
        this.handleChartItemClick = this.handleChartItemClick.bind(this)
        this.handleCloseDetail = this.handleCloseDetail.bind(this)
        this.handleDirectMode = this.handleDirectMode.bind(this)
    }

    fetchSolution(cfgs = [], startSymbol) {
        this.processingOutputData = {
            startSymbol,
            productions: cfgs,
        }
        const data = {
            ...this.processingOutputData,
            type: 1,
        }
        api.parsingSyntaxProcessingOutput(data).then(res => {
            if (res.success) {
                Object.assign(this.processingOutputData, res.data);
                Object.assign(this.processingOutputData, {table: res.data.parseTable.table});
                this.setState({currentStep: 1});
                setTimeout(() => {
                    this.parseGraphData(res.data.treeSteps);
                    this.parseTable(res.data.symbols, res.data.parseTable.table);
                    this.parseTableConflicts(res.data.parseTable);
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
            nonTerminals,
        })
        this.refreshParseTable(0)
    }

    parseTableConflicts({conflictList}) {
        this.setState({conflicts: conflictList});
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
        } else {
            this.setState({
                currentStep: 2,
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


    handleActionOutput = (input) => {
        Object.assign(this.processingOutputData, {input})
        api.parsingSyntaxActionOutput(this.processingOutputData).then(res => {
            if (res.success) {
                this.parseActionOutputData(res.data.actionResult);
            }
        }).catch(err => {
            message('网络异常');
            console.log(err);
        });
    }

    parseActionOutputData = (actionResult) => {
        const actionOutput = actionResult.map((actionLine, index) => ({
            stack: actionLine[0],
            input: actionLine[1],
            step: actionLine[2],
            reference: actionLine[3],
            key: `step${index}`,
        }));
        this.setState({actionOutput});
    }

    renderCell = (text, rowIndex, colIndex) => {
        let conflict = this.state.conflicts.find((conflict) => conflict.row === rowIndex && conflict.col === colIndex - 1);
        if (conflict && this.state.stepCount === this.state.totalStep - 1) {
            const conflicts = [text, ...conflict.content];
            return <div className="slr__conflict-wrapper"><span className="slr__conflict">{conflicts.join(', ')}</span></div>;
        } else {
            return <span>{text}</span>;
        }
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
                                <Button type="primary" onClick={this.forward}>
                                    {this.state.stepCount >= this.state.totalStep - 1 ? '解析演示' : '下一步'}<Icon type="right"/>
                                </Button>
                            </Button.Group>
                        </div>
                    </div>
                </Col>
                <Col span={12} className="slr__col">
                    <Table dataSource={this.state.tableDisplay} defaultExpandAllRows={true} pagination={false}>
                        <ColumnGroup title="Action Table">
                            {this.state.terminals.map((t, colIndex) => (
                                <Column
                                    className="slr__cell"
                                    align="center"
                                    title={t}
                                    dataIndex={t}
                                    key={t}
                                    render={(text, record, rowIndex) => this.renderCell(text, rowIndex, colIndex)}
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
        const step3 = (
            <div>
                <Search className="slr-parse__input" enterButton="解析" onSearch={this.handleActionOutput} placeholder="输入句子，空格分隔终结符"/>
                <Table dataSource={this.state.actionOutput} defaultExpandAllRows={true} pagination={false} bordered
                       rowClassName={(record, index) => index <= this.state.actionOutputStep ? 'action-output' : 'action-output inactive'}
                       onRow={(record, index) => {
                           return {
                               onClick: () => {console.log(index);this.setState({actionOutputStep: index})},       // 点击行
                           };
                       }}>
                    <Column title="栈" dataIndex="stack"/>
                    <Column title="输入" dataIndex="input"/>
                    <Column title="操作" dataIndex="step"/>
                    <Column title="依据" dataIndex="reference"/>
                </Table>
            </div>
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
                    <Step key="parse" title="解析"/>
                </Steps>
                {   (() => {
                    switch (this.state.currentStep) {
                        case 0:
                            return step1;
                        case 1:
                            return step2;
                        case 2:
                            return step3;
                        default:
                            return null;
                    }
                })()
                }
            </div>
        )
    }
}

export default LR