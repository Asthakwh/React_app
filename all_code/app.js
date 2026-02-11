const express = require('express');
const app = express();

let todos = [];

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>To-Do App</title>
    </head>
    <body>
      <h2>Simple To-Do List</h2>
      <h3>Enter Here day to day tasks</h3>

      <input id="task" placeholder="Enter task" />
      <button onclick="addTask()">Add</button>

      <ul id="list"></ul>

      <script>
        async function loadTasks() {
          const res = await fetch('/todos');
          const data = await res.json();
          document.getElementById('list').innerHTML = 
            data.map((t, i) =>
              '<li>' + t + ' <button onclick="deleteTask(' + i + ')">X</button></li>'
            ).join('');
        }

        async function addTask() {
          const task = document.getElementById('task').value;
          await fetch('/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task })
          });
          document.getElementById('task').value = '';
          loadTasks();
        }

        async function deleteTask(index) {
          await fetch('/todos/' + index, { method: 'DELETE' });
          loadTasks();
        }

        loadTasks();
      </script>
    </body>
    </html>
  `);
});

app.get('/todos', (req, res) => {
  res.json(todos);
});

app.post('/todos', (req, res) => {
  if (req.body.task) {
    todos.push(req.body.task);
  }
  res.sendStatus(200);
});

app.delete('/todos/:id', (req, res) => {
  todos.splice(req.params.id, 1);
  res.sendStatus(200);
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
