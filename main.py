from task_manager import TaskManager

def main():
    manager = TaskManager()

    while True:
        print("\n--- Daily Task Manager ---")
        print("1. Add Task")
        print("2. View Tasks")
        print("3. Mark Task as Complete")
        print("4. Delete Task")
        print("5. Exit")

        choice = input("Enter your choice: ")

        if choice == "1":
            task = input("Enter task description: ")
            manager.add_task(task)

        elif choice == "2":
            manager.view_tasks()

        elif choice == "3":
            manager.view_tasks()
            task_number = int(input("Enter task number to mark as complete: "))
            manager.mark_complete(task_number)

        elif choice == "4":
            manager.view_tasks()
            task_number = int(input("Enter task number to delete: "))
            manager.delete_task(task_number)

        elif choice == "5":
            print("Exiting the app. Stay productive!")
            break

        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()