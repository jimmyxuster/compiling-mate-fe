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
        this.handleMenuSelected = this.handleMenuSelected.bind(this);
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
                    this.state = {menus: menu, selectedSideMenu: [menu[0].to]};
                } else if (locs.length === 2) {
                    this.setState({menus: menu, selectedSideMenu: [menu[0].to]});
                } else {
                    this.setState({menus: menu});
                }
            }
            if (locs.length === 2) {
                this.props.history.replace(menuConfig[locs[1]][0].to, null);
            }
        }
    }

    handleMenuSelected({key}) {
        console.log(key)
        let a = [];
        a.push(key)
        this.setState({selectedSideMenu: a});
    }

    render () {
        return (
            <Layout>
                <Sider width={200} style={{ background: '#fff' }}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['0']}
                        selectedKeys={this.state.selectedSideMenu}
                        style={{ height: '100%', borderRight: 0 }}
                        onClick={({key}) => this.setState({selectedSideMenu: [key]})}
                    >
                        {this.state.menus.map((menu, index) => <Menu.Item key={menu.to}><Link to={menu.to}>{menu.name}</Link></Menu.Item>)}
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