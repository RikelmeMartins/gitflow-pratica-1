const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

let currentFilter = 'all';

function addTask() {
    const text = taskInput.value.trim();
    
    if (text === '') {
        alert("Por favor, digite uma tarefa!");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        status: 'pending' 
    };

    tasks.push(newTask);
    saveAndRender();
    taskInput.value = ''; 
}

function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks(currentFilter);
}

function renderTasks(filter) {
    taskList.innerHTML = '';
  
    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        return task.status === filter;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.status}`;
    
        li.innerHTML = `
            <span class="task-text" onclick="toggleStatus(${task.id})">${task.text}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">X</button>
        `;
        
        taskList.appendChild(li);
    });
}

function toggleStatus(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.status = task.status === 'pending' ? 'completed' : 'pending';
        }
        return task;
    });
    saveAndRender();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRender();
}

function handleFilterClick(e) {
    filterBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    currentFilter = e.target.getAttribute('data-filter');
    renderTasks(currentFilter);
}

addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', handleFilterClick);
});

renderTasks('all');