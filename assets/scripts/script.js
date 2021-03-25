const collapseButton = document.querySelector('[data-js="collapse-btn"]');
const todoLists = document.querySelectorAll('.list');
const popup = document.querySelector('[data-js="popup"]');
const confirmButton = document.querySelector('[data-js="confirm"]');
const cancelButton = document.querySelector('[data-js="cancel"]');
const completedTodos = document.querySelector('[data-js="todo-completed"]');
const pendingTodos = document.querySelector('[data-js="todo-pending"]');
const formAddTodo = document.querySelector('form');

let possibleRemove = null;

const deleteTodo = () => {
  const parentList = possibleRemove.parentElement;
  parentList.removeChild(possibleRemove);
  togglePopup();
};

const getCollapseDiv = (elem, selector) => {
  let parentBox = elem.parentElement.parentElement;
  return parentBox.nextElementSibling;
};

const showCollapsedDiv = targetDiv => {
  const hasMaxHeight = targetDiv.style.maxHeight;

  targetDiv.style.maxHeight = hasMaxHeight
    ? null
    : targetDiv.scrollHeight + 'px';
};

collapseButton.addEventListener('click', () => {
  showCollapsedDiv(collapseButton.nextElementSibling);
});

const togglePopup = params => popup.classList.toggle('visible');

const toggleBorderType = element => {
  const bordereds = element.querySelectorAll('.todo-box');

  bordereds.forEach(bordered => {
    bordered.classList.toggle('todo-completed');
    bordered.classList.toggle('todo-pending');
  });
};

const switchBetweenLists = (element, goesTo, isIn, opButton, iconText) => {
  isIn.removeChild(element);
  goesTo.insertAdjacentElement('afterbegin', element);
  opButton.textContent = iconText;
  opButton.classList.toggle('btn-warning');
  toggleBorderType(element);
};

const switchLists = todo => {
  const isPending = todo.parentElement.matches('[data-js="todo-pending"]');
  const opButton = todo.querySelector('[data-js="completed-btn"]');

  isPending
    ? switchBetweenLists(
        todo,
        completedTodos,
        pendingTodos,
        opButton,
        'unpublished'
      )
    : switchBetweenLists(
        todo,
        pendingTodos,
        completedTodos,
        opButton,
        'check_circle'
      );
};

const setTargetAndShowDesc = (e, todo) => {
  const target = getCollapseDiv(todo, '.collapse-content');
  showCollapsedDiv(target);
};

const setTargetAndConfirm = e => {
  possibleRemove = e.currentTarget.firstElementChild;
  togglePopup();
};

const setTargetAndSwitchLists = e => {
  const target = e.currentTarget.firstElementChild;
  switchLists(target);
};

const handleButtonsClick = e => {
  const clickedElement = e.target;
  if (clickedElement.matches('[data-js="collapse-desc-btn"]')) {
    setTargetAndShowDesc(e, clickedElement);
  } else if (clickedElement.matches('[data-js="delete-btn"]')) {
    setTargetAndConfirm(e);
  } else if (clickedElement.matches('[data-js="completed-btn"]')) {
    setTargetAndSwitchLists(e);
  }
};

const createTodoHTMLString = (
  title,
  description,
  deadline,
  key
) => `<div class="my-3">
<div
  class="todo-box todo-pending"
>
  <h3 class="py-2">${title}</h3>
  <div class="btn-group w-50 mb-1" role="group">
    <button
      data-js="collapse-desc-btn"
      type="button"
      class="material-icons btn btn-secondary"
    >
      remove_red_eye
    </button>
    <button
      data-js="completed-btn"
      type="button"
      class="material-icons btn btn-success text-light"
    >
      check_circle
    </button>
    <button
      data-js="delete-btn"
      type="button"
      class="material-icons btn btn-danger"
    >
      delete
    </button>
  </div>
</div>
<div class="bg-light todo-box todo-pending collapse-content">
  <h3 class="font-weight-light pt-2">Description</h3>
  <h6 class="font-weight-lighter">
    ${description}
  </h6>
  <hr />
  <h3 class="font-weight-light">Deadline</h3>
  <h6 class="font-weight-lighter">${deadline}</h6>
</div>
</div>`;

const getDeadlineFormated = date => {
  if (date.length) {
    const [year, month, day] = date.split('-');
    return `${month}/${day}/${year}`;
  }
  return '';
};

const addNewTodo = e => {
  e.preventDefault();

  const formTargets = e.target;

  const title = formTargets.title.value;
  const description = formTargets.description.value;
  const deadline = getDeadlineFormated(formTargets.deadline.value);

  const newTodo = createTodoHTMLString(title, description, deadline);
  pendingTodos.insertAdjacentHTML('afterbegin', newTodo);

  showCollapsedDiv(collapseButton.nextElementSibling);

  formAddTodo.reset();
};

const initialize = () => {
  const setPopupActions = () => {
    confirmButton.addEventListener('click', deleteTodo);
    cancelButton.addEventListener('click', togglePopup);
  };

  setPopupActions();

  todoLists.forEach(list => {
    list.addEventListener('click', handleButtonsClick);
  });

  formAddTodo.addEventListener('submit', addNewTodo);
};

initialize();
