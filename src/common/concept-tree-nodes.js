export default {
    children: [{
        name: '编译器',
        children: [
            {
                name: '词法分析',
                children: [
                    {
                        name: 'RE to NFA',
                        children: [],
                    },
                    {
                        name: 'NFA to DFA',
                        children: [],
                    },
                    {
                        name: 'RE to DFA',
                        children: [],
                    }
                ]
            },
            {
                name: '语法分析',
                children: [
                    {
                        name: 'LL(1)',
                        children: [],
                    },
                    {
                        name: 'SLR',
                        children: [],
                    },
                    {
                        name: 'LALR',
                        children: [],
                    },
                ]
            },
        ]
    }]
}