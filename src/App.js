import React, {Component} from 'react'
import {Layout, Menu} from 'antd'
import './App.css'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import ConceptTree from './component/ConceptTree/ConceptTree'
import LeftRightLayout from './component/LeftRightLayout/LeftRightLayout'
import LexPage from './component/LexPage/LexPage';

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
                            <Menu.Item key="/example"><Link to="/example">语言实例</Link></Menu.Item>
                        </Menu>
                    </Header>
                    <Route path="/" exact component={ConceptTree}/>
                    <Route path="/concepts" component={ConceptTree}/>
                    <Route path="/algorithm" component={LeftRightLayout}/>
                    <Route path="/lex" component={LexPage}/>
                </Layout>
            </Router>
        )
    }
}

export default App
