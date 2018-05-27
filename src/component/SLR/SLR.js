import React from 'react'
import {Row, Col, Button, Icon, Table} from 'antd'
import NodeChart from '../NodeChart/NodeChart'
import api from '../../service/api'
import {calcNodePositions, parseNodeStates} from '../../common/util'
import './SLR.css'
const {Column, ColumnGroup} = Table;

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
        }

        this.backward = this.backward.bind(this)
        this.forward = this.forward.bind(this)
        this.handleChartItemClick = this.handleChartItemClick.bind(this)
        this.handleCloseDetail = this.handleCloseDetail.bind(this)
    }

    componentDidMount() {
        this.fetchSolution()
    }

    componentWillReceiveProps(newProps) {
        if ('cfg' in newProps) {
            this.fetchSolution(newProps.cfg)
        }
    }

    fetchSolution(cfg = []) {
        api.parsingSyntaxProcessingOutput(cfg).then(res => {
            if (res.code === 0) {
                this.parseGraphData(res.data.treeSteps);
                this.parseTable(res.data.symbols, res.data.parseTable);
            }
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
        let delim = symbols.indexOf('$');
        let terminals = [];
        let nonTerminals = [];
        if (delim >= 0) {
            terminals = symbols.slice(0, delim + 1);
            nonTerminals = symbols.slice(delim + 1);
        } else {
            terminals = symbols;
        }
        terminals = ['state'].concat(terminals);
        table = table.map((row, index) => {
            let obj = Object.create(null);
            symbols.forEach((sym, index) => Object.assign(obj, {[sym]: row[index]}));
            obj.key = index;
            Object.assign(obj, {state: index})
            return obj;
        })
        this.setState({
            parseTable: table,
            terminals,
            nonTerminals,
        });
        this.refreshParseTable(0);
    }

    refreshParseTable(stepCount) {
        let tableDisplay = [];
        if (stepCount === this.state.totalStep - 1) {
            tableDisplay = this.state.parseTable;
        } else {
            for (let i = 0; i < stepCount + 1; i++) {
                tableDisplay.push({state: i, key: i});
            }
        }
        this.setState({
            tableDisplay
        })
    }

    backward() {
        if (this.state.stepCount > 0) {
            this.refreshParseTable(this.state.stepCount - 1);
            let prevState = this.state.states[this.state.stepCount - 1]
            calcNodePositions(prevState.data)
            this.setState({
                currData: prevState.data,
                currLinks: prevState.links,
                stepCount: this.state.stepCount - 1
            });
        }
    }

    forward() {
        if (this.state.stepCount < this.state.totalStep - 1) {
            this.refreshParseTable(this.state.stepCount + 1);
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

    render() {
        return (
            <Row className="slr">
                <Col span={12} className="slr__col">
                    {this.state.focusNode ? (
                        <div>
                            <Button className="slr_detail-button" ghost={true} onClick={this.handleCloseDetail}><Icon
                                type="left"/>返回</Button>
                            <div className="slr__detail">
                                <div className="slr__detail-node-wrapper">
                                    <div className="slr__detail-node">{this.state.focusNode.text}</div>
                                </div>
                                <div className="slr__detail-prod">
                                    {this.state.focusNode.production[0].map((prodLeft, index) =>
                                        <div key={`prod-${index}`}>
                                            <span>{prodLeft}</span>→<span>{this.state.focusNode.production[1][index]}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : null}
                    <div style={{display: this.state.focusNode ? 'none' : 'block'}}>
                        <Button.Group size="medium" className="slr__operate">
                            <Button type="primary" disabled={this.state.stepCount <= 0} onClick={this.backward}>
                                <Icon type="left"/>上一步
                            </Button>
                            <Button type="primary" disabled={this.state.stepCount >= this.state.totalStep - 1}
                                    onClick={this.forward}>
                                下一步<Icon type="right"/>
                            </Button>
                        </Button.Group>
                        <NodeChart data={this.state.currData} links={this.state.currLinks}
                                   onClick={this.handleChartItemClick}/>
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
        )
    }
}

export default SLR