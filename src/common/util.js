function parseNodeFromStepAdd(step, nodes) {
    return [{
        id: step.node.id,
        name: step.node.text,
        value: parseProduction(step.node.production),
        rawProduction: step.node.production,
        level: step.node.relatedTo ? nodes.find(node => node.id === step.node.relatedTo).level + 1 : 1,
    }]
}

function parseLinkFromStepAdd(step) {
    if (!step.node.relatedTo) { return []; }
    return [{
        source: step.node.relatedTo,
        target: step.node.text,
        label: {
            show: true,
            position: 'middle',
            formatter: () => step.node.linkInfo,
        }
    }]
}

function parseNodeStates(treeSteps) {
    let states = [];
    treeSteps.forEach((step, index) => {
        let oldNodes, oldLinks, newState;
        oldNodes = index === 0 ? [] : (states[index - 1].data || []);
        oldLinks = index === 0 ? [] : (states[index - 1].links || []);
        switch (step.type) {
            case 'add':
                newState = {
                    data: [...oldNodes, ...parseNodeFromStepAdd(step, oldNodes)],
                    links: [...oldLinks, ...parseLinkFromStepAdd(step)],
                };
                states.push(newState);
                break;
            case 'delete':
                newState = {
                    data: oldNodes.filter(node => node.id !== step.node.id),
                    links: oldLinks.filter(link => link.source !== step.node.id && link.target !== step.node.id),
                }
                states.push(newState);
                break;
            default:
                console.error('unsupported event type detected: ' + step.type);
                break;
        }
    });
    return states;
}

function calcNodePositions(nodes) {
    let maxLevel = nodes.reduce((max, node) => Math.max(max, node.level), 1);
    let spanX = 1000 / (maxLevel + 1);
    for (let l = 1; l <= maxLevel; l++) {
        let levelNodes = nodes.filter(node => node.level === l);
        let spanY = 1000 / (levelNodes.length + 1);
        levelNodes.forEach((node, index) => {
            node.x = spanX * l;
            node.y = spanY * (index + 1);
        });
    }
    return nodes;
}

function parseProduction(arr) {
    if (!(arr instanceof Array) || arr.length !== 2 || arr[0].length !== arr[1].length) {
        throw new TypeError('production must be an array length of two!');
    }
    let result = '';
    for (let i = 0; i < arr[0].length; i++) {
        result += arr[0][i];
        result += '→';
        result += arr[1][i];
        result += '\n';
    }
    return result;
}

function handleEpsilon(input) {
    if (input instanceof Array) {
        return input.map(str => str.replace('epsilon', 'ε'));
    } else {
        let result = Object.create(null);
        Object.keys(input).forEach(key => {
            if (typeof input[key] === 'string') {
                Object.assign(result, {[key]: input[key].replace('epsilon', 'ε')});
            } else {
                Object.assign(result, {[key]: handleEpsilon(input[key])});
            }
        })
        return result;
    }
}

export {parseNodeStates, calcNodePositions, handleEpsilon};