import React, {Component} from 'react'
import {Layout, Menu} from 'antd'
import './App.css'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import ConceptTree from './component/ConceptTree/ConceptTree'
import LeftRightLayout from './component/LeftRightLayout/LeftRightLayout'
import LexPage from './component/LexPage/LexPage';
import CoLangPage from './component/CoLang/CoLangPage';
import Semantic from './component/semantic/Semantic'
const {Header} = Layout

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selectedKeys: ['/' + (window.location.pathname.split('/')[1] || 'concepts')]
        };
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect() {
        this.setState({
            selectedKeys: ['/' + (window.location.pathname.split('/')[1] || 'concepts')]
        })
    }

    render() {
        return (
            <Router>
                <Layout className="app">
                    <Header className="header">
                        <div className="header-logo">Compilers</div>
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            selectedKeys={this.state.selectedKeys}
                            onSelect={this.handleSelect}
                            defaultSelectedKeys={['/concepts']}
                            style={{lineHeight: '64px'}}
                        >
                            <Menu.Item key="/concepts"><Link to="/concepts">知识图谱</Link></Menu.Item>
                            <Menu.Item key="/algorithm"><Link to="/algorithm">算法演示</Link></Menu.Item>
                            <Menu.Item key="/type-checking"><Link to="/type-checking">类型检查</Link></Menu.Item>
                            <Menu.Item key="/colang"><Link to="/colang">Co语言</Link></Menu.Item>
                        </Menu>
                    </Header>
                    <Route path="/" exact component={ConceptTree}/>
                    <Route path="/concepts" component={ConceptTree}/>
                    <Route path="/algorithm" component={LeftRightLayout}/>
                    <Route path="/lex" component={LexPage}/>
                    <Route path="/type-checking" component={Semantic}/>
                    <Route path="/colang" component={CoLangPage}/>
                </Layout>
            </Router>
        )
    }
}

export default App
