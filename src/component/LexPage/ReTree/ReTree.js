import React, {Component} from 'react';
import * as echarts from 'echarts';
import PropTypes from 'prop-types';

class ReTree extends Component {
  constructor () {
    super ();
    this.state = {
      currentTicket: null,
    };
    this.treeChart = null;
  }

  componentDidMount () {
    this.treeChart = echarts.init (document.getElementById ('re_tree'));
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.data !== this.props.data;
  }

  componentDidUpdate () {
    let data = this.props.data;
    let self = this;

    function processData (data) {
      data.name = data.token.content;
      if (data.children) {
        data.children.forEach (val => processData (val));
      }
    }
    processData (data);
    const treeOption = {
      title: {
        text: 'RE树',
      },
      tooltip: {},
      series: [
        {
          type: 'tree',
          data: [this.props.data],
          left: '2%',
          right: '2%',
          top: '8%',
          bottom: '20%',
          symbol: 'circle',
          symbolSize: 24,
          orient: 'vertical',
          expandAndCollapse: false,
          label: {
            position: 'inside',
            normal: {
              position: 'inside',
              rotate: 0,
              verticalAlign: 'middle',
              align: 'middle',
              fontSize: 12,
            },
          },
          tooltip: {
            formatter: function (params, ticket, callback) {
              if (params.data.id !== -1)
                self.props.setCurrentId (params.data.id);
              return '';
            },
          },
          leaves: {
            label: {
              normal: {
                symbol: 'circle',
                position: 'inside',
                rotate: 0,
                verticalAlign: 'middle',
                align: 'middle',
              },
            },
          },
          animationDurationUpdate: 750,
        },
      ],
    };
    if (this.treeChart !== null) {
      this.treeChart.clear ();
      this.treeChart.setOption (treeOption);
    }
  }

  render () {
    return <div id="re_tree" style={{height: 500}} />;
  }
}

ReTree.defaultProps = {
  data: null,
};

ReTree.propTypes = {
  data: PropTypes.object,
  setCurrentId: PropTypes.func,
};

export default ReTree;
