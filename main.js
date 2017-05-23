
window.onload = function(){
    document.getElementById('calculate').onclick = calculate;
    document.onkeydown = function(e){
        if(e.keyCode == 13){
            calculate(e);
        }
    };

    function calculate (e){
        var expression = document.getElementById('expression').value; // calculate
        document.getElementById('result').innerText = Calculator.calculate(expression);
    };
}