export default {
    children: [{
        name: 'Compilers',
        children: [
            {
                name: 'Lexical Analysis',
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
                name: 'Syntax Analysis',
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