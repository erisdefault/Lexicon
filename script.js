const form = document.getElementById('search-form');
const input = document.getElementById('word-input');
const resultDiv = document.getElementById('result');
const savedWordsDiv = document.getElementById('saved-words');

// Replace with your actual API key and endpoint
const API_KEY = 'YOUR_API_KEY_HERE';
const BASE_URL = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const word = input.value.trim();
  if (!word) return;

  try {
    const res = await fetch(`${BASE_URL}${word}?key=${API_KEY}`);
    const data = await res.json();
    displayDefinition(word, data);
  } catch (err) {
    resultDiv.innerHTML = `<p>Error fetching definition.</p>`;
  }
});

function displayDefinition(word, data) {
  if (!Array.isArray(data) || !data.length || !data[0].shortdef) {
    resultDiv.innerHTML = `<p>No definition found.</p>`;
    return;
  }

  const definition = data[0].shortdef.join('; ');
  resultDiv.innerHTML = `
    <h3>${word}</h3>
    <p>${definition}</p>
    <button onclick="saveWord('${word}', \`${definition}\`)">Save</button>
  `;
}

function saveWord(word, definition) {
  const saved = JSON.parse(localStorage.getItem('lexicon')) || [];
  saved.push({ word, definition });
  localStorage.setItem('lexicon', JSON.stringify(saved));
  renderSavedWords();
}

function renderSavedWords() {
  const saved = JSON.parse(localStorage.getItem('lexicon')) || [];
  savedWordsDiv.innerHTML = saved.map(entry =>
    `<div>
      <strong>${entry.word}</strong>: ${entry.definition}
    </div>`).join('');
}

renderSavedWords(); // Initial load