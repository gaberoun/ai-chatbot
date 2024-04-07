import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(atob(process.env.API_KEY)); // Get API key in Google Studio
let chatHistory = [];

// Get user input
document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = document.getElementById('chat-input').value;
  displayUser(msg);
  getMessage(msg);

  e.target.reset();
})

// Display functions
const container = document.getElementById('chat-container');

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
    displayModel(text); 
    console.log(chatHistory);

  } catch (err) {
    console.log(err);
    displayError(err.message);
  }
}