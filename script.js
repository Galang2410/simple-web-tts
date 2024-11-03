const crosswordMap = [
    ['P', null, 'B', null, null, null, null, null, null, null],
    ['A', null, 'I', 'B', 'U', null, null, null, null, null],
    ['M', null, 'B', null, null, null, null, null, null, null],
    ['A', 'D', 'I', 'K', null, 'N', null, null, null, null],
    ['N', null, null, 'A', null, 'E', 'Y', 'A', 'N', 'G'], 
    [null, null, null, 'K', null, 'N', null, null, null, null],
    [null, null, null, 'A', null, 'E', null, null, null, null],
    [null, 'K', 'A', 'K', 'E', 'K', null, null, null, null],
    [null, null, 'Y', null, null, null, null, null, null, null],
    [null, 'T', 'A', 'N', 'T', 'E', null, null, null, null],
    [null, null, 'H', null, null, null, null, null, null, null]
];

const cluePositions = [
    { number: 1, row: 0, col: 0 },  // PAMAN
    { number: 2, row: 0, col: 2 },  // BIBI
    { number: 3, row: 1, col: 2 },  // IBU
    { number: 4, row: 3, col: 0 },  // ADIK
    { number: 5, row: 3, col: 3 },  // KAKAK
    { number: 6, row: 3, col: 5 },  // NENEK
    { number: 7, row: 7, col: 1 },  // KAKEK
    { number: 8, row: 7, col: 2 },  // AYAH
    { number: 9, row: 9, col: 1 },  // TANTE
    { number: 10, row: 4, col: 5 }  // EYANG 
];
const horizontalQuestions = [
    { number: 3, question: "Orang tua perempuan", answer: "IBU" },
    { number: 4, question: "Anak yang lebih muda", answer: "ADIK" },
    { number: 7, question: "Orang tua laki-laki dari ayah/ibu", answer: "KAKEK" },
    { number: 9, question: "Istri dari paman", answer: "TANTE" },
    { number: 10, question: "panggilan hormat untuk orang tua yang lebih tua dari nenek atau kakek", answer: "EYANG" }  
];

const verticalQuestions = [
    { number: 1, question: "Saudara laki-laki ayah/ibu", answer: "PAMAN" },
    { number: 2, question: "Saudara perempuan ayah/ibu", answer: "BIBI" },
    { number: 5, question: "Anak yang lebih tua", answer: "KAKAK" },
    { number: 6, question: "Orang tua perempuan dari ayah/ibu", answer: "NENEK" },
    { number: 8, question: "Orang tua laki-laki", answer: "AYAH" }
];

function generateCrossword() {
    const grid = document.getElementById('crossword-grid');
    grid.innerHTML = '';

    for (let i = 0; i < crosswordMap.length; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < crosswordMap[0].length; j++) {
            const cell = document.createElement('td');
            
            if (crosswordMap[i][j] !== null) {
                const input = document.createElement('input');
                input.maxLength = 1;
                input.dataset.row = i;
                input.dataset.col = j;

                const clue = cluePositions.find(pos => pos.row === i && pos.col === j);
                if (clue) {
                    const numberDiv = document.createElement('div');
                    numberDiv.className = 'clue-number';
                    numberDiv.textContent = clue.number;

                    if (i === 0 || crosswordMap[i-1][j] === null) {
                        numberDiv.classList.add('top');
                    } else {
                        numberDiv.classList.add('left');
                    }
                    
                    cell.appendChild(numberDiv);
                }
                
                input.addEventListener('input', function(e) {
                    this.value = this.value.toUpperCase();
                    const isHorizontal = horizontalQuestions.some(q => q.number === clue?.number);
                    if (this.value) {
                        const next = isHorizontal ? findNextInput(i, j, 'horizontal') : findNextInput(i, j, 'vertical');
                        if (next) next.focus();
                    }
                });

                input.addEventListener('keydown', function(e) {
                    if (e.key === 'Backspace' && !this.value) {
                        e.preventDefault();
                        const isHorizontal = horizontalQuestions.some(q => q.number === clue?.number);
                        const prev = isHorizontal ? findPreviousInput(i, j, 'horizontal') : findPreviousInput(i, j, 'vertical');
                        if (prev) {
                            prev.focus();
                            prev.value = '';
                        }
                    }
                });
                
                cell.appendChild(input);
            } else {
                cell.classList.add('empty-cell');
            }
            
            row.appendChild(cell);
        }
        grid.appendChild(row);
    }

    generateQuestions();
}

function findNextInput(row, col, direction) {
    if (direction === 'horizontal') {
        col++;
    } else if (direction === 'vertical') {
        row++;
    }
    return document.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
}

