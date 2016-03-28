"use strict";

// TODO: Should probably be specified by requestor
const MAX_NUMBER = 99;
const OPERATORS = ['+', '-', '*', '/', '%'];

function mathProducer() {
    let leftOperand = getRandomInteger(MAX_NUMBER + 1);
    let rightOperand = getRandomInteger(MAX_NUMBER + 1);
    let operatorIndex = getRandomInteger(OPERATORS.length);
    let operator = OPERATORS[operatorIndex];

    return `${leftOperand} ${operator} ${rightOperand}`;

    // Returns a random integer between 0 and the max provided (exclusive)
    function getRandomInteger(maxExclusive) {
        return Math.floor(Math.random() * maxExclusive);
    }
}

module.exports = mathProducer;