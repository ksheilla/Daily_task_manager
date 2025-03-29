from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from twilio.rest import Client
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)
CORS(app)  # Enable CORS

# Twilio credentials
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")

# Initialize Twilio client
twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

# Task Manager Logic
class TaskManager:
    def __init__(self):
        self.tasks = []

    def add_task(self, task, phone_number=None):
        """Add a task and send SMS reminder if phone number is provided."""
        self.tasks.append({"task": task, "completed": False})
        if phone_number:
            self.send_sms_reminder(phone_number, task)
        return f"Task added: {task}"

    def send_sms_reminder(self, phone_number, task):
        """Send SMS via Twilio."""
        try:
            message = twilio_client.messages.create(
                body=f"New Task Added: {task}",
                from_=TWILIO_PHONE_NUMBER,
                to=phone_number
            )
            print(f"SMS sent to {phone_number}: {message.sid}")
        except Exception as e:
            print(f"Twilio Error: {e}")

    def view_tasks(self):
        """Return all tasks."""
        return self.tasks

    def mark_complete(self, task_number):
        """Mark a task as complete."""
        if 1 <= task_number <= len(self.tasks):
            self.tasks[task_number - 1]["completed"] = True
            return f"Task {task_number} marked as complete."
        return "Invalid task number."

    def delete_task(self, task_number):
        """Delete a task."""
        if 1 <= task_number <= len(self.tasks):
            removed_task = self.tasks.pop(task_number - 1)
            return f"Deleted task: {removed_task['task']}"
        return "Invalid task number."

# Initialize TaskManager
manager = TaskManager()

# Serve Frontend Files
@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('static', path)

# Flask Routes for API
@app.route('/add_task', methods=['POST'])
def add_task():
    data = request.json
    task = data.get("task")
    phone_number = data.get("phone_number")
    if not task:
        return jsonify({"error": "No task provided"}), 400
    return jsonify({"message": manager.add_task(task, phone_number)}), 200

@app.route('/view_tasks', methods=['GET'])
def view_tasks():
    tasks = manager.view_tasks()
    return jsonify({"tasks": tasks}), 200

@app.route('/mark_complete/<int:task_number>', methods=['POST'])
def mark_complete(task_number):
    message = manager.mark_complete(task_number)
    return jsonify({"message": message}), 200

@app.route('/delete_task/<int:task_number>', methods=['DELETE'])
def delete_task(task_number):
    message = manager.delete_task(task_number)
    return jsonify({"message": message}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)