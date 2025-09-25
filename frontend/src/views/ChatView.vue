<template>
  <div class="message__form">
    <div class="messages__container">
      <div v-for="(message, index) in messages" :key="index" class="message__field">
        <div v-if="Username == message.name" class="your__message message">
          <div class="message__content">
            <span>{{ message.name }}</span>
            <span>{{ message.message }}</span>
          </div>
        </div>
        <div v-else class="not__your__message message">
          <div class="message__content">
            <span>{{ message.name }}</span>
            <span>{{ message.message }}</span>
          </div>
        </div>
      </div>
    </div>
    <form @submit.prevent="sendMessage" class="message-input">
      <div class="input-container">
        <button type="button" @click="toggleEmojiPicker" class="emoji-button">	&#128526;</button>
        <emoji-picker
          v-if="showEmojiPicker"
          @emoji-click="addEmoji"
          class="emoji-picker"
        />
        <input v-model="newMessageValue" placeholder="Type a message" />

      </div>
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { io } from 'socket.io-client';

const loadEmojiPicker = () => {
  const script = document.createElement('script');
  script.type = 'module';
  script.src = 'https://cdn.jsdelivr.net/npm/emoji-picker-element@^1/index.js';
  document.head.appendChild(script);
};

const socket = io('http://localhost:3000');
const messages = ref([]);
const newMessageValue = ref('');
const UserId = ref('');
const Username = ref('');
const showEmojiPicker = ref(false); // Состояние для отображения пикера
const newMessage = ref({
  "name": '',
  "client": '',
  "message": ''
});

// Функции для работы с эмодзи
const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
};

const addEmoji = (e) => {
  newMessageValue.value += e.detail.unicode; // Добавляем эмодзи в input
  showEmojiPicker.value = false; // Скрываем пикер после выбора
};

onMounted(() => {
  loadEmojiPicker()
  Username.value = sessionStorage.getItem('login');
  socket.on('onConnected', (id) => {
    UserId.value = id;
    console.log(UserId.value);
  });

  socket.on('message-history', (history, id) => {
    messages.value = history;
  });
  
  socket.on('new-message', (message) => {
    messages.value.push(message);
  });
});

const sendMessage = () => {
  if (newMessageValue.value.trim()) {
    newMessage.value.client = UserId.value;
    newMessage.value.name = Username.value;
    newMessage.value.message = newMessageValue.value;
    socket.emit('message', newMessage.value);
    newMessageValue.value = '';
  }
};
</script>

<style>
.message__form {
  border: 2px solid black;
  padding: 20px;
}

.message-input {
  display: flex;
  gap: 10px;
  align-items: center;
  background-color: #ddd;
}

.input-container {
  position: relative;
  flex-grow: 1;
  display: flex;
}

.emoji-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0 8px;
}

.emoji-picker {
  position: absolute;
  bottom: 40px;
  left: 0;
  z-index: 100;
}

/* Стилизация самого пикера (опционально) */
emoji-picker {
  --emoji-size: 1.2rem;
  --num-columns: 8;
  --background: #f5f5f5;
  --border-color: #ddd;
}
</style>