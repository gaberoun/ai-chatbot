import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(atob(process.env.API_KEY)); // Get API key in Google Studio
let chatHistory = [];

// Get user input
document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = document.getElementById('chat-input').value;
  displayUser(msg);
  displayLoading();
  getMessage(msg);

  e.target.reset();
})

// Display functions
const container = document.getElementById('chat-container');
const loading = document.getElementById('loading');

function displayUser(msg) {
  const msgContainer = document.createElement('div');
  msgContainer.classList = 'user-container';

  const message = document.createElement('p');
  message.textContent = msg;
  message.classList = 'user-msg'

  msgContainer.appendChild(message);
  container.appendChild(msgContainer);
}

function displayModel(msg) {
  const msgContainer = document.createElement('div');
  msgContainer.classList = 'model-container';

  const message = document.createElement('p');
  message.textContent = msg;
  message.classList = 'model-msg'

  msgContainer.appendChild(message);
  container.appendChild(msgContainer);
}

function displayError(err) {
  const msgContainer = document.createElement('div');
  msgContainer.classList = 'model-container';

  const message = document.createElement('p');
  message.textContent = err;
  message.classList = 'alert-msg'

  msgContainer.appendChild(message);
  container.appendChild(msgContainer);
}

function displayLoading() {
  const loadContainer = document.createElement('div');
  loadContainer.id = 'loading';

  const load = document.createElement('span');
  load.textContent = 'Responding';
  loadContainer.appendChild(load);

  for (let i = 0; i<3; i++) {
    const dot = document.createElement('span');
    dot.classList = 'dot';
    dot.id = `dot${i}`;
    dot.textContent = '.';
    loadContainer.appendChild(dot);
  }

  container.appendChild(loadContainer);
}

// Fetch API
async function getMessage(msg) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const chat = model.startChat({
    history: chatHistory
  });

  try {
    const result = await chat.sendMessage(msg);
    const response = result.response;
    const text = response.text();

    container.removeChild(document.getElementById('loading'));
    displayModel(text); 
    console.log(chatHistory);

  } catch (err) {
    console.log(err);
    displayError(err.message);
  }
}