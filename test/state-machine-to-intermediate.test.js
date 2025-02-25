import '@jest/globals';
import stateMachineToIntermediate from '../src/generator/state-machine-to-intermediate.js';

describe('state-machine-to-intermediate', () => {
    test('should convert a parse tree of two-state machine to equivalent intermediate form', () => {
        const stateMachine = {
            timers: [],
            states: [{
                state: 10,
                statements: [{
                    left: 'X',
                    right: 1,
                    operator: '+',
                    out: 'X'
                }],
                transitions: [{
                    condition: {
                        left: {
                            left: 'X',
                            right: 3,
                            operator: '%'
                        },
                        right: 0,
                        operator: '=',
                    },
                    goto: 20
                }, {
                    goto: 10
                }]
            }, {
                state: 20,
                statements: [{
                    left: 'Y',
                    right: 1,
                    operator: '+',
                    out: 'Y'
                }],
                transitions: [{
                    goto: 10
                }]
            }]
        };
        const expected = {
            timers: [],
            states: [{
                state: 10,
                statements: [{
                    start: 10,
                    operations: [[{
                        guard: true
                    }], [{
                        left: 'GUARD',
                        right: 1,
                        operator: '*',
                        out: 'signal_X'
                    }]]
                }, {
                    start: 12,
                    operations: [[{
                        left: 'signal_X',
                        right: 3,
                        operator: '%',
                        out: 'INT_A'
                    }], [{
                        left: 'INT_A',
                        right: 0,
                        operator: '=',
                        countFromInput: false,
                        out: 'INT_A'
                    }, {
                        guard: true
                    }], [{
                        left: 'INT_A',
                        right: 'GUARD',
                        operator: '*',
                        out: 'INT_A'
                    }], [{
                        branch: 'INT_A',
                        goto: 20
                    }]]
                }, {
                    start: 16,
                    operations: [[{
                        guard: true
                    }], [{
                        branch: 'GUARD',
                        goto: 10
                    }]]
                }]
            }, {
                state: 20,
                statements: [{
                    start: 20,
                    operations: [[{
                        guard: true
                    }], [{
                        left: 'GUARD',
                        right: 1,
                        operator: '*',
                        out: 'signal_Y'
                    }]]
                }, {
                    start: 22,
                    operations: [[{
                        guard: true // TODO: Figure out the best way to share guards
                    }], [{
                        branch: 'GUARD',
                        goto: 10
                    }]]
                }]
            }]
        };

        const result = stateMachineToIntermediate(stateMachine);

        expect(result).toEqual(expected);
    });

    test('should convert a parse tree of two-state machine with labels to equivalent intermediate form', () => {
        const stateMachine = {
            timers: [],
            states: [{
                state: "start",
                statements: [{
                    left: 'X',
                    right: 1,
                    operator: '+',
                    out: 'X'
                }],
                transitions: [{
                    condition: {
                        left: {
                            left: 'X',
                            right: 3,
                            operator: '%'
                        },
                        right: 0,
                        operator: '=',
                    },
                    goto: "end"
                }, {
                    goto: "start"
                }]
            }, {
                state: "end",
                statements: [{
                    left: 'Y',
                    right: 1,
                    operator: '+',
                    out: 'Y'
                }],
                transitions: [{
                    goto: "start"
                }]
            }]
        };
        const expected = {
            timers: [],
            states: [{
                state: 0,
                statements: [{
                    start: 0,
                    operations: [[{
                        guard: true
                    }], [{
                        left: 'GUARD',
                        right: 1,
                        operator: '*',
                        out: 'signal_X'
                    }]]
                }, {
                    start: 2,
                    operations: [[{
                        left: 'signal_X',
                        right: 3,
                        operator: '%',
                        out: 'INT_A'
                    }], [{
                        left: 'INT_A',
                        right: 0,
                        operator: '=',
                        countFromInput: false,
                        out: 'INT_A'
                    }, {
                        guard: true
                    }], [{
                        left: 'INT_A',
                        right: 'GUARD',
                        operator: '*',
                        out: 'INT_A'
                    }], [{
                        branch: 'INT_A',
                        goto: 9
                    }]]
                }, {
                    start: 6,
                    operations: [[{
                        guard: true
                    }], [{
                        branch: 'GUARD',
                        goto: 0
                    }]]
                }]
            }, {
                state: 9,
                statements: [{
                    start: 9,
                    operations: [[{
                        guard: true
                    }], [{
                        left: 'GUARD',
                        right: 1,
                        operator: '*',
                        out: 'signal_Y'
                    }]]
                }, {
                    start: 11,
                    operations: [[{
                        guard: true // TODO: Figure out the best way to share guards
                    }], [{
                        branch: 'GUARD',
                        goto: 0
                    }]]
                }]
            }]
        };

        const result = stateMachineToIntermediate(stateMachine);

        expect(result).toEqual(expected);
    });

    test('should convert a parse tree of two-state machine with a mix of labels to equivalent intermediate form', () => {
        const stateMachine = {
            timers: [],
            states: [{
                state: "start",
                statements: [{
                    left: 'X',
                    right: 1,
                    operator: '+',
                    out: 'X'
                }],
                transitions: [{
                    condition: {
                        left: {
                            left: 'X',
                            right: 3,
                            operator: '%'
                        },
                        right: 0,
                        operator: '=',
                    },
                    goto: 100
                }, {
                    goto: "start"
                }]
            }, {
                state: 100,
                statements: [{
                    left: 'Y',
                    right: 1,
                    operator: '+',
                    out: 'Y'
                }],
                transitions: [{
                    goto: "start"
                }]
            }]
        };
        const expected = {
            timers: [],
            states: [{
                state: 105,
                statements: [{
                    start: 105,
                    operations: [[{
                        guard: true
                    }], [{
                        left: 'GUARD',
                        right: 1,
                        operator: '*',
                        out: 'signal_X'
                    }]]
                }, {
                    start: 107,
                    operations: [[{
                        left: 'signal_X',
                        right: 3,
                        operator: '%',
                        out: 'INT_A'
                    }], [{
                        left: 'INT_A',
                        right: 0,
                        operator: '=',
                        countFromInput: false,
                        out: 'INT_A'
                    }, {
                        guard: true
                    }], [{
                        left: 'INT_A',
                        right: 'GUARD',
                        operator: '*',
                        out: 'INT_A'
                    }], [{
                        branch: 'INT_A',
                        goto: 100
                    }]]
                }, {
                    start: 111,
                    operations: [[{
                        guard: true
                    }], [{
                        branch: 'GUARD',
                        goto: 105
                    }]]
                }]
            }, {
                state: 100,
                statements: [{
                    start: 100,
                    operations: [[{
                        guard: true
                    }], [{
                        left: 'GUARD',
                        right: 1,
                        operator: '*',
                        out: 'signal_Y'
                    }]]
                }, {
                    start: 102,
                    operations: [[{
                        guard: true // TODO: Figure out the best way to share guards
                    }], [{
                        branch: 'GUARD',
                        goto: 105
                    }]]
                }]
            }]
        };

        const result = stateMachineToIntermediate(stateMachine);

        expect(result).toEqual(expected);
    });

    test('should convert a parse tree of two-state machine with alphanumerics labels to equivalent intermediate form', () => {
        const stateMachine = {
            timers: [],
            states: [{
                state: "state1",
                statements: [{
                    left: 'X',
                    right: 1,
                    operator: '+',
                    out: 'X'
                }],
                transitions: [{
                    condition: {
                        left: {
                            left: 'X',
                            right: 3,
                            operator: '%'
                        },
                        right: 0,
                        operator: '=',
                    },
                    goto: "state2"
                }, {
                    goto: "state1"
                }]
            }, {
                state: "state2",
                statements: [{
                    left: 'Y',
                    right: 1,
                    operator: '+',
                    out: 'Y'
                }],
                transitions: [{
                    goto: "state1"
                }]
            }]
        };
        const expected = {
            timers: [],
            states: [{
                state: 0,
                statements: [{
                    start: 0,
                    operations: [[{
                        guard: true
                    }], [{
                        left: 'GUARD',
                        right: 1,
                        operator: '*',
                        out: 'signal_X'
                    }]]
                }, {
                    start: 2,
                    operations: [[{
                        left: 'signal_X',
                        right: 3,
                        operator: '%',
                        out: 'INT_A'
                    }], [{
                        left: 'INT_A',
                        right: 0,
                        operator: '=',
                        countFromInput: false,
                        out: 'INT_A'
                    }, {
                        guard: true
                    }], [{
                        left: 'INT_A',
                        right: 'GUARD',
                        operator: '*',
                        out: 'INT_A'
                    }], [{
                        branch: 'INT_A',
                        goto: 9
                    }]]
                }, {
                    start: 6,
                    operations: [[{
                        guard: true
                    }], [{
                        branch: 'GUARD',
                        goto: 0
                    }]]
                }]
            }, {
                state: 9,
                statements: [{
                    start: 9,
                    operations: [[{
                        guard: true
                    }], [{
                        left: 'GUARD',
                        right: 1,
                        operator: '*',
                        out: 'signal_Y'
                    }]]
                }, {
                    start: 11,
                    operations: [[{
                        guard: true // TODO: Figure out the best way to share guards
                    }], [{
                        branch: 'GUARD',
                        goto: 0
                    }]]
                }]
            }]
        };

        const result = stateMachineToIntermediate(stateMachine);

        expect(result).toEqual(expected);
    });
});