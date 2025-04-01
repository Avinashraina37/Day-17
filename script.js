
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCQbmoVmguOESBU1v5XaavuBbu0jtReIZo",
    authDomain: "avi-project-39b39.firebaseapp.com",
    projectId: "avi-project-39b39",
    storageBucket: "avi-project-39b39.appspot.com",
    messagingSenderId: "670283864248",
    appId: "1:670283864248:web:40a45777261df288bdfc4d",
    measurementId: "G-SV1HSB34G9"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Reference to the tasks collection
const tasksRef = db.collection('todo collection');

// Load tasks when page loads
document.addEventListener('DOMContentLoaded', loadTasks);

// Function to add a new task
async function addTask() {
    const taskInput = document.getElementById('taskInput');
    const timeInput = document.getElementById('time');
    
    const taskText = taskInput.value.trim();
    const taskTime = timeInput.value;
    
    if (!taskText || !taskTime) {
        alert('Please enter both task and time');
        return;
    }

    try {
        // Add task to Firestore
        await tasksRef.add({
            text: taskText,
            time: taskTime,
            completed: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Clear input fields
        taskInput.value = '';
        timeInput.value = '';
    } catch (error) {
        console.error('Error adding task: ', error);
        alert('Error adding task. Please try again.');
    }
}

// Function to load tasks from Firestore
function loadTasks() {
    tasksRef.orderBy('createdAt').onSnapshot(snapshot => {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';
        
        snapshot.forEach(doc => {
            const task = doc.data();
            const taskId = doc.id;
            
            createTaskElement(task, taskId);
        });
    }, error => {
        console.error('Error loading tasks: ', error);
    });
}

// Function to create a task element
function createTaskElement(task, taskId) {
    const li = document.createElement('li');
    if (task.completed) {
        li.classList.add('completed');
    }
    
    const taskText = document.createElement('span');
    taskText.textContent = `${task.text} - ${task.time}`;
    
    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update';
    updateButton.classList.add('update');
    updateButton.onclick = () => updateTask(taskId, task.text, task.time);
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete');
    deleteButton.onclick = () => deleteTask(taskId);
    
    li.appendChild(taskText);
    li.appendChild(updateButton);
    li.appendChild(deleteButton);
    
    li.addEventListener('click', () => toggleTaskCompletion(taskId, task.completed));
    
    document.getElementById('taskList').appendChild(li);
}

// Function to update a task
async function updateTask(taskId, currentText, currentTime) {
    const newText = prompt('Update your task:', currentText);
    const newTime = prompt('Update time:', currentTime);
    
    if (newText && newTime) {
        try {
            await tasksRef.doc(taskId).update({
                text: newText,
                time: newTime
            });
        } catch (error) {
            console.error('Error updating task: ', error);
            alert('Error updating task. Please try again.');
        }
    }
}

// Function to delete a task
async function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        try {
            await tasksRef.doc(taskId).delete();
        } catch (error) {
            console.error('Error deleting task: ', error);
            alert('Error deleting task. Please try again.');
        }
    }
}

// Function to toggle task completion status
async function toggleTaskCompletion(taskId, currentStatus) {
    try {
        await tasksRef.doc(taskId).update({
            completed: !currentStatus
        });
    } catch (error) {
        console.error('Error updating task status: ', error);
    }
}