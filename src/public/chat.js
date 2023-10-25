const socket = io();
let userEmail = '';
import logger from "../utils/logger.js";

async function askEmail() {
  const {value: name} = await Swal.fire({
      title: 'Enter your mail',
      input: 'text',
      inputLabel: 'Your mail',
      inputValue: '',
      showCancelButton: false,
      inputValidator: (value) => {
          if (!value) {
              return 'You need to write your mail!';
          }
      },
  });
  userEmail = name;
}

askEmail();

const chatBox = document.getElementById('chat-box');

chatBox.addEventListener('keyup', ({key}) => {
  if (key == 'Enter') {
      socket.emit('msg_front_to_back', {
      user: userEmail,
      message: chatBox.value,
      });
      chatBox.value = '';
  }
});

socket.on('msg_back_to_front', (messages) => {
  logger.debug(messages);
  let msgsFormateados = '';
  messages.forEach((msg) => {
      msgsFormateados += "<div style='border: 1px solid red;'>";
      msgsFormateados += '<p>' + msg.user + '</p>';
      msgsFormateados += '<p>' + msg.message + '</p>';
      msgsFormateados += '</div>';
  });
  const divMsgs = document.getElementById('div-msgs');
  divMsgs.innerHTML = msgsFormateados;
});