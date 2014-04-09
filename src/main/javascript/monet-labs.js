//     monet-labs.js 0.8.0

//     (c) 2012-2014 Chris Myers
//     Monet.js may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://cwmyers.github.com/monet.js


(function (window) {

    function createFlatMap(line, acc, needsMap) {
        var splitLine = line.split("<-")
        var variable = splitLine[0]
        var monad = splitLine[1]
        return {code: "(" + monad + ")" +
            "." +
            (needsMap ? "map" : "flatMap") +
            "(function(" +
            variable + "){ return " +
            acc +
            " })", needsMap: false}
    }


    function desugar(code) {
        return code.foldRight({code: "", needsMap: false})(function (line, acc) {

            if (line.contains("return")) {
                return {code: line.replace("return", ""), needsMap: true}
            }

            if (acc.code == "") {
                return {code: line, needsMap: false}
            }

            return createFlatMap(line, acc.code, acc.needsMap);
        })
    }

    var Do = window.Do = function (comprehension) {
        return eval(DoNoEval(comprehension));
    }

    var DoNoEval = window.DoNoEval = function(comprehension) {
        var code = comprehension.split(/[;\n]/).list()
        var x = desugar(code);
        console.log(x.code);
        return x.code;
    }

    return this;

})(window || this);