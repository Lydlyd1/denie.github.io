let tasks = [];

function addTask() {
  const taskInput = document.getElementById('taskInput');
  const taskText = taskInput.value.trim();
  const taskDate = document.getElementById('taskDate').value;
  const taskTime = document.getElementById('taskTime').value;

  if (taskText !== '' && taskDate !== '' && taskTime !== '') {
    const newTask = {
      id: Date.now(),
      text: taskText,
      date: taskDate,
      time: taskTime,
    };

    tasks.push(newTask);
    taskInput.value = '';
    document.getElementById('taskDate').value = '';
    document.getElementById('taskTime').value = '';

    renderTasks();
    scheduleNotification(newTask);
    showNotification(newTask.text);
  }
}

function scheduleNotification(task) {
  const notificationTime = new Date(`${task.date} ${task.time}`);
  const currentTime = new Date();

  if (notificationTime > currentTime) {
    const timeDiff = notificationTime - currentTime;
    setTimeout(() => {
      showNotification(task.text);
    }, timeDiff);
  } else {
    console.log('Waktu notifikasi telah lewat');
  }
}

function showNotification(taskText) {
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification('Tugas Baru', {
            body: `Tugas: ${taskText}`,
          });
        });
      }
    });
  }
}

function removeTask(taskId) {
  tasks = tasks.filter(task => task.id !== taskId);
  renderTasks();
}

function renderTasks() {
  const taskListContainer = document.getElementById('taskList');
  taskListContainer.innerHTML = '';

  tasks.forEach(task => {
    const taskElement = document.createElement('div');
    taskElement.className = 'task';
    taskElement.innerHTML = `
      <span>${task.text} - ${task.date} ${task.time}</span>
      <button onclick="removeTask(${task.id})">Hapus</button>
    `;

    taskListContainer.appendChild(taskElement);
  });
}

renderTasks();
// app.js
function showNotification(taskText) {
  if ('Notification' in window && 'PushManager' in window && 'serviceWorker' in navigator) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        // Mendaftarkan service worker
        navigator.serviceWorker.ready.then(registration => {
          // Mendapatkan token untuk pengenal perangkat dari Firebase
          return registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: 'BHjI226ReNLeGyEkC72XY26Idxu_jifYmPflToyPJFFsj_YXcFUSu-3NYAwLsBYMxRRA2CxMY10hwSBlggkVEVA',
          });
        }).then(subscription => {
          // Mengirim push notification ke perangkat
          const payload = {
            notification: {
              title: 'Tugas Baru',
              body: `Tugas: ${taskText}`,
            },
            to: subscription.endpoint,
          };

          // Mengirim payload ke FCM
          fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'BHjI226ReNLeGyEkC72XY26Idxu_jifYmPflToyPJFFsj_YXcFUSu-3NYAwLsBYMxRRA2CxMY10hwSBlggkVEVA',
            },
            body: JSON.stringify(payload),
          });
        });
      }
    });
  }
}

// ... (fungsi lainnya)
