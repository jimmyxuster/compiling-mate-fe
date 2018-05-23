import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import './App.css';
import { BrowserRouter as Router, Route, Link }  from 'react-router-dom';
import ConceptTree from "./component/ConceptTree/ConceptTree";
import LexPage from './component/LexPage/LexPage';
const { Header, Content, Sider } = Layout;

class App extends Component {
  render() {
      let home = () => (
        <Layout className="app">
            <Header className="header">
                <div className="header-logo">Compilers</div>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    style={{ lineHeight: '64px' }}
                >
                    <Menu.Item key="1"><Link to="/concepts">知识图谱</Link></Menu.Item>
                    <Menu.Item key="2"><Link to="/algorithm">算法演示</Link></Menu.Item>
                    <Menu.Item key="3"><Link to="/example">操作实例</Link></Menu.Item>
                    <Menu.Item key="4"><Link to="/languageFactory">语言工厂</Link></Menu.Item>
                </Menu>
            </Header>
            <Layout>
                <div>
                    <Route path="/concepts" component={ConceptTree}/>
                    <Route path="/lex" component={LexPage}/>
                </div>
            </Layout>
        </Layout>
      )

    return (
        <Router>
            <Route path="/" component={home}/>        
        </Router>
    );
  }
}

export default App;