function findPreviousInput(row, col, direction) {
    if (direction === 'horizontal') {
        col--;
    } else if (direction === 'vertical') {
        row--;
    }
    return document.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
}

function generateQuestions() {
    const hList = document.getElementById('horizontal-questions');
    const vList = document.getElementById('vertical-questions');
    
    hList.innerHTML = '';
    vList.innerHTML = '';
    
    horizontalQuestions.forEach(q => {
        const li = document.createElement('li');
        li.textContent = `${q.number}. ${q.question}`;
        hList.appendChild(li);
    });
    
    verticalQuestions.forEach(q => {
        const li = document.createElement('li');
        li.textContent = `${q.number}. ${q.question}`;
        vList.appendChild(li);
    });
}

function checkWord(number, isHorizontal) {
    const startPos = cluePositions.find(pos => pos.number === number);
    let word = '';
    let row = startPos.row;
    let col = startPos.col;

    if (isHorizontal) {
        while (col < crosswordMap[0].length && crosswordMap[row][col] !== null) {
            const input = document.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
            word += (input?.value || '').trim().toUpperCase();
            col++;
        }
    } else {
        while (row < crosswordMap.length && crosswordMap[row][col] !== null) {
            const input = document.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
            word += (input?.value || '').trim().toUpperCase();
            row++;
        }
    }

    return word;
}

function checkAnswers() {
    let correctAnswers = 0;
    const totalQuestions = horizontalQuestions.length + verticalQuestions.length;

    horizontalQuestions.forEach(question => {
        const userAnswer = checkWord(question.number, true);
        if (userAnswer === question.answer.toUpperCase()) {
            correctAnswers++;
        }
    });

    verticalQuestions.forEach(question => {
        const userAnswer = checkWord(question.number, false);
        if (userAnswer === question.answer.toUpperCase()) {
            correctAnswers++;
        }
    });

    document.getElementById('score').textContent = `Jawaban benar: ${correctAnswers}/${totalQuestions}`;
    if (correctAnswers === totalQuestions) {
        showPopup("SELAMAT ANDA BERHASIL!");
    }
}

function showAnswers() {
    
    const answers = [
        { number: 1, answer: "PAMAN" },
        { number: 2, answer: "BIBI" },
        { number: 3, answer: "IBU" },
        { number: 4, answer: "ADIK" },
        { number: 5, answer: "KAKAK" },
        { number: 6, answer: "NENEK" },
        { number: 7, answer: "KAKEK" },
        { number: 8, answer: "AYAH" },
        { number: 9, answer: "TANTE" },
        { number: 10, answer: "EYANG" }
    ];

   
    answers.forEach(answer => {
        const startPos = cluePositions.find(pos => pos.number === answer.number);
        let row = startPos.row;
        let col = startPos.col;
        let answerText = answer.answer;
        
     
        const isHorizontal = horizontalQuestions.some(q => q.number === answer.number);

       
        for (let i = 0; i < answerText.length; i++) {
            const input = document.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
            if (input) {
                input.value = answerText[i]; 
            }

     
            if (isHorizontal) {
                col++;
            } else {
                row++;
            }
        }
    });
}


function showPopup(message) {
    const overlay = document.createElement('div');
    overlay.id = 'popup-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';

    const popup = document.createElement('div');
    popup.id = 'popup-message';
    popup.style.backgroundColor = '#f3e8ff';
    popup.style.padding = '30px 50px';
    popup.style.borderRadius = '12px';
    popup.style.textAlign = 'center';
    popup.style.fontSize = '24px';
    popup.style.fontWeight = 'bold';
    popup.style.color = '#4a00e0';
    popup.style.boxShadow = '0 4px 20px rgba(74, 0, 224, 0.3)';
    
    popup.textContent = message;

    const closeButton = document.createElement('button');
    closeButton.textContent = 'OK';
    closeButton.style.marginTop = '20px';
    closeButton.style.padding = '12px 24px';
    closeButton.style.fontSize = '16px';
    closeButton.style.color = 'white';
    closeButton.style.backgroundColor = '#8e2de2';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '8px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.boxShadow = '0 4px 10px rgba(142, 45, 226, 0.3)';
    closeButton.style.transition = 'background-color 0.3s';

    closeButton.addEventListener('mouseover', () => {
        closeButton.style.backgroundColor = '#6a00d1';
    });
    closeButton.addEventListener('mouseout', () => {
        closeButton.style.backgroundColor = '#8e2de2';
    });

    closeButton.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });

    popup.appendChild(closeButton);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}

document.addEventListener('DOMContentLoaded', generateCrossword);
