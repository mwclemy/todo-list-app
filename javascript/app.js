/* 
  Variables
*/
let todoItems = [];


/* 
  selectors
*/

const list = document.querySelector('.js-todo-list');
const form = document.querySelector('.js-form');
const select =  document.querySelector('.filter-todos');

/* 
  Event Listeners
*/ 

// add a DOMContentLoaded event listener to the document
document.addEventListener('DOMContentLoaded', () => {
  const ref = localStorage.getItem('todoItemsRef');
  if (ref) {
    todoItems = JSON.parse(ref);
    todoItems.forEach(t => {
      renderTodo(t);
    });
  }
});


// add a click event listener to an ul
list.addEventListener('click', event => {
  if (event.target.classList.contains('js-tick')) {
    const itemKey = event.target.parentElement.dataset.key;
    toggleDone(itemKey);
  }

  if (event.target.classList.contains('js-delete-todo')) {
    const itemKey = event.target.parentElement.dataset.key;
    deleteTodo(itemKey);
  }
});


// add a submit event listener to the form
form.addEventListener('submit', event => {
  event.preventDefault();
  const input = document.querySelector('.js-todo-input');
  const text = input.value.trim();
  if (text !== '') {
    addTodo(text);
    input.value = '';
    input.focus();
  }
});

// add on change event lister to the select
select.addEventListener('change', filterTodo);


/*
  Functions 
*/

// function to render to do items to the the page
function renderTodo(todo) {
  localStorage.setItem('todoItemsRef', JSON.stringify(todoItems));
  const list = document.querySelector('.js-todo-list');
  const item = document.querySelector(`[data-key='${todo.id}']`);

  if (todo.deleted) {
    item.remove();
    if (todoItems.length === 0) list.innerHTML = '';
    return
  }

  const isChecked = todo.checked ? 'done': '';
  
  const node = document.createElement("li");
  node.setAttribute('class', `todo-item ${isChecked}`);
  node.setAttribute('data-key', todo.id);
  node.innerHTML = `
    <input id="${todo.id}" type="checkbox"/>
    <label for="${todo.id}" class="tick js-tick"></label>
    <span>${todo.text}</span>
    <button class="delete-todo js-delete-todo">
    <svg><use href="#delete-icon"></use></svg>
    </button>
  `;

  if (item) {
    list.replaceChild(node, item);
  } else {
    list.append(node);
  }
}


// function to create a new todo object based on the text that was 
// entered in the text input, and push it into the `todoItems` array
function addTodo(text) {
  const todo = {
    text,
    checked: false,
    id: Date.now(),
  };

  todoItems.push(todo);
  renderTodo(todo);
}


// function that locates the todo item in the todoItems array 
// and set its checked property to the opposite.
function toggleDone(key) {
  // findIndex returns the position of an element in the array.
  const index = todoItems.findIndex(item => item.id === Number(key));
  todoItems[index].checked = !todoItems[index].checked;
  renderTodo(todoItems[index]);
}


// function to create a new object with properties of the current todo item 
// and add a `deleted` property which is set to true
function deleteTodo(key) {
  const index = todoItems.findIndex(item => item.id === Number(key));
  const todo = {
    deleted: true,
    ...todoItems[index]
  };
  // remove the todo item from the array by filtering it out
  todoItems = todoItems.filter(item => item.id !== Number(key));
  renderTodo(todo);
}


// function to filter todo items by category `all`, `completed` and `uncompleted`
function filterTodo(e) {
  const todos = list.childNodes;
  todos.forEach(todo => {
    switch(e.target.value) {
      case 'all':
        todo.style.display= 'flex';
      break;
      case 'completed':
        if (todo.classList.contains('done')) {
          todo.style.display= 'flex';
        }
        else {
          todo.style.display= 'none';
        }
      break;
      case 'uncompleted':
        if (!todo.classList.contains('done')) {
          todo.style.display= 'flex';
        }
        else {
          todo.style.display= 'none';
        }
      break;
      default:
        todo.style.display= 'flex';
      break;
    }
  });

}






