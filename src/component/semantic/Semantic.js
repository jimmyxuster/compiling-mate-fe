import React from 'react';
import {Table, Row, Col} from 'antd';
import data from './data.json';
import './Semantic.css';

const {Column} = Table;

class Semantic extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            actionOutputStep: 0,
        }
    }
    render() {
        const prodRules = data.prodRules.map(line => (
            <Row key={line.prodLeft + line.prodRight}>
                <Col span={8}>
                    <p>{line.prodLeft}<i className="iconfont">&#xe96d;</i>{line.prodRight}</p>
                </Col>
                <Col span={15} offset={1}>
                    {line.rules.map((rule, index) => (
                        <p key={`rule${index}`}>{index <= 0 ? '{ ' + rule : rule}{index < line.rules.length - 1 ? null : ' }'}</p>
                    ))}
                </Col>
            </Row>
        ));
        return (
          <div className="semantic">
              <h2>类型检查SDT实例演示</h2>
              <div className="input">
                  <span>输入为：</span>
                  <span>{data.input}</span>
              </div>
              <Row>
                  <Col span={11}>
                      <Table dataSource={data.tableSource} bordered pagination={false}
                             rowClassName={(record, index) => index <= this.state.actionOutputStep ? 'row' : 'row inactive'}
                             onRow={(record, index) => {
                                 return {
                                     onClick: () => {this.setState({actionOutputStep: index})},       // 点击行
                                 };
                             }}>
                          <Column
                              align="center"
                              title="Stack"
                              dataIndex="Stack"
                              key="Stack"
                          />
                          <Column
                              align="center"
                              title="Input"
                              dataIndex="Input"
                              key="Input"
                          />
                          <Column
                              align="center"
                              title="Semantic Rules to Action"
                              dataIndex="Semantic Rules to Action"
                              key="Semantic Rules to Action"
                          />
                      </Table>
                  </Col>
                  <Col span={11} offset={2}>
                      {prodRules}
                  </Col>
              </Row>
          </div>
        );
    }
}

export default Semantic;