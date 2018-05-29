function culPosition(data) {
  let res = {
    nodes: data.nodes,
    links: data.links
  };
  let inDegree = [];
  let outDegree = [];
  let nexts = [];
  let visited = [];
  for(let i = 0; i < data.nodes.length; i++) {
    inDegree[i] = 0;
    outDegree[i] = 0;
    nexts[i] = [];
    visited[i] = false;
  }
  data.links.forEach(val => {
    outDegree[val.source]++;
    inDegree[val.target]++;
    nexts[val.source].push(val.target);
  });


  let forkDeepStack = [];
  function rec(current, cx, cy, offsety, deep) {
    if(visited[current]) return;

    visited[current] = true;
    res.nodes[current].x = cx;
    res.nodes[current].y = cy;

    if(outDegree[current] === 0) return;

    if(outDegree[current] === 1) {
      if(inDegree[nexts[current][0]] === 2) {
        if(forkDeepStack[forkDeepStack.length-1] !== deep) {
          rec(nexts[current][0], cx + 100, cy + offsety, deep - 1);
        } else {
          forkDeepStack.pop();
          return;
        }
      } else {
        rec(nexts[current][0], cx + 100, cy, offsety, deep);
      }
    }

    if(outDegree[current] === 2) {
      let n1 = nexts[current][0];
      let n2 = nexts[current][1];
      if(visited[n1] || visited[n2]) {
        if(visited[n1])
          rec(n2, cx + 100, cy, offsety,deep);
        if(visited[n2])
          rec(n1, cx + 100, cy, offsety,deep);
      } else if(inDegree[n1] === 1 && inDegree[n2] === 1) {
        forkDeepStack.push(deep + 1);
        rec(n1, cx + 100, cy + 0.8*offsety, 0.8 * offsety, deep + 1);
        rec(n2, cx + 100, cy - 0.8*offsety, 0.8 * offsety, deep + 1);
      } else {
        let n;
        n1 > n2 ? n = n2 : n = n1;
        rec(n, cx + 100, cy, offsety, deep);
      }
    }
  }
  rec(0, 0, 0, 80, 0);
  return res;
}

function drawNfa(chart, data) {
  let res = culPosition(data);
  const graphOption = {
    title: {
      text: 'NFA图'
    },
    tooltip: {},
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        type: 'graph',
        layout: 'none',
        symbolSize: 35,
        roam: false,
        label: {
          normal: {
            show: true
          }
        },
        edgeSymbol: [
          'circle', 'arrow'
        ],
        edgeSymbolSize: [
          4, 10
        ],
        edgeLabel: {
          normal: {
            textStyle: {
              fontSize: 12
            }
          }
        },
        data: res.nodes,
        links: res.links,
        lineStyle: {
          normal: {
            opacity: 0.9,
            width: 2,
            curveness: 0
          }
        }
      }
    ]
  };
  chart.setOption(graphOption);
}

export {drawNfa};