class TaskManager:
    def __init__(self):
        self.tasks = []  # List to store tasks

    def add_task(self, task):
        """Add a new task."""
        self.tasks.append({"task": task, "completed": False})
        print(f"Task added: {task}")

    def view_tasks(self):
        """Display all tasks."""
        if not self.tasks:
            print("No tasks available.")
            return

        print("\n--- Your Tasks ---")
        for idx, task in enumerate(self.tasks, start=1):
            status = "✓" if task["completed"] else " "
            print(f"{idx}. [{status}] {task['task']}")
        print("------------------\n")

    def mark_complete(self, task_number):
        """Mark a task as complete."""
        if 1 <= task_number <= len(self.tasks):
            self.tasks[task_number - 1]["completed"] = True
            print(f"Task {task_number} marked as complete.")
        else:
            print("Invalid task number.")

    def delete_task(self, task_number):
        """Delete a task."""
        if 1 <= task_number <= len(self.tasks):
            removed_task = self.tasks.pop(task_number - 1)
            print(f"Deleted task: {removed_task['task']}")
        else:
            print("Invalid task number.")