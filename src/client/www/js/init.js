(function() {

	var parent = {
		render: render,
		delTodoUI: delTodoUI
	};

	var todosUI = [];

	window.onload = function() {
		render(true);
		applyFilter();
		document.getElementById('new-todo').onkeypress = function(event) {
			if (event.keyCode === 13) {
				var addClean = addTodo(event.target.value);
                                if(addClean){	
					event.target.value = "";
				}
			}
		};
		
		document.getElementById('clear-completed').onclick = function() {
			delChecked();
		};

		document.getElementById('toggle-all').onclick = function() {
			var state = TODO_APP.itemsLeft() > 0;
			checkAll(state);
		};

		window.onhashchange = applyFilter;
	};

	function addTodo(text) {
		var task = text.trim();
		if(task !== ''){
			var todoUI = new TODO_APP.TodoUI(task, parent);
			todosUI.push(todoUI);
			document.getElementById('todo-list').appendChild(todoUI.container);
			render(false);
			return true;
		}
	}
	
	function delTodoUI(todoUI) {
		document.getElementById('todo-list').removeChild(todoUI.container);
		var removed = false,
				i = 0;

		while (!removed && i < todosUI.length) {
			if (todosUI[i] === todoUI) {
				todosUI.splice(i, 1);
				removed = true;
			} else {
				i++;
			}
		}

		render(false);
	}
        
        function sortTodosUI(){
		
            
            console.log(todosUI[0].todo.getCheckDate());
            var aux,
                i = 0,
                    j;
                while(i < todosUI.length){
                    j = i+1;
                    while(j < todosUI.length +1){
                        if(todosUI[i].todo.getChecked() === false && todosUI[j].todo.getChecked() === true){
                            aux = todosUI[i];
                            todosUI[i] = todosUI[j];
                            todosUI[j] = aux;
                            document.getElementById('todo-list').insertBefore(todosUI[j].container, todosUI[i].container);
                        }
                        j++;
                    }
                    i++;
                }
	}

	function delChecked() {
		TODO_APP.delChecked();
		var toDelete = [];

		todosUI.forEach(function(todoUI) {
			if (todoUI.todo.isDeleted()) {
				toDelete.push(todoUI);
			}
		});

		toDelete.forEach(function(todoUI) {
			delTodoUI(todoUI);
		});

		render(false);
	}


	function checkAll(state) {
		TODO_APP.checkAll(state);
		render(true);
	}

	function applyFilter() {
		var pattern = "#/";
		var pos = window.location.hash.indexOf(pattern);
		var filter = window.location.hash.substring(pos + pattern.length);

		TODO_APP.filterTodos(filter);
		render(true);
		renderLink(filter);
	}

	function render(renderChildren) {
		var itemsLeft = document.getElementById('todo-count');
		var clearCompleted = document.getElementById('clear-completed');
		var mainSection = document.getElementById('main');
		var footer = document.getElementById('footer');

		if (TODO_APP.countTodos() > 0) {
			footer.style.display = '';
			mainSection.style.display = '';
			itemsLeft.innerHTML = '<strong>' + TODO_APP.itemsLeft() + "</strong> item" + (TODO_APP.itemsLeft() !== 1 ? "s" : "") + " left";
                        sortTodosUI();
		} else {
			mainSection.style.display = 'none';
			footer.style.display = 'none';
		}

		if (TODO_APP.countTodos() - TODO_APP.itemsLeft() > 0) {
			clearCompleted.style.display = '';
			clearCompleted.innerHTML = "Clear completed (" + (TODO_APP.countTodos() - TODO_APP.itemsLeft()) + ")";
		} else {
			clearCompleted.style.display = 'none';
			clearCompleted.innerHTML = "Clear completed (" + (TODO_APP.countTodos() - TODO_APP.itemsLeft()) + ")";
		}

		if (renderChildren) {
			todosUI.forEach(function(todoUI) {
				todoUI.render();
			});
		}
                
	}

	
		
		/*
		
		1.4. En todo momento, el orden en que se mostrarán los TODOs en la lista de TODOs sera: 

		i) Primero los no realizados de más nuevos a más antiguos,
		ii) y después los realizados: Los que se realizaron antes, aparecerán antes que los que se realizaron después.

		2. Las acciones que modifiquen los TODOs (añadir, borrar, modificar y cambiar estado) se podrán deshacer y rehacer.

		En la interfaz gráfica se mostrarán los clásicos botones para ambas acciones.
		
		
		AYUDA
		
		
		1) Añadir un TODO: Hay que ponerlo el primero de la lista. Esto debe resultar fácil.

		2) Marcar como realizado un TODO: También es fácil. Habría que ponerlo al final de la lista. Un simple appendChild debería valer, ya que este método lo borra del DOM además de añadirlo.

		3) Desmarcar un TODO: Hay que subirlo (porque los no realizados aparecen antes) y ponerlo según corresponda en su orden de creación.

		4) Marcar todos como realizados: Se podría ni ahcer nada  ya que el enunciado no especifica que hacer si varios TODOs tienen la misma fecha de realización (aunque lo lógico sería ordenarlos por el otro criterio: el de creación de más nuevo  a más antiguo).

		5) Marcar todos como no realizados: Es el más difícil ya que implica ordenar el array en la parte de los realizados.

		Yo haría que el array TodosUI tenga el mismo orden que la lista de TODOs que tengo en pantalla. Es decir, que cuando cambiemos la lista de Todos, habría que cambiar TodosUI y el DOM para que se mantengan sincronizados. De esta forma cuando ordenemos TodosUI, podemos acceder al atributo container de cada TodoUI y ordenarlo también.
		
		*/
	
	function renderLink(filter) {
		var links = document.getElementById('filters').getElementsByTagName('a');
		for (var i = 0; i < links.length; i++) {
			links[i].className = '';
		}

		var activeLink = document.getElementById('filter-' + filter) || document.getElementById('filter-all');
		activeLink.className = 'selected';

	}
})();


