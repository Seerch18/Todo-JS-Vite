import todoStore, { Filters } from '../store/todo.store';
import html from './app.html?raw';
import { renderPending, renderTodos } from './use-cases';

const ElementIDs = {
    TodoList: '.todo-list',
    NewTodoInput: '#new-todo-input',
    DestoryTodo: 'destroy',
    ClearCompleted: '.clear-completed',
    FiltersTodo: '.filtro',
    PendingCount: '#pending-count',
}

/**
 * 
 * @param {String} elementId 
 */
export const App = (elementId) => {

    const displayTodos = () => {
        const todos = todoStore.getTodos(todoStore.getCurrentFilter());
        renderTodos(ElementIDs.TodoList, todos);
        updatePendingCount();
    }

    const updatePendingCount = () => {
        renderPending(ElementIDs.PendingCount);
    }

    (() => {

        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector(elementId).append(app);
        displayTodos();
    })()


    // Referencias HTML
    const newDescriptionInput = document.querySelector(ElementIDs.NewTodoInput);
    const todoListUl = document.querySelector(ElementIDs.TodoList);
    const clearCompletedButton = document.querySelector(ElementIDs.ClearCompleted);
    const filtersTodoLis = document.querySelectorAll(ElementIDs.FiltersTodo);

    // Listeners
    newDescriptionInput.addEventListener('keyup', (event) => {
        const { keyCode, target } = event;
        if (keyCode !== 13) return;
        if (target.value.trim().length === 0) return;
        todoStore.addTodo(target.value);
        displayTodos();
        target.value = '';
    });

    todoListUl.addEventListener('click', (event) => {
        const element = event.target.closest('[data-id]');
        todoStore.toggleTodo(element.getAttribute('data-id'));
        displayTodos();
    });

    todoListUl.addEventListener('click', (event) => {
        const element = event.target.closest('[data-id]');
        if (!element || event.target.className !== ElementIDs.DestoryTodo) return;
        todoStore.deleteTodo(element.getAttribute('data-id'));
        displayTodos();
    });

    clearCompletedButton.addEventListener('click', (event) => {
        todoStore.deleteCompleted();
        displayTodos();
    });


    filtersTodoLis.forEach((element) => {

        element.addEventListener('click', (event) => {
            filtersTodoLis.forEach(ele => ele.classList.remove('selected'));
            element.classList.add('selected');

            switch (element.innerHTML) {
                case 'Todos':
                    todoStore.setFilter(Filters.All);
                    break;
                case 'Pendientes':
                    todoStore.setFilter(Filters.Pending);
                    break;
                case 'Completados':
                    todoStore.setFilter(Filters.Completed);
                    break;
                default:
                    break;
            }
            displayTodos();
        });

    });



}