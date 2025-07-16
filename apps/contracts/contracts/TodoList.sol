// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TodoList
 * @dev A simple Todo list smart contract
 */
contract TodoList {
    struct Todo {
        uint256 id;
        string title;
        string description;
        bool completed;
        uint256 createdAt;
        uint256 updatedAt;
    }

    // Events
    event TodoCreated(uint256 indexed id, string title, address indexed owner);
    event TodoUpdated(uint256 indexed id, string title, bool completed);
    event TodoDeleted(uint256 indexed id);

    // State variables
    uint256 private _nextId;
    mapping(address => mapping(uint256 => Todo)) private _todos;
    mapping(address => uint256[]) private _userTodoIds;

    /**
     * @dev Create a new todo
     * @param title The title of the todo
     * @param description The description of the todo
     * @return id The id of the created todo
     */
    function createTodo(string memory title, string memory description) public returns (uint256) {
        require(bytes(title).length > 0, "Title cannot be empty");

        uint256 id = _nextId++;
        uint256 timestamp = block.timestamp;

        Todo memory newTodo = Todo({
            id: id,
            title: title,
            description: description,
            completed: false,
            createdAt: timestamp,
            updatedAt: timestamp
        });

        _todos[msg.sender][id] = newTodo;
        _userTodoIds[msg.sender].push(id);

        emit TodoCreated(id, title, msg.sender);

        return id;
    }

    /**
     * @dev Get a todo by id
     * @param id The id of the todo
     * @return The todo
     */
    function getTodo(uint256 id) public view returns (Todo memory) {
        require(_todoExists(msg.sender, id), "Todo does not exist");
        return _todos[msg.sender][id];
    }

    /**
     * @dev Get all todos for the caller
     * @return An array of todos
     */
    function getAllTodos() public view returns (Todo[] memory) {
        uint256[] memory ids = _userTodoIds[msg.sender];
        Todo[] memory todos = new Todo[](ids.length);

        for (uint256 i = 0; i < ids.length; i++) {
            todos[i] = _todos[msg.sender][ids[i]];
        }

        return todos;
    }

    /**
     * @dev Update a todo
     * @param id The id of the todo
     * @param title The new title
     * @param description The new description
     * @param completed The new completed status
     */
    function updateTodo(uint256 id, string memory title, string memory description, bool completed) public {
        require(_todoExists(msg.sender, id), "Todo does not exist");
        require(bytes(title).length > 0, "Title cannot be empty");

        Todo storage todo = _todos[msg.sender][id];
        todo.title = title;
        todo.description = description;
        todo.completed = completed;
        todo.updatedAt = block.timestamp;

        emit TodoUpdated(id, title, completed);
    }

    /**
     * @dev Toggle the completed status of a todo
     * @param id The id of the todo
     */
    function toggleCompleted(uint256 id) public {
        require(_todoExists(msg.sender, id), "Todo does not exist");

        Todo storage todo = _todos[msg.sender][id];
        todo.completed = !todo.completed;
        todo.updatedAt = block.timestamp;

        emit TodoUpdated(id, todo.title, todo.completed);
    }

    /**
     * @dev Delete a todo
     * @param id The id of the todo
     */
    function deleteTodo(uint256 id) public {
        require(_todoExists(msg.sender, id), "Todo does not exist");

        // Remove from the ids array
        uint256[] storage ids = _userTodoIds[msg.sender];
        for (uint256 i = 0; i < ids.length; i++) {
            if (ids[i] == id) {
                // Move the last element to the position of the element to delete
                ids[i] = ids[ids.length - 1];
                // Remove the last element
                ids.pop();
                break;
            }
        }

        // Delete from the mapping
        delete _todos[msg.sender][id];

        emit TodoDeleted(id);
    }

    /**
     * @dev Check if a todo exists
     * @param owner The owner of the todo
     * @param id The id of the todo
     * @return Whether the todo exists
     */
    function _todoExists(address owner, uint256 id) private view returns (bool) {
        return _todos[owner][id].createdAt > 0;
    }
}
