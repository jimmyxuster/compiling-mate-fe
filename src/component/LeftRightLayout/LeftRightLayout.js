import React from 'react';
import { Menu, Layout } from 'antd';
import { Route, Link } from 'react-router-dom';
import SLR from '../SLR/SLR'
import menuConfig from '../../common/menu-config';
const { Sider, Content } = Layout;

class LeftRightLayout extends React.Component {

    constructor(props) {
        super(props);
        this.refreshMenus();
    }

    componentWillReceiveProps(newProps) {
        if ('location' in newProps) {
            this.refreshMenus();
        }
    }

    refreshMenus() {
        if (!!this.props.location) {
            let locs = this.props.location.pathname.split('/');

            if (locs.length > 1 && locs[1] in menuConfig) {
                let menu = menuConfig[locs[1]];
                if (this.state === undefined) {
                    this.state = {menus: menu};
                } else {
                    this.setState({menus: menu});
                }
            }
            if (locs.length === 2) {
                this.props.history.replace(menuConfig[locs[1]][0].to, null);
            }
        }
    }

    render () {
        return (
            <Layout>
                <Sider width={200} style={{ background: '#fff' }}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['0']}
                        style={{ height: '100%', borderRight: 0 }}
                    >
                        {this.state.menus.map((menu, index) => <Menu.Item key={index}><Link to={menu.to}>{menu.name}</Link></Menu.Item>)}
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