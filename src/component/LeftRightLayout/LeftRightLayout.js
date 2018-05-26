import React from 'react';
import { Menu, Layout } from 'antd';
import { Route } from 'react-router-dom';
import SLR from '../SLR/SLR'
const { Sider, Content } = Layout;

class LeftRightLayout extends React.Component {
    render () {
        return (
            <Layout>
                <Sider width={200} style={{ background: '#fff' }}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        style={{ height: '100%', borderRight: 0 }}
                    >
                        <Menu.Item key="1">option1</Menu.Item>
                        <Menu.Item key="2">option2</Menu.Item>
                        <Menu.Item key="3">option3</Menu.Item>
                        <Menu.Item key="4">option4</Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="lr__content" style={{ padding: '24px 24px' }}>
                    <Content style={{ background: '#fff', padding: '12px', margin: 0, height: '100%' }}>
                        <Route path="/algorithm/slr" component={SLR} />
                    </Content>
                </Layout>
            </Layout>
        )
    }
}

export default LeftRightLayout;