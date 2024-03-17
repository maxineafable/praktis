const addBtn = document.querySelector('.add')
const tasksList = document.querySelector('.tasks-list')
const taskRemainElement = document.querySelector('.task-remain')
const msg = document.querySelector('.msg')

const localStorageKey = 'todo.todoItem'
let todos = JSON.parse(localStorage.getItem(localStorageKey)) || []

addBtn.addEventListener('click', e => {
  e.target.setAttribute('disabled', '')
  msg.style.display = 'none'

  const { todoValueInput } = createTodoInput()
  todoValueInput.focus()
  todoValueInput.addEventListener('blur', e => {
    if (e.target.value === '') {
      e.target.closest('.task').remove()
      displayNoTask()
      addBtn.removeAttribute('disabled')
    } else {
      const todoName = createTodo(e.target.value)
      todos.unshift(todoName)
      console.log(todos)
      addBtn.removeAttribute('disabled')
      displayNoTask()
      save()
      render()
    }
  })
})

function createTodoInput() {
  const taskDiv = document.createElement('div')
  taskDiv.classList.add('task')
  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.classList.add('checkbox')
  const todoValueInput = document.createElement('input')
  todoValueInput.type = 'text'
  todoValueInput.classList.add('todo-value')

  const actionsDiv = document.createElement('div')
  actionsDiv.classList.add('actions')
  const editBtn = document.createElement('button')
  editBtn.classList.add('edit')
  editBtn.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`
  const deleteBtn = document.createElement('button')
  deleteBtn.classList.add('delete')
  deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`

  actionsDiv.append(editBtn, deleteBtn)
  taskDiv.append(checkbox, todoValueInput, actionsDiv)
  tasksList.prepend(taskDiv)
  return { taskDiv, checkbox, todoValueInput, actionsDiv, editBtn, deleteBtn }
}

function createTodo(todoName) {
  return { id: Date.now().toString(), task: todoName, complete: false }
}

function renderTaskRemain() {
  const taskRemainCount = todos.filter(todo => !todo.complete).length
  const taskRemainDisplay = taskRemainCount <= 1 ? 'task' : 'tasks'
  taskRemainElement.textContent = `${taskRemainCount} ${taskRemainDisplay} remaining`
}

function displayNoTask() {
  if (todos.length === 0) {
    msg.style.display = 'block'
  } else {
    msg.style.display = 'none'
  }
}

function render() {
  tasksList.innerHTML = ''
  displayNoTask()
  todos.forEach(todo => {
    const { taskDiv, checkbox, todoValueInput, actionsDiv, editBtn, deleteBtn } = createTodoInput()
    checkbox.id = todo.id
    checkbox.checked = todo.complete
    todoValueInput.value = todo.task
    todoValueInput.setAttribute('disabled', '')
    taskDiv.append(checkbox, todoValueInput, actionsDiv)
    tasksList.append(taskDiv)

    checkbox.addEventListener('click', e => {
      todo.complete = checkbox.checked
      console.log(todo)
      save()
      renderTaskRemain()
    })

    editBtn.addEventListener('click', e => {
      todoValueInput.removeAttribute('disabled')
      todoValueInput.focus()
    })

    todoValueInput.addEventListener('blur', e => {
      e.target.setAttribute('disabled', '')
      todo.task = e.target.value
      save()
      render()
    })

    deleteBtn.addEventListener('click', e => {
      todos = todos.filter(t => t != todo)
      console.log(todos)
      save()
      render()
      renderTaskRemain()
    })

    renderTaskRemain()
  })
}

function save() {
  localStorage.setItem(localStorageKey, JSON.stringify(todos))
}

render()