import { test, expect } from '@playwright/test';

test.describe('Todo List', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the todo list page
    await page.goto('/');
  });

  test('should display the todo list', async ({ page }) => {
    // Check that the todo list is displayed
    await expect(page.locator('h1')).toHaveText('Todo List');
    await expect(page.getByTestId('todo-list')).toBeVisible();
  });

  test('should add a new todo', async ({ page }) => {
    // Type a new todo title
    await page.getByTestId('new-todo-input').fill('Buy groceries');

    // Click the add button
    await page.getByTestId('add-todo-button').click();

    // Check that the new todo is added to the list
    await expect(page.getByText('Buy groceries')).toBeVisible();
  });

  test('should toggle todo status', async ({ page }) => {
    // Add a new todo
    await page.getByTestId('new-todo-input').fill('Walk the dog');
    await page.getByTestId('add-todo-button').click();

    // Find the todo item
    const todoItem = page.getByText('Walk the dog').locator('..');

    // Get the checkbox
    const checkbox = todoItem.getByRole('checkbox');

    // Initially, the todo should not be completed
    await expect(checkbox).not.toBeChecked();

    // Toggle the todo status
    await checkbox.click();

    // Now the todo should be completed
    await expect(checkbox).toBeChecked();

    // The todo title should have the 'completed' class
    await expect(todoItem.locator('span')).toHaveClass(/completed/);
  });

  test('should delete a todo', async ({ page }) => {
    // Add a new todo
    await page.getByTestId('new-todo-input').fill('Read a book');
    await page.getByTestId('add-todo-button').click();

    // Find the todo item
    const todoItem = page.getByText('Read a book').locator('..');

    // Click the delete button
    await todoItem.getByText('Delete').click();

    // The todo should be removed from the list
    await expect(page.getByText('Read a book')).not.toBeVisible();
  });

  test('should handle empty input', async ({ page }) => {
    // Try to add a todo with empty title
    await page.getByTestId('new-todo-input').fill('');
    await page.getByTestId('add-todo-button').click();

    // No new todo should be added
    await expect(page.getByTestId('no-todos')).toBeVisible();
  });

  test('should handle multiple todos', async ({ page }) => {
    // Add multiple todos
    const todos = ['Task 1', 'Task 2', 'Task 3'];

    for (const todo of todos) {
      await page.getByTestId('new-todo-input').fill(todo);
      await page.getByTestId('add-todo-button').click();
    }

    // Check that all todos are displayed
    for (const todo of todos) {
      await expect(page.getByText(todo)).toBeVisible();
    }

    // Delete the second todo
    const todoItem = page.getByText('Task 2').locator('..');
    await todoItem.getByText('Delete').click();

    // Check that the second todo is removed
    await expect(page.getByText('Task 2')).not.toBeVisible();

    // Check that the other todos are still displayed
    await expect(page.getByText('Task 1')).toBeVisible();
    await expect(page.getByText('Task 3')).toBeVisible();
  });
});
