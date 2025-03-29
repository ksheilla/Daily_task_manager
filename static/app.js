// DOM Elements
const addTaskForm = document.getElementById('addTaskForm');
const taskListEl = document.getElementById('taskList');
const loader = document.getElementById('loader');

// Fetch and display tasks on page load
fetchTasks();

// Add Task
addTaskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const taskInput = document.getElementById('task');
    const phoneNumberInput = document.getElementById('phoneNumber');
    const taskText = taskInput.value.trim();
    const phoneNumber = phoneNumberInput.value.trim();

    if (taskText) {
        // Show loader
        loader.classList.remove('hidden');

        try {
            // Add task to backend
            await fetch('http://localhost:5000/add_task', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task: taskText, phone_number: phoneNumber })
            });

            // Fetch updated tasks
            fetchTasks();

            // Clear inputs and hide loader
            taskInput.value = '';
            phoneNumberInput.value = '';
            loader.classList.add('hidden');
        } catch (error) {
            console.error("Error adding task:", error);
            alert("Failed to add task. Is the server running?");
        }
    }
});

// Fetch tasks from backend
async function fetchTasks() {
    try {
        const response = await fetch('http://localhost:5000/view_tasks');
        const data = await response.json();
        updateTaskList(data.tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}

// Update Task List in UI
function updateTaskList(tasks) {
    taskListEl.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (task.completed) li.classList.add('completed');

        li.innerHTML = `
            <span>${task.task}</span>
            <div>
                <button onclick="toggleComplete(${index})"><i class="fas fa-check"></i></button>
                <button onclick="deleteTask(${index})"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;

        taskListEl.appendChild(li);
    });
}

// Toggle Task Completion
async function toggleComplete(index) {
    try {
        await fetch(`http://localhost:5000/mark_complete/${index + 1}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        fetchTasks();  // Refresh task list
    } catch (error) {
        console.error("Error marking task as complete:", error);
    }
}

// Delete Task
async function deleteTask(index) {
    try {
        await fetch(`http://localhost:5000/delete_task/${index + 1}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        fetchTasks();  // Refresh task list
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}