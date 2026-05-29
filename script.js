const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const errorMessage = document.getElementById('errorMessage');
const filterBtns = document.querySelectorAll('.filter-btn');
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
l
let currentFilter = 'all';

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (systemPrefersDark) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }
}

function applyTheme(theme) {
    if (theme === 'dark') {
        htmlElement.setAttribute('data-theme', 'dark');
    } else {
        htmlElement.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
}

function addTask() {
    const text = taskInput.value.trim();
    
    if (text === '') {
        showError();
        return;
    }

    hideError();

    showLoading(true);

    setTimeout(() => {
        const newTask = {
            id: Date.now(),
            text: text,
            status: 'pending'
        };

        tasks.push(newTask);
        saveAndRender();
        
        taskInput.value = '';
        showLoading(false);
    }, 500);
}

function showError() {
    taskInput.classList.add('error');
    taskInput.focus();
}

function hideError() {
    taskInput.classList.remove('error');
}

function showLoading(isLoading) {
    if (isLoading) {
        addBtn.classList.add('loading');
        addBtn.disabled = true;
    } else {
        addBtn.classList.remove('loading');
        addBtn.disabled = false;
    }
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

    if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = filter === 'all' ? 'Nenhuma tarefa cadastrada!' : 
                                   filter === 'pending' ? 'Nenhuma tarefa pendente!' : 
                                   'Nenhuma tarefa concluída!';
        taskList.appendChild(emptyMessage);
        return;
    }

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.status === 'completed' ? 'completed' : ''}`;
        
        li.innerHTML = `
            <span class="task-text" onclick="toggleStatus(${task.id})">${task.text}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Excluir</button>
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
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        tasks = tasks.filter(task => task.id !== id);
        saveAndRender();
    }
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

taskInput.addEventListener('input', function() {
    hideError();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', handleFilterClick);
});

themeToggle.addEventListener('click', toggleTheme);

initTheme();
renderTasks('all');