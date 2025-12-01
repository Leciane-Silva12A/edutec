// Recupera usuário logado
const userId = localStorage.getItem("userId");
const email = localStorage.getItem("email");

if (!userId || !email) {
  alert("Você precisa estar logado para jogar!");
  window.location.href = "login.html";
} else {
  console.log("Usuário logado:", userId, email);
}

const ROWS = 6;
const COLS = 5;

const gridEl = document.getElementById('grid');
const keyboardEl = document.getElementById('keyboard');
const btnClear = document.getElementById('btn-clear');
const btnSubmit = document.getElementById('btn-submit');
const messageEl = document.getElementById('message');

let currentRow = 0;
let currentCol = 0;
let board = [];

const secretWords = [
  'Acido','Virus','Fases','Reino','Macho','Orgao','Algas','Femea','Cobra','Tigre','Genes','Flora','Fauna','Linfa',
  'Seiva','Bicho','Cisto','Fungo','Musgo','Raiva','Polen','Fibra','Folha','Ovulo','Cloro','Lodos','Pelos','Ninho','Cauda','Penas',
  'Anion','Herda','Molar','Oxido','Caule','Hifas','Vespa','Botao','Broto','Larva','Ninfa','Peste','Tumor','Limbo','Fossa','Peixe','Fetal',
  'Olhos','Nariz','Venas','Vivos','Fusao','Gemas','Pupas','Ovina','Fluir','Morte'
];

const SECRET = secretWords[Math.floor(Math.random() * secretWords.length)].toUpperCase();

function showMessage(text, time = 2200){
  messageEl.textContent = text;
  messageEl.style.display = 'block';
  clearTimeout(showMessage._t);
  showMessage._t = setTimeout(()=> messageEl.style.display = 'none', time);
}

function createGrid(){
  gridEl.innerHTML = '';
  board = [];
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.dataset.r = r;
      tile.dataset.c = c;
      tile.textContent = '';
      gridEl.appendChild(tile);
    }
  }
}

const KEYS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['Z','X','C','V','B','N','M']
];

function createKeyboard(){
  keyboardEl.innerHTML = '';
  KEYS.forEach(row=>{
    const rdiv = document.createElement('div');
    rdiv.className = 'krow';
    row.forEach(key=>{
      const kbtn = document.createElement('button');
      kbtn.className = 'key';
      kbtn.textContent = key;
      kbtn.addEventListener('click', ()=> onKey(key));
      rdiv.appendChild(kbtn);
    });
    keyboardEl.appendChild(rdiv);
  });
}

function setTile(r,c,letter){
  const sel = gridEl.querySelector(`.tile[data-r="${r}"][data-c="${c}"]`);
  if(sel) sel.textContent = letter;
}

function tileEl(r,c){
  return gridEl.querySelector(`.tile[data-r="${r}"][data-c="${c}"]`);
}

function onKey(k){
  if(k === 'ENTER' || k === '↵') return submitGuess();
  if(k === 'BACKSPACE' || k === '⌫') return del();
  if(currentRow >= ROWS) return;
  if(k.length === 1 && /[A-Z]/i.test(k)){
    if(currentCol < COLS){
      board[currentRow] = board[currentRow] || [];
      board[currentRow][currentCol] = k.toUpperCase();
      setTile(currentRow,currentCol,k.toUpperCase());
      currentCol++;
    }
  }
}

function del(){
  if(currentCol>0){
    currentCol--;
    board[currentRow][currentCol] = '';
    setTile(currentRow,currentCol,'');
  }
}

function submitGuess(){
  if(currentCol < COLS){
    showMessage('Complete as 5 letras antes de enviar.');
    return;
  }
  const guess = (board[currentRow] || []).join('').toUpperCase();
  if(!/^[A-Z]{5}$/.test(guess)){
    showMessage('Palavra inválida.');
    return;
  }

  const secretArr = SECRET.split('');
  const guessArr = guess.split('');
  const result = new Array(COLS).fill('absent');
  const used = new Array(COLS).fill(false);

  for(let i=0;i<COLS;i++){
    if(guessArr[i] === secretArr[i]){
      result[i] = 'correct';
      used[i] = true; 
    }
  }

  for(let i=0;i<COLS;i++){
    if(result[i] === 'correct') continue;
    const g = guessArr[i];
    let foundIndex = -1;
    for(let j=0;j<COLS;j++){
      if(!used[j] && secretArr[j] === g){
        foundIndex = j; break;
      }
    }
    if(foundIndex !== -1){
      result[i] = 'present';
      used[foundIndex] = true;
    } else {
      result[i] = 'absent';
    }
  }

  for(let i=0;i<COLS;i++){
    const el = tileEl(currentRow,i);
    if(!el) continue;
    el.classList.add(result[i]);
  }

  updateKeyboardColors(guessArr, result);

  if(result.every(r=>r==='correct')){
    showMessage('Parabéns! Você acertou a palavra!', 4000);
    currentRow = ROWS; 
    return;
  }

  currentRow++;
  currentCol = 0;
  if(currentRow >= ROWS){
    showMessage('Acabaram as tentativas. Palavra: ' + SECRET, 5000);
  }
}

function updateKeyboardColors(letters, results){
  const priority = { 'correct':3, 'present':2, 'absent':1 };
  letters.forEach((L,i)=>{
    const kbtns = Array.from(keyboardEl.querySelectorAll('.key')).filter(k=>k.textContent===L);
    kbtns.forEach(kbtn=>{
      const prev = kbtn.dataset.state || '';
      const prevScore = prev ? priority[prev] : 0;
      const newScore = priority[results[i]];
      if(newScore > prevScore){
        kbtn.dataset.state = results[i];
        kbtn.classList.remove('correct','present','absent');
        kbtn.classList.add(results[i]);

        if(results[i]==='correct') kbtn.style.backgroundColor = '#60c26b';
        if(results[i]==='present') kbtn.style.backgroundColor = '#e6c84a';
        if(results[i]==='absent') kbtn.style.opacity = '0.45';
      }
    });
  });
}

window.addEventListener('keydown', (ev)=>{
  if(ev.key === 'Enter') return submitGuess();
  if(ev.key === 'Backspace') return del();
  const key = ev.key.toUpperCase();
  if(/^[A-Z]$/.test(key)) onKey(key);
});

btnClear.addEventListener('click', ()=> del());
btnSubmit.addEventListener('click', ()=> submitGuess());

function init(){
  createGrid();
  createKeyboard();
  showMessage('Jogo iniciado! Tente adivinhar o termo de 5 letras.');
}
init();
