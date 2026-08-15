import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = `http://${window.location.hostname}:8080`;

export default function App() {
  const [expression, setExpression] = useState<string>('0');
  const [error, setError] = useState<string>('');
  const [isResult, setIsResult] = useState<boolean>(false);
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const displayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const el = displayRef.current;
    if (!el) return;
    let currentSize = 48;
    const minSize = 22;
    el.style.fontSize = `${currentSize}px`;
    while (el.scrollHeight > el.clientHeight && currentSize > minSize) {
      currentSize -= 1;
      el.style.fontSize = `${currentSize}px`;
    }
    el.scrollTop = el.scrollHeight;
  }, [expression]);

  const sanitizeExpressionForApi = (expr: string) => {
    return expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/\^/g, '**')
      .replace(/%/g, '/100');
  };

  const handleInput = (val: string) => {
    setError(''); 
    const isOperator = ['+', '−', '×', '÷', '^'].includes(val);
    
    if (isResult) {
      if (isOperator || val === '%') {
        setExpression(expression + val); 
      } else {
        setExpression(val === '.' ? '0.' : val); 
      }
      setIsResult(false);
      return;
    }

    if (!isOperator && val !== '(' && val !== ')' && val !== '%' && val !== 'sqrt(') {
      const lastNumberMatch = expression.match(/[\d.]+$/);
      if (lastNumberMatch) {
        const digitCount = lastNumberMatch[0].replace('.', '').length;
        if (digitCount >= 15) {
          setError('A number can have at most 15 digits');
          setTimeout(() => setError(''), 3000);
          return; 
        }
      }
    }

    if (expression === '0' && !isOperator && val !== '.' && val !== '%' && val !== ')' && val !== '(') {
      setExpression(val); 
    } else {
      const lastChar = expression.slice(-1);
      if (['+', '−', '×', '÷', '^'].includes(lastChar) && isOperator) {
        setExpression(expression.slice(0, -1) + val);
      } else {
        setExpression(expression + val);
      }
    }
  };

  const handleClear = () => {
    setExpression('0');
    setError('');
    setIsResult(false);
  };

  const handleBackspace = () => {
    setError('');
    if (isResult) {
      setExpression('0');
      setIsResult(false);
    } else {
      if (expression.endsWith('sqrt(')) {
        setExpression(expression.length > 5 ? expression.slice(0, -5) : '0');
      } else {
        setExpression(expression.length > 1 ? expression.slice(0, -1) : '0');
      }
    }
  };

const handleEquals = async () => {
  try {
    const sanitizedExpr = sanitizeExpressionForApi(expression);
    const response = await axios.post(`${API_URL}/api/calculate`, {
      expression: sanitizedExpr,
    });
    setExpression(String(response.data.result));
    setIsResult(true);
  } catch (err: any) {
    const errorMsg = err.response?.data?.error || 'Invalid mathematical expression';
    setError(errorMsg);
  }
};

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Enter', '=', '+', '-', '*', '/', '^', '%', 'Backspace'].includes(e.key)) {
        e.preventDefault();
      }
      if (/[0-9]/.test(e.key)) {
        handleInput(e.key);
      } else if (e.key === ',' || e.key === '.') {
        handleInput('.'); 
      } else if (['+', '-', '*', '/', '^', '%'].includes(e.key)) {
        const opMap: Record<string, string> = {
          '+': '+',
          '-': '−',
          '*': '×',
          '/': '÷',
          '^': '^',
          '%': '%'
        };
        handleInput(opMap[e.key]);
      } else if (e.key === 'Enter' || e.key === '=') {
        handleEquals();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        handleClear();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === '(' || e.key === ')') {
        handleInput(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression, isResult]); 

  return (
    <div className="app-container">
      
      <div className="theme-switch-wrapper">
        <span>☀️</span>
        <label className="theme-switch">
          <input 
            type="checkbox" 
            checked={isDarkMode} 
            onChange={() => setIsDarkMode(!isDarkMode)} 
          />
          <span className="slider"></span>
        </label>
        <span>🌙</span>
      </div>

      <div className="calculator-card">
        {error && <div className="error-banner">{error}</div>}

        <div className="display-panel">
          <div className="main-display" ref={displayRef} data-testid="display">
            {expression}
          </div>
        </div>

        <div className="keypad">
          <button className="btn btn-danger" onClick={handleClear}>C</button>
          <button className="btn btn-danger" onClick={handleBackspace}>⌫</button>
          <button className="btn btn-op" onClick={() => handleInput('%')}>%</button>
          <button className="btn btn-op" onClick={() => handleInput('sqrt(')}>√</button>

          <button className="btn btn-op" onClick={() => handleInput('^')}>xʸ</button>
          <button className="btn btn-op" onClick={() => handleInput('(')}>(</button>
          <button className="btn btn-op" onClick={() => handleInput(')')}>)</button>
          <button className="btn btn-op" onClick={() => handleInput('÷')}>÷</button>

          <button className="btn" onClick={() => handleInput('7')}>7</button>
          <button className="btn" onClick={() => handleInput('8')}>8</button>
          <button className="btn" onClick={() => handleInput('9')}>9</button>
          <button className="btn btn-op" onClick={() => handleInput('×')}>×</button>

          <button className="btn" onClick={() => handleInput('4')}>4</button>
          <button className="btn" onClick={() => handleInput('5')}>5</button>
          <button className="btn" onClick={() => handleInput('6')}>6</button>
          <button className="btn btn-op" onClick={() => handleInput('−')}>−</button>

          <button className="btn" onClick={() => handleInput('1')}>1</button>
          <button className="btn" onClick={() => handleInput('2')}>2</button>
          <button className="btn" onClick={() => handleInput('3')}>3</button>
          <button className="btn btn-op" onClick={() => handleInput('+')}>+</button>

          <button className="btn" onClick={() => handleInput('.')}>.</button>
          <button className="btn" onClick={() => handleInput('0')}>0</button>
          <button className="btn btn-equals" onClick={handleEquals}>=</button>
        </div>
      </div>
    </div>
  );
}