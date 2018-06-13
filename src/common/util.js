function parseNodeFromStepAdd(step, nodes) {
    let conflictNode, name = step.node.text;
    do {
        conflictNode = nodes.find(node => node.name === name);
        if (conflictNode) {
            name = name + "'";
        }
    } while (conflictNode);
    step.node.text = name;
    return [{
        id: step.node.text,
        name,
        value: parseProduction(step.node),
        rawProduction: {productionLeft: step.node.productionLeft, productionRight: step.node.productionRight},
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
    let spanX = maxLevel > 1 ? 1000 / (maxLevel - 1) : 500;
    for (let l = 1; l <= maxLevel; l++) {
        let levelNodes = nodes.filter(node => node.level === l);
        let spanY = 1000 / (levelNodes.length + 1);
        levelNodes.forEach((node, index) => {
            node.x = spanX * (maxLevel > 1 ? l - 1 : l);
            node.y = spanY * (index + 1);
        });
    }
    return nodes;
}

function parseProduction(node) {
    if (!('productionLeft' in node) || !('productionRight' in node)) {
        throw new TypeError('productionLeft and productionRight must be attributes of node!');
    }
    let result = '';
    for (let i = 0; i < node.productionLeft.length; i++) {
        result += node.productionLeft[i];
        result += '→';
        result += node.productionRight[i];
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