// peek implementation
Array.prototype.peek = function(){
    return this[this.length - 1];
}

var Calculator = {
    operation: {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '/': (a, b) => a / b,
        '*': (a, b) => a * b,
        '^': (a, b) => Math.pow(a, b)
    },
    calculate: function(expression){
        let result;
        try{
            expression = this.format(expression);
            var stack = this.createStack(expression);
            result = this.calc(stack);
        }
        catch(e){
            result = e.message;
        }
        return result;
    },
    format: function(expression){
        // patterns
        let undefiend = /[^\d\+\-\*\/\)\(\^]/g;
        let twoOperators = /[\+}\-|\*|\/|\^]{2,}/g;

        let errors = ''; let err;
        expression = expression.trim().replace(/\s+/g, '');
        // check empty string
        if(!expression){
            throw new Error("Передана пустая стока!");
        }

        // validate brackets function
        var validateBrackets = function(){
            let pos = 0;
            let chars = expression.split('');
            for(let i = 0; i < chars.length; i++){
                if(chars[i] == '('){
                    pos++;
                }
                else if(chars[i] == ')'){
                    if(pos == 0){
                        return false;
                    }
                    pos--;
                }
            }
            return pos == 0;
        }

        // check brackets
        if(!validateBrackets()){
            errors += 'Ошибка со скобками';
        }

        // check two or more operators suborder
        if(twoOperators.test(expression)){
            errors += 'Два или больше оператора подряд!';
        }
        // check undefiend symbols
        while(err = undefiend.exec(expression)){
            errors += "Неопознаный символ " + err[0] + " на позиции " + "["+(err.index + 1)+"]" + "\n";
        }    

        if(errors){
            throw new Error(errors);
        }         
        return expression;
    },

    createStack: function(expression){
        // regex patterns
        const tokens = /\d+|\+|\-|\*|\/|\)|\(|\^/g;
        const number = /\d+/;
        const bracket = /\(|\)/;
        const operator = /\+|\-|\*|\/|\^/;

        const operators = [['^'], ['*', '/'], ['+', '-']]; // priority

        let mc = expression.match(tokens);

        let stOper = [];
        let expr = [];

        mc.forEach(match => {
            if(number.test(match)){expr.push(match);return;} // number
            if(bracket.test(match)){                         // bracket
                if(match == '('){
                    stOper.push(match); 
                    return;
                }
                var op = stOper.pop();
                while(op != '('){
                    expr.push(op);
                    op = stOper.pop();
                }
                return;
            }
            if(operator.test(match)){
                while (operators.findIndex(el => el.some(o => o == match)) >= operators.findIndex(el => el.some(o => o == stOper.peek())) && stOper.length != 0)
                {
                    if (stOper.peek() == "(") break;
                    expr.push(stOper.pop());
                }
                stOper.push(match);
            };
        });

        while (stOper.length != 0)
        {

            expr.push(stOper.pop());
        }

        return expr;
    },

    calc: function(array){
        let numbers = [];
        let op1, op2;

        array.forEach(el => {
            let n;
            let res = "";
            if(!isNaN(parseInt(el))){
                numbers.push(parseInt(el));
            }
            else{
                op2 = numbers.pop();
                op1 = numbers.pop();
                numbers.push(this.operation[el](op1, op2));
            }
        });

        return numbers.pop();
    }
};