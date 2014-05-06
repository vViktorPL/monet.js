//     monet-labs.js 0.8.0

//     (c) 2012-2014 Chris Myers
//     Monet.js may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://cwmyers.github.com/monet.js


(function (window) {

    function createFlatMap(line, acc, needsMap, noReturn) {
        var splitLine = line.split("<-")
        var variable = splitLine[0]
        var monad = splitLine[1]
        return {code: "(" + monad + ")" +
            "." +
            (needsMap ? "map" : "flatMap") +
            "(function(" +
            variable + "){ " +
            (noReturn ? "" : "return ") +
            acc +
            " })", needsMap: false}
    }


    function desugar(code) {
        return code.foldRight({code: "", needsMap: false})(function (line, acc) {

            if (line.contains("return")) {
                return {code: line.replace("return", ""), needsMap: true}
            }

            if (line.contains("let ")) {
                return {code: line.replace("let ", "var ").concat("; return " + acc.code), needsMap: false, noReturn: true}
            }

            if (acc.code == "") {
                return {code: line, needsMap: false}
            }

            return createFlatMap(line, acc.code, acc.needsMap, acc.noReturn);
        })
    }

    var Do = window.Do = function (comprehension) {
        var compiledCode = DoNoEval(comprehension);
        try {
            return eval(compiledCode);
        } catch (e) {
            throw "Failed to execute block\n" + compiledCode + "\n" + e
        }
    }

    var DoNoEval = window.DoNoEval = function (comprehension) {
        var code = comprehension.split(/[;\n]/).list()
        var comments = code.map(function (x) {
            return "//" + x + "\n"
        })
        var block = comments.foldLeft("//Generated from the following Monet Do notation\n")(function (a, b) {
            return a + b
        }) + desugar(code).code;
        console.log(block);
        return  block;
    }

    return this;

})(window || this);