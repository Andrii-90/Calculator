let showResult = document.getElementById("presentation-result");
let calcResult = document.getElementById("presentation-calculate");

showResult.innerHTML = "";
calcResult.innerHTML = null;

// let addNumber0 = document.getElementById("num0");
// let addNumber1 = document.getElementById("num1");
// let addNumber2 = document.getElementById("num2");
// let addNumber3 = document.getElementById("num3");
// let addNumber4 = document.getElementById("num4");
// let addNumber5 = document.getElementById("num5");
// let addNumber6 = document.getElementById("num6");
// let addNumber7 = document.getElementById("num7");
// let addNumber8 = document.getElementById("num8");
// let addNumber9 = document.getElementById("num9");
// let addcomma = document.getElementById("comma");
// console.log(addcomma.getAttribute("name"));

function printNum(button) {
    const newChar = button.getAttribute("name");
    const lastChar = calcResult.innerHTML.at(-1);
    const currentInput = calcResult.innerHTML;
    const operators = ["-", "+", "*", "/", "."];
    
    // ❌ Blokuj symbole na początku
    if (currentInput === "" && (operators.includes(newChar) || newChar === "%" || newChar === ")")) {
        return;
    }
    // ❌ Blokuj dwa operatory pod rząd
    if (operators.includes(newChar) && operators.includes(lastChar)) {
        calcResult.innerHTML = calcResult.innerHTML.slice(0,-1);
        calcResult.innerHTML += newChar;
        return;
    }
    if (operators.includes(newChar) && lastChar == "(" && newChar !== "-") {
        return;
    }
    // ❌ Blokuj dwa procenty pod rząd
    if (newChar === "%" && lastChar === "%") {
        return;
    }
    // ❌ Blokuj procent po operatorze
    if (newChar === "%" && operators.includes(lastChar)) {
        return;
    }
    // ❌ Blokuj nawias zamykający, jeśli byłoby go więcej niż otwierających
    if (newChar === ")") {
        const openCount = (currentInput.match(/\(/g) || []).length;
        const closeCount = (currentInput.match(/\)/g) || []).length;
        if (closeCount >= openCount) {
            return;
        }
    }
    // ❌ Blokuj więcej niż jedną kropkę w jednej liczbie
    if (newChar === ".") {
        // znajdź ostatni operator (lub początek)
        const lastOperatorIndex = Math.max(
            currentInput.lastIndexOf("+"),
            currentInput.lastIndexOf("-"),
            currentInput.lastIndexOf("*"),
            currentInput.lastIndexOf("/"),
            currentInput.lastIndexOf("%")
        );
        const lastNumberPart = currentInput.slice(lastOperatorIndex + 1);
        if (lastNumberPart.includes(".")) {
            return;
        }
    }
    // ❌ Blokuj zamykanie nawiasu jeś w nim niema wyrażenia
    if (newChar === ")") {
        const openCount = (currentInput.match(/\(/g) || []).length;
        const closeCount = (currentInput.match(/\)/g) || []).length;
    
        if (closeCount >= openCount) {
            return; // ❌ za dużo zamykających nawiasów
        }
    
        // 🔎 sprawdź czy między ostatnim '(' a końcem stringa jest cyfra
        const lastOpenIndex = currentInput.lastIndexOf("(");
        const contentInside = currentInput.slice(lastOpenIndex + 1);
        const containsDigit = /\d/.test(contentInside); // czy jest cyfra 0–9
    
        if (!containsDigit) {
            return; // ❌ nawias byłby pusty lub zawierał tylko znaki niedozwolone
        }
    }    

    // ✅ Dodaj nowy znak
    calcResult.innerHTML += newChar;
    // ✅ Oblicz tylko jeśli ostatni znak NIE jest operatorem
    if (!operators.includes(newChar)) {
        try {
            const result = parseFloat(math.evaluate(calcResult.innerHTML).toFixed(10));
            showResult.innerHTML = result;
            console.log(result);
        } catch (e) {
            console.log("Błąd w obliczeniach:", e.message);
            showResult.innerHTML = "";
        }
    } else {
        showResult.innerHTML = "";
    }
}

function clr() {
    calcResult.innerHTML = null;
    showResult.innerHTML = "";
}

function del() {
    console.log(calcResult.innerHTML.at(-1));
    calcResult.innerHTML = calcResult.innerHTML.slice(0, -1);
    let result = math.evaluate(calcResult.innerHTML);
    showResult.innerHTML = (result ?? "");
}