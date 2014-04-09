describe("The labs", function () {
    beforeEach(function () {
        this.addMatchers({
            toBeSome: function (expected) {
                return this.actual.some() == expected
            },
            toBeNone: function () {
                return this.actual.isNone()
            }
        });
    });


    describe("will desugar 'Do' notation", function () {
        it("For simple Maybes", function () {
            var code = Do(
                    "a<-Some(1);" +
                    "b<-Some(2);" +
                    "return a+b"
            )
            expect(code).toBeSome(3)
        })
        it("For Nones", function () {
            var code = Do(
                    "a<-Some(1);" +
                    "b<-Some(2);" +
                    "c<-None();" +
                    "return a+b"
            )
            expect(code).toBeNone()
        })
        it("For weird spaces", function () {
            var code = Do(
                    "a <- Some(1);" +
                    "b <- Some(2);" +
                    "c <- Some(3);" +
                    "return a+b+c"
            )
            expect(code).toBeSome(6)
        })

        it("no final map", function () {
            var code = Do(
                    "a <- Some(1);" +
                    "b<-Some(4);" +
                    "None()")
            expect(code).toBeNone()

        })

        it("with scope", function () {
            var c = Some(4)
            var code = DoNoEval(
                    "a <- c;" +
                    "b<-Some(4);" +
                    "return b+a")
            var result = eval(code)
            expect(result).toBeSome(8)

        })

    })
})