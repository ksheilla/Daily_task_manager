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
            // Send task to backend
            await fetch('http://localhost:5000/add_task', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task: taskText, phone_number: phoneNumber })
            });

            // Refresh task list
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
        alert("Failed to load tasks. Ensure the server is running.");
    }
}

// Update Task List in UI
function updateTaskList(tasks) {
    taskListEl.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (task.completed) li.classList.add('completed');

        // Create task description
        const descriptionDiv = document.createElement('div');
        descriptionDiv.className = 'task-description';
        descriptionDiv.textContent = task.task;

        // Create buttons container
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'task-buttons';

        // Complete button
        const completeBtn = document.createElement('button');
        completeBtn.className = 'task-button complete-button';
        completeBtn.innerHTML = '<i class="fas fa-check"></i>';
        completeBtn.onclick = () => toggleComplete(index + 1); // Backend uses 1-based index

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'task-button delete-button';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.onclick = () => deleteTask(index + 1); // Backend uses 1-based index

        buttonsDiv.appendChild(completeBtn);
        buttonsDiv.appendChild(deleteBtn);

        // Append to task card
        li.appendChild(descriptionDiv);
        li.appendChild(buttonsDiv);

        taskListEl.appendChild(li);
    });
}

// Toggle Task Completion
async function toggleComplete(task_number) {
    try {
        await fetch(`http://localhost:5000/mark_complete/${task_number}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        fetchTasks(); // Refresh task list
    } catch (error) {
        console.error("Error marking task as complete:", error);
    }
}

// Delete Task
async function deleteTask(task_number) {
    try {
        await fetch(`http://localhost:5000/delete_task/${task_number}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        fetchTasks(); // Refresh task list
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}
