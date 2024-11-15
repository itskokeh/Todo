'use strict'

// create the constructor 
class Todo {
  constructor( title, description, dueDate, priority ) {
    this.title = title
    this.description = description
    this.dueDate = dueDate
    this.priority = priority
  }
}

// Create the array collector
const allTodos = []

// Select Elements
const addTask = document.querySelector('#taskAdd')
const main = document.querySelector('#main')
const form = document.querySelector('#form')
const titleInput = document.querySelector('#title')
const descriptionInput = document.querySelector('#description')
const dateInput = document.querySelector('#date')
const priorityInput = document.querySelector('#dropdown')
const submitButton = document.querySelector('#submit')

// Add Event Listeners
addTask.addEventListener( 'click', toggleForm )
submitButton.addEventListener( 'click', (event) => {
  event.preventDefault()

  const inputValues = takeInputValues()
  const newTodo = createTodo(inputValues)
  addtodoToArray(newTodo)

  const newTodoElement = createTodoElement(newTodo)
  appendTodoToDOM(newTodoElement)
  attachDeleteListener(newTodoElement, newTodo)
  resetForm()
  storeTodosToLocalStorage()
})
function takeInputValues() {
  // Collect input values
  const title = titleInput.value
  const description = descriptionInput.value
  const dueDate = dateInput.value
  const priority = priorityInput.value

  return { title, description, dueDate, priority }
}
function createTodo(value) {
  return new Todo ( value.title, value.description, value.dueDate, value.priority )
}
function createTodoElement(todo) {
  // Create new elements
  const todoDiv = document.createElement('div')
  const titleSpan = document.createElement('span')
  const descriptionSpan = document.createElement('span')
  const dueDateSpan = document.createElement('span')
  const prioritySpan  = document. createElement('span')
  const inputDelete = document.createElement('button')
  // Skip blank form spaces
  const title = todo.title || `Untitled (${ new Date().toISOString().slice( 0, 19 )})`
  titleSpan.textContent = `Task Name: ${ title }`
  descriptionSpan.textContent = `Description: ${ todo.description || 'No Description' }`
  dueDateSpan.textContent = `Deadline: ${ todo.dueDate || 'No Due Date' }`
  if (todo.priority) { prioritySpan.textContent = `Priority: ${todo.priority}` }
  inputDelete.textContent = 'Delete'
  // Add Attribute
  inputDelete.classList.add('delete')
  todoDiv.classList.add('content')
  // Append
  todoDiv.append( titleSpan, descriptionSpan, dueDateSpan, prioritySpan, inputDelete )

  return todoDiv
}
function attachDeleteListener(todoDiv,todo) {
  const deleteButton = todoDiv.querySelector('.delete')
  deleteButton.addEventListener('click', (event) => {
    event.stopPropagation()
    const index = allTodos.indexOf(todo)
    deleteTodo(index)
    storeTodosToLocalStorage()
  })
}
function addtodoToArray(todo) {
  allTodos.push(todo)
}
function toggleForm() {
  form.style.display = form.style.display === 'none' ? 'flex' : 'none'
}
function resetForm() {
  form.reset()
  form.style.display = 'none'
}
function appendTodoToDOM(todo) {
  main.appendChild(todo)
}
function deleteTodo(index) {
  console.log(allTodos.splice(index, 1))

  const todoDivs = document.querySelectorAll('.content')
  console.log(todoDivs[index].remove())
}
// Local Storage
function storeTodosToLocalStorage() {
  localStorage.setItem('key', JSON.stringify(allTodos))
}
function loadTodosFromLocalStorage() {
  const storedTodos = localStorage.getItem('key')
  if(storedTodos) {
    allTodos.push(...JSON.parse(storedTodos))
    // Populate the UI with the loaded todos
    allTodos.forEach(todo => {
      const todoElement = createTodoElement(todo)
      appendTodoToDOM(todoElement)
      attachDeleteListener(todoElement, todo)
    })
  }
}
window.addEventListener('load', loadTodosFromLocalStorage)