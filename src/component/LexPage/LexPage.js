import React, {Component} from 'react';
import {
    Input,
    Tooltip,
    Button,
    Alert,
    Spin,
    Icon
} from 'antd';
import ThompsonCard from './ThompsonCard/ThompsonCard';
import NfaToDfaCard from './NfaToDfaCard/NfaToDfaCard';
import ReToDfaCard from './ReToDfaCard/ReToDfaCard';
import './LexPage.css';

class LexPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            re: "",
            lastRe: "",
            currentAlgorithm: "",
            shouldShowReEmptyError: false,
            isLoading: false,
            data: {}
        }
    }

    onChange = (e) => {
        const {value} = e.target;
        this.setState({re: value, shouldShowReEmptyError: false});
    }

    getParsingData = () => {
        const re = this.state.re;
        this.setState({
            isLoading: true,
            lastRe: re
        });

        let callback = () => {
            this.setState({
                data: {thompsonData: "test"},
                isLoading: false
            });
        }

        setTimeout(callback, 1000);
    }

    onClickAlgorithm = (algorithm) => {
        if(this.state.re === "") {
            this.setState({shouldShowReEmptyError: true});
            return;
        }
        this.setState({currentAlgorithm: algorithm});
        if(!this.isReChanged()) return;
        this.getParsingData();
    }

    isReChanged = () => {
        const {re, lastRe} = this.state;
        if (re === lastRe) {
            return false;
        }
        return true;
    }

    handleClose = () => {
        this.setState({shouldShowReEmptyError: false});
    }

    render() {
        const loadingIcon = <Icon type="loading" style={{
            fontSize: 36
        }} spin/>;

        const cardMap = {
            thompson: <ThompsonCard/>,
            nfaToDfa: <NfaToDfaCard/>,
            reToDfa: <ReToDfaCard/>
        };
        let currentCard = cardMap[this.state.currentAlgorithm];

        return (
            <div className="lex-page-container">
                <div className="input-container">
                    <Tooltip
                        lassName="gadget"
                        trigger={['focus']}
                        title="请输入RE表达式"
                        placement="topLeft">
                        <Input size="large" onChange={this.onChange} placeholder="请输入RE表达式"/>
                    </Tooltip>
                    <Button
                        className="gadget"
                        type="primary"
                        disabled={this.state.isLoading}
                        onClick={() => this.onClickAlgorithm("thompson")}>
                        Show Thompson Algorithm
                    </Button>
                    <Button
                        className="gadget"
                        type="primary"
                        disabled={this.state.isLoading}
                        onClick={() => this.onClickAlgorithm("nfaToDfa")}>
                        NFA to DFA
                    </Button>
                    <Button
                        className="gadget"
                        type="primary"
                        disabled={this.state.isLoading}
                        onClick={() => this.onClickAlgorithm("reToDfa")}>
                        RE to DFA
                    </Button>

                    {this.state.shouldShowReEmptyError
                        ? (<Alert message="RE不能为空" type="error" closable afterClose={this.handleClose}/>)
                        : null
}
                </div>

                <div className="algorithm-visualization-container">
                    <Spin spinning={this.state.isLoading} delay={500} indicator={loadingIcon}>
                        <div className="card-container">
                            <div className="card">
                                {currentCard}
                            </div>
                        </div>
                    </Spin>
                </div>
                <ThompsonCard/>
            </div>
        )
    }
}

export default LexPage;