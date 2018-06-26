import React from 'react';
import {Form, Button, Icon, Input, Col, Alert} from 'antd';
import PropTypes from 'prop-types';
import './CfgInput.css';
const FormItem = Form.Item;

let cfgId = 0;
class CfgInput extends React.Component {

    static propTypes = {
        onSubmit: PropTypes.func,
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let submitObj = Object.create(null);
                Object.keys(values).forEach(key => {
                    if (key !== 'cfg') { // cfg is the private id attribute used in this component
                        Object.assign(submitObj, {[key]: values[key]});
                    }
                });
                if (this.props.onSubmit) {
                    this.props.onSubmit(submitObj);
                }
            }
        });
    }

    add = () => {
        this.props.form.setFieldsValue({ cfg: this.props.form.getFieldValue('cfg').concat(++cfgId) });
    }

    remove = (cfgIndex) => {
        const { form } = this.props;
        const cfgIndexes = form.getFieldValue('cfg');
        if (cfgIndexes.length === 1) {
            return;
        }
        form.setFieldsValue({
            cfg: cfgIndexes.filter(key => key !== cfgIndex),
        });
    }

    inputEpsilon = (ev) => {
        const {setFieldsValue, getFieldValue} = this.props.form;
        if (ev.target.id && ev.key.toLowerCase() === 'alt') {
            const oldVal = getFieldValue(ev.target.id);
            setFieldsValue({[ev.target.id]: (oldVal || '') + 'ε'})
        }
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        getFieldDecorator('cfg', {initialValue: [cfgId]})
        const formstartSymbolLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 2 },
        };
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                span: 8, offset: 2,
            },
        };
        const formItemLayoutFullLength = {
            labelCol: { span: 0 },
            wrapperCol: { span: 8, offset: 2 },
        };
        const inputCfgs = getFieldValue('cfg').map((cfg, index) => (
          <FormItem {...formItemLayout} label={`产生式${index + 1}`} key={cfg}>
              <Col span={10}>
                  <FormItem>
                      {getFieldDecorator(`cfgs[${index}].left`, {
                          rules: [{
                              required: true,
                              message: '请输入产生式',
                          }],
                      })(
                          <Input placeholder="" id={`cfgs[${index}].left`} onKeyDown={this.inputEpsilon}/>
                      )}
                  </FormItem>
              </Col>
              <Col span={2}>
                <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                    <i className="iconfont">&#xe96d;</i>
                </span>
              </Col>
              <Col span={10}>
                  <FormItem>
                      {getFieldDecorator(`cfgs[${index}].right`, {
                          rules: [{
                              required: true,
                              message: '请输入产生式',
                          }],
                      })(
                          <Input placeholder="" id={`cfgs[${index}].right`} onKeyDown={this.inputEpsilon}/>
                      )}
                  </FormItem>
              </Col>
              <Col span={2}>
                  {getFieldValue('cfg').length > 1 ? (
                      <Icon type="close-circle dynamic-delete-button" onClick={() => this.remove(cfg)}/>
                  ) : null}
              </Col>
          </FormItem>
        ));
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayoutFullLength}>
                    <Alert message="请使用空格将文法符号分开，按下alt键输入ε" type="info" style={{width: '91.67%'}} showIcon />
                </FormItem>
                <FormItem {...formstartSymbolLayout} label="开始符号">
                    {getFieldDecorator('startSymbol', {
                        rules: [{
                            required: true,
                            message: '请输入开始符号',
                        }],
                    })(
                        <Input placeholder=""/>
                    )}
                </FormItem>
                {inputCfgs}
                <FormItem {...formItemLayoutWithOutLabel}>
                    <Button type="dashed" onClick={this.add} style={{width: '91.67%'}}>
                        <Icon type="plus"/> 增加一行
                    </Button>
                </FormItem>
                <FormItem {...formItemLayoutWithOutLabel}>
                    <Button type="primary" htmlType="submit">提交</Button>
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(CfgInput);