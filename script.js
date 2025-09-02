 class Calculator {
            constructor() {
                this.display = document.getElementById('display');
                this.history = document.getElementById('history');
                this.memoryIndicator = document.getElementById('memoryIndicator');
                this.modeToggle = document.getElementById('modeToggle');
                this.scientificButtons = document.getElementById('scientificButtons');
                
                this.currentValue = '0';
                this.previousValue = '';
                this.operation = null;
                this.waitingForOperand = false;
                this.memory = 0;
                this.lastAnswer = 0;
                this.scientificMode = false;
                this.secondMode = false;
                
                this.init();
            }
            
            init() {
                // Button event listeners
                document.querySelectorAll('.button').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const action = e.target.dataset.action;
                        const value = e.target.dataset.value;
                        
                        if (action === 'number') {
                            this.inputNumber(value);
                        } else if (action === 'decimal') {
                            this.inputDecimal();
                        } else if (action === 'clear') {
                            this.clear();
                        } else if (action === 'delete') {
                            this.delete();
                        } else if (action === 'equals') {
                            this.calculate();
                        } else if (['add', 'subtract', 'multiply', 'divide'].includes(action)) {
                            this.performOperation(action);
                        } else if (action === 'percent') {
                            this.percent();
                        } else if (action === 'toggle-sign') {
                            this.toggleSign();
                        } else if (action === 'memory-plus') {
                            this.memoryAdd();
                        } else if (action === 'memory-minus') {
                            this.memorySubtract();
                        } else if (action === 'memory-clear') {
                            this.memoryClear();
                        } else if (action === 'memory-recall') {
                            this.memoryRecall();
                        } else if (action === 'ans') {
                            this.inputAnswer();
                        } else if (action === 'pi') {
                            this.inputConstant(Math.PI);
                        } else if (action === 'e') {
                            this.inputConstant(Math.E);
                        } else if (action === 'sqrt') {
                            this.squareRoot();
                        } else if (action === 'pow2') {
                            this.power(2);
                        } else if (action === 'pow10') {
                            this.power10();
                        } else if (action === 'pow') {
                            this.powerOperation();
                        } else if (action === 'reciprocal') {
                            this.reciprocal();
                        } else if (action === 'factorial') {
                            this.factorial();
                        } else if (action === 'log') {
                            this.logarithm(10);
                        } else if (action === 'ln') {
                            this.logarithm(Math.E);
                        } else if (action === 'sin') {
                            this.trigonometry('sin');
                        } else if (action === 'cos') {
                            this.trigonometry('cos');
                        } else if (action === 'tan') {
                            this.trigonometry('tan');
                        } else if (action === 'open-paren') {
                            this.openParenthesis();
                        } else if (action === 'close-paren') {
                            this.closeParenthesis();
                        } else if (action === 'exp') {
                            this.exponential();
                        } else if (action === 'second') {
                            this.toggleSecondMode();
                        }
                    });
                });
                
                // Mode toggle
                this.modeToggle.addEventListener('click', () => {
                    this.scientificMode = !this.scientificMode;
                    this.scientificButtons.classList.toggle('active');
                    this.modeToggle.textContent = this.scientificMode ? 'Basic' : 'Scientific';
                });
                
                // Keyboard support
                document.addEventListener('keydown', (e) => {
                    if (e.key >= '0' && e.key <= '9') {
                        this.inputNumber(e.key);
                    } else if (e.key === '.') {
                        this.inputDecimal();
                    } else if (e.key === 'Enter' || e.key === '=') {
                        this.calculate();
                    } else if (e.key === 'Escape') {
                        this.clear();
                    } else if (e.key === 'Backspace') {
                        this.delete();
                    } else if (e.key === '+') {
                        this.performOperation('add');
                    } else if (e.key === '-') {
                        this.performOperation('subtract');
                    } else if (e.key === '*') {
                        this.performOperation('multiply');
                    } else if (e.key === '/') {
                        e.preventDefault();
                        this.performOperation('divide');
                    } else if (e.key === '%') {
                        this.percent();
                    }
                });
            }
            
            updateDisplay() {
                this.display.textContent = this.currentValue;
                if (this.display.textContent.length > 12) {
                    this.display.style.fontSize = '24px';
                } else {
                    this.display.style.fontSize = '36px';
                }
            }
            
            inputNumber(num) {
                if (this.waitingForOperand) {
                    this.currentValue = num;
                    this.waitingForOperand = false;
                } else {
                    this.currentValue = this.currentValue === '0' ? num : this.currentValue + num;
                }
                this.updateDisplay();
            }
            
            inputDecimal() {
                if (this.waitingForOperand) {
                    this.currentValue = '0.';
                    this.waitingForOperand = false;
                } else if (this.currentValue.indexOf('.') === -1) {
                    this.currentValue += '.';
                }
                this.updateDisplay();
            }
            
            clear() {
                this.currentValue = '0';
                this.previousValue = '';
                this.operation = null;
                this.waitingForOperand = false;
                this.history.textContent = '';
                this.display.classList.remove('error');
                this.updateDisplay();
            }
            
            delete() {
                if (this.currentValue.length > 1) {
                    this.currentValue = this.currentValue.slice(0, -1);
                } else {
                    this.currentValue = '0';
                }
                this.updateDisplay();
            }
            
            performOperation(nextOperation) {
                const inputValue = parseFloat(this.currentValue);
                
                if (this.previousValue === '') {
                    this.previousValue = inputValue;
                } else if (this.operation) {
                    const currentValue = this.previousValue || 0;
                    const newValue = this.calculate(currentValue, inputValue, this.operation);
                    
                    this.currentValue = String(newValue);
                    this.previousValue = newValue;
                    this.updateDisplay();
                }
                
                this.waitingForOperand = true;
                this.operation = nextOperation;
                this.updateHistory();
            }
            
            calculate(firstValue, secondValue, operation) {
                let result;
                
                switch (operation) {
                    case 'add':
                        result = firstValue + secondValue;
                        break;
                    case 'subtract':
                        result = firstValue - secondValue;
                        break;
                    case 'multiply':
                        result = firstValue * secondValue;
                        break;
                    case 'divide':
                        if (secondValue === 0) {
                            this.showError('Cannot divide by zero');
                            return firstValue;
                        }
                        result = firstValue / secondValue;
                        break;
                    default:
                        return secondValue;
                }
                
                return result;
            }
            
            calculate() {
                const inputValue = parseFloat(this.currentValue);
                
                if (this.previousValue !== '' && this.operation) {
                    const newValue = this.calculate(this.previousValue, inputValue, this.operation);
                    this.currentValue = String(newValue);
                    this.previousValue = '';
                    this.operation = null;
                    this.waitingForOperand = true;
                    this.lastAnswer = newValue;
                    this.updateDisplay();
                    this.history.textContent = '';
                }
            }
            
            percent() {
                const value = parseFloat(this.currentValue);
                this.currentValue = String(value / 100);
                this.updateDisplay();
            }
            
            toggleSign() {
                const value = parseFloat(this.currentValue);
                this.currentValue = String(-value);
                this.updateDisplay();
            }
            
            memoryAdd() {
                this.memory += parseFloat(this.currentValue);
                this.memoryIndicator.classList.add('active');
            }
            
            memorySubtract() {
                this.memory -= parseFloat(this.currentValue);
                this.memoryIndicator.classList.add('active');
            }
            
            memoryClear() {
                this.memory = 0;
                this.memoryIndicator.classList.remove('active');
            }
            
            memoryRecall() {
                this.currentValue = String(this.memory);
                this.updateDisplay();
            }
            
            inputAnswer() {
                this.currentValue = String(this.lastAnswer);
                this.updateDisplay();
            }
            
            inputConstant(value) {
                this.currentValue = String(value);
                this.updateDisplay();
            }
            
            squareRoot() {
                const value = parseFloat(this.currentValue);
                if (value < 0) {
                    this.showError('Invalid input');
                    return;
                }
                this.currentValue = String(Math.sqrt(value));
                this.updateDisplay();
            }
            
            power(exponent) {
                const value = parseFloat(this.currentValue);
                this.currentValue = String(Math.pow(value, exponent));
                this.updateDisplay();
            }
            
            power10() {
                const value = parseFloat(this.currentValue);
                this.currentValue = String(Math.pow(10, value));
                this.updateDisplay();
            }
            
            powerOperation() {
                this.previousValue = parseFloat(this.currentValue);
                this.operation = 'power';
                this.waitingForOperand = true;
                this.updateHistory();
            }
            
            reciprocal() {
                const value = parseFloat(this.currentValue);
                if (value === 0) {
                    this.showError('Cannot divide by zero');
                    return;
                }
                this.currentValue = String(1 / value);
                this.updateDisplay();
            }
            
            factorial() {
                const value = parseInt(this.currentValue);
                if (value < 0 || value > 170) {
                    this.showError('Invalid input');
                    return;
                }
                
                let result = 1;
                for (let i = 2; i <= value; i++) {
                    result *= i;
                }
                this.currentValue = String(result);
                this.updateDisplay();
            }
            
            logarithm(base) {
                const value = parseFloat(this.currentValue);
                if (value <= 0) {
                    this.showError('Invalid input');
                    return;
                }
                this.currentValue = String(Math.log(value) / Math.log(base));
                this.updateDisplay();
            }
            
            trigonometry(func) {
                const value = parseFloat(this.currentValue);
                let result;
                
                switch (func) {
                    case 'sin':
                        result = Math.sin(value * Math.PI / 180);
                        break;
                    case 'cos':
                        result = Math.cos(value * Math.PI / 180);
                        break;
                    case 'tan':
                        result = Math.tan(value * Math.PI / 180);
                        break;
                }
                
                this.currentValue = String(result);
                this.updateDisplay();
            }
            
            openParenthesis() {
                if (this.waitingForOperand || this.currentValue === '0') {
                    this.currentValue = '(';
                    this.waitingForOperand = false;
                } else {
                    this.currentValue += '(';
                }
                this.updateDisplay();
            }
            
            closeParenthesis() {
                this.currentValue += ')';
                this.updateDisplay();
            }
            
            exponential() {
                this.currentValue += 'e+';
                this.updateDisplay();
            }
            
            toggleSecondMode() {
                this.secondMode = !this.secondMode;
                // Update button labels for second mode
                const sinBtn = document.querySelector('[data-action="sin"]');
                const cosBtn = document.querySelector('[data-action="cos"]');
                const tanBtn = document.querySelector('[data-action="tan"]');
                const logBtn = document.querySelector('[data-action="log"]');
                const lnBtn = document.querySelector('[data-action="ln"]');
                
                if (this.secondMode) {
                    sinBtn.textContent = 'sin⁻¹';
                    cosBtn.textContent = 'cos⁻¹';
                    tanBtn.textContent = 'tan⁻¹';
                    logBtn.textContent = '10ˣ';
                    lnBtn.textContent = 'eˣ';
                } else {
                    sinBtn.textContent = 'sin';
                    cosBtn.textContent = 'cos';
                    tanBtn.textContent = 'tan';
                    logBtn.textContent = 'log';
                    lnBtn.textContent = 'ln';
                }
            }
            
            updateHistory() {
                const operationSymbols = {
                    'add': '+',
                    'subtract': '−',
                    'multiply': '×',
                    'divide': '÷',
                    'power': '^'
                };
                
                if (this.operation && this.previousValue !== '') {
                    this.history.textContent = `${this.previousValue} ${operationSymbols[this.operation] || ''}`;
                }
            }
            
            showError(message) {
                this.display.textContent = message;
                this.display.classList.add('error');
                setTimeout(() => {
                    this.display.classList.remove('error');
                    this.clear();
                }, 2000);
            }
        }
        
        // Initialize calculator
        const calculator = new Calculator();