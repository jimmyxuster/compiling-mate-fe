import React from 'react';
import { Row, Col, Button, Icon } from 'antd';
import NodeChart from '../NodeChart/NodeChart';
import api from '../../service/api';
import {calcNodePositions, parseNodeStates} from '../../common/util'
import './SLR.css';

class SLR extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            totalStep: -1,
            stepCount: 0,
            states: [],
            currData: [],
            currLinks: [],
        };
        this.backward = this.backward.bind(this);
        this.forward = this.forward.bind(this);
    }

    componentDidMount() {
        this.fetchSolution();
    }

    componentWillReceiveProps(newProps) {
        if ('cfg' in newProps) {
            this.fetchSolution(newProps.cfg);
        }
    }

    fetchSolution(cfg = []) {
        api.parsingSyntaxProcessingOutput(cfg).then(res => {
            if (res.code === 0) {
                this.parseGraphData(res.data.treeSteps);
            }
        })
    }

    parseGraphData(treeSteps = []) {
        let firstStep = treeSteps[0];
        if (firstStep.type !== 'add') {
            throw new Error('first step type must be add!');
        }
        let states = parseNodeStates(treeSteps);
        calcNodePositions(states[0].data);
        this.setState({
            totalStep: treeSteps.length,
            states,
            currData: states[0].data,
            currLinks: states[0].links,
        })
    }

    backward() {
        if (this.state.stepCount > 0) {
            let prevState = this.state.states[this.state.stepCount - 1];
            calcNodePositions(prevState.data);
            this.setState({
                currData: prevState.data,
                currLinks: prevState.links,
                stepCount: this.state.stepCount - 1,
            });
        }
    }

    forward() {
        if (this.state.stepCount < this.state.totalStep - 1) {
            let nextState = this.state.states[this.state.stepCount + 1];
            calcNodePositions(nextState.data);
            this.setState({
                currData: nextState.data,
                currLinks: nextState.links,
                stepCount: this.state.stepCount + 1,
            });
        }
    }

    render() {
        return (
            <Row className="slr">
                <Col span={12} className="slr__col">
                    <Button.Group size="medium" className="slr__operate">
                        <Button type="primary" disabled={this.state.stepCount<=0} onClick={this.backward}>
                            <Icon type="left" />Backward
                        </Button>
                        <Button type="primary" disabled={this.state.stepCount>=this.state.totalStep-1} onClick={this.forward}>
                            Forward<Icon type="right" />
                        </Button>
                    </Button.Group>
                    <NodeChart data={this.state.currData} links={this.state.currLinks}/>
                </Col>
                <Col span={12} className="slr__col">

                </Col>
            </Row>
        );
    }
}

export default SLR;