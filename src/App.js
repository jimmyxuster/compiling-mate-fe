import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import './App.css';
import { BrowserRouter as Router, Route, Link }  from 'react-router-dom';
import ConceptTree from "./component/ConceptTree/ConceptTree";
const { Header, Content, Sider } = Layout;

class App extends Component {
  render() {
    return (
        <Router>
            <Route path="/">
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
                        <Route path="/concepts" component={ConceptTree}/>
                        {/*<Sider width={200} style={{ background: '#fff' }}>*/}
                            {/*<Menu*/}
                                {/*mode="inline"*/}
                                {/*defaultSelectedKeys={['1']}*/}
                                {/*defaultOpenKeys={['sub1']}*/}
                                {/*style={{ height: '100%', borderRight: 0 }}*/}
                            {/*>*/}
                                {/*<Menu.Item key="1">option1</Menu.Item>*/}
                                {/*<Menu.Item key="2">option2</Menu.Item>*/}
                                {/*<Menu.Item key="3">option3</Menu.Item>*/}
                                {/*<Menu.Item key="4">option4</Menu.Item>*/}
                            {/*</Menu>*/}
                        {/*</Sider>*/}
                        {/*<Layout style={{ padding: '0 24px 24px' }}>*/}
                            {/*<Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>*/}
                            {/*</Content>*/}
                        {/*</Layout>*/}
                    </Layout>
                </Layout>
            </Route>
        </Router>
    );
  }
}

export default App;
