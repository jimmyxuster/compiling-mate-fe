import React from 'react'
import {Steps, Row, Col, List, Table, Divider, Button, Icon} from 'antd'
import classNames from 'classnames'
import {handleEpsilon} from '../../common/util'
import CfgInput from '../CfgInput/CfgInput'
import api from '../../service/api'
import './LL.css'

const {Step} = Steps
const {Column, ColumnGroup} = Table

class LL extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            parseTable: [],
            currentStep: 1,
            totalStep: 0,
            tableStep: 0,
            terminals: [],
            firsts: {},
            follows: {},
            highlightFirsts: [],
            highlightFollows: [],
        }
    }

    componentDidMount() {
        api.parsingLL1Output().then(res => {
            if (res.code === 0) {
                const {nonTerminals, terminals} = res.data
                const parseTable = res.data.parseTable.map((row, index) => {
                    let obj = Object.create(null)
                    Object.assign(obj, {nonTerminal: nonTerminals[index], key: nonTerminals[index]})
                    row.forEach((item, index) => {
                        item.production = handleEpsilon(item.production);
                        Object.assign(obj, {[terminals[index]]: item})
                    })
                    return obj
                })
                this.setState({
                    parseTable,
                    nonTerminals,
                    terminals,
                    firsts: handleEpsilon(res.data.firsts),
                    follows: handleEpsilon(res.data.follows),
                    totalStep: nonTerminals.length * terminals.length,
                })
            }
        })
    }

    handleCellClick(rowIndex, colIndex) {
        const nextStep = rowIndex * this.state.terminals.length + colIndex + 1;
        this.goToStep(nextStep);
    }


    backward = () => {
        if (this.state.tableStep > 0) {
            this.goToStep(this.state.tableStep - 1);
        }
    }

    forward = () => {
        if (this.state.tableStep < this.state.totalStep) {
            this.goToStep(this.state.tableStep + 1);
        }
    }

    goToStep = (step) => {
        const [highlightFirsts, highlightFollows] = this.getNextHighlight(step);
        this.setState({
            tableStep: step,
            highlightFirsts,
            highlightFollows,
        });
    }

    getNextHighlight = (nextStep) => {
        let row = Math.floor((nextStep - 1) / this.state.terminals.length);
        let col = (nextStep - 1) % this.state.terminals.length;
        let highlightFirsts = [], highlightFollows = [];
        if (row >= 0) {
            const {reason} = this.state.parseTable[row][this.state.terminals[col]];
            if (reason.type === 'first') {
                highlightFirsts = [reason.key];
            } else if (reason.type === 'follow') {
                highlightFollows = [reason.key];
            }
        }
        return [highlightFirsts, highlightFollows];
    }

    getColVisibility = (rowIndex, colIndex) => {
        return colIndex + rowIndex * this.state.terminals.length < this.state.tableStep ? 'visible' : 'hidden';
    }

    getListItem = (left, dataSource) => {
        let inHighlightFirsts = dataSource === this.state.firsts && this.state.highlightFirsts.indexOf(left) >= 0;
        let inHighlightFollows = dataSource === this.state.follows && this.state.highlightFollows.indexOf(left) >= 0;
        const classes = classNames({'ll-list-item': true, 'highlight': inHighlightFirsts || inHighlightFollows})
        return <List.Item><div className={classes}>First({left}) = &#123;{dataSource[left].join(', ')}&#125;</div></List.Item>
    }

    getTableCell(data, rowIndex, colIndex) {
        const classes = classNames({'ll-table__cell': true, 'selected': rowIndex * this.state.terminals.length + colIndex + 1 === this.state.tableStep})
        return (
            <div className={classes} onClick={() => this.handleCellClick(rowIndex, colIndex)}><span style={{visibility: this.getColVisibility(rowIndex, colIndex)}}
            >{data.production.left}<i
                className="iconfont">&#xe96d;</i>{data.production.right}</span></div>
        )
    }

    render() {
        const step1 = CfgInput;
        const step2 = (
            <Row>
                <Col span={12} className="ll__left">
                    <Divider orientation="left" style={{marginTop: 0}}>Firsts</Divider>
                    <List
                        dataSource={Object.keys(this.state.firsts)}
                        bordered
                        renderItem={left => this.getListItem(left, this.state.firsts)} />
                    <Divider orientation="left">Follows</Divider>
                    <List
                        dataSource={Object.keys(this.state.follows)}
                        bordered
                        renderItem={left => this.getListItem(left, this.state.follows)} />
                </Col>
                <Col span={12} className="ll__col">
                    <Table bordered dataSource={this.state.parseTable} defaultExpandAllRows={true} pagination={false}>
                        <Column
                            className="ll-table__col"
                            width={80}
                            align="center"
                            title="Non-Terminal"
                            dataIndex="nonTerminal"
                            key="nonTerminal"
                        />
                        <ColumnGroup title="Input Symbol">
                            {this.state.terminals.map((t, colIndex) => (
                                <Column
                                    className="ll-table__col prod"
                                    align="center"
                                    title={t}
                                    dataIndex={t}
                                    key={t}
                                    render={(data, record, rowIndex) => this.getTableCell(data, rowIndex, colIndex)}
                                />
                            ))}
                        </ColumnGroup>
                    </Table>
                </Col>
            </Row>
        )
        return (
            <div className="ll">
                <div className="ll__operation">
                    <Button.Group size="medium">
                        <Button type="primary" disabled={this.state.tableStep <= 0} onClick={this.backward}>
                            <Icon type="left"/>上一步
                        </Button>
                        <Button type="primary" disabled={this.state.tableStep >= this.state.totalStep}
                                onClick={this.forward}>
                            下一步<Icon type="right"/>
                        </Button>
                    </Button.Group>
                </div>
                <Steps current={this.state.currentStep} size="small" className="ll__progress">
                    <Step key="input" title="输入CFG"/>
                    <Step key="compute" title="演示"/>
                </Steps>
                {this.state.currentStep === 0 ? step1 : step2}
            </div>
        )
    }
}

export default LL;