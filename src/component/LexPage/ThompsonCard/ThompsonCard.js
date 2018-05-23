import React, { Component } from 'react';
import { Card } from 'antd';

class ThompsonCard extends Component {


  render() {
    return (
    <Card className="thompson-card" title="Thompson Algorithm" bordered={false}>
      This is Thompson Algorithm
    </Card>
    );
  }
}

export default ThompsonCard;
