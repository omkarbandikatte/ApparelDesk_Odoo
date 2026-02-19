// Test file with intentional bugs for ESLint to detect

function unusedFunction() {
    const unusedVar = "This variable is never used"
    let anotherUnused = 123
    return "hello"
}

function missingSemicolons() {
    let x = 10
    let y = 20
    let z = x + y
    console.log(z)
    return z
}

function badIndentation() {
let a = 1
    let b = 2
        let c = 3
  let d = 4
    return a + b + c + d
}

function undefinedVariable() {
    const result = ordre * 2  // 'ordre' is not defined
    return result
}

function mixedProblems() {
const unused1 = "never used"
    const unused2 = "also unused"
  let value = 100
        return value
}
