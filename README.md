# Todo List (React)

A CRUD todo app built with React and Tailwind CSS, as a follow-up practice project after building a Contact Book — focused on learning derived state, controlled inputs, and browser persistence.

**[Live Demo](https://todo-list-charu21.vercel.app/)** 

## Features

- **Add** a todo by typing and pressing Enter or clicking Add
- **Toggle** a todo complete/incomplete via checkbox, with strikethrough styling when done
- **Edit** a todo's text in place — double-click the text or click the pencil icon, save with Enter or by clicking away, cancel with Escape
- **Delete** a todo
- **Filter** view: All / Active / Completed, with the active tab visually highlighted
- **Live count** of remaining active todos (switches to a completed count when viewing the Completed filter)
- **Clear completed** — removes all completed todos in one click, disabled when there's nothing to clear
- **Persists to `localStorage`** — todos survive a page refresh

## What I learned

This project built directly on patterns from my [Contact Book](#) project, with a few new concepts layered in:

- The distinction between `useState` (source-of-truth data) and `useMemo` (derived/computed values like the filtered list and item count) — and why deriving instead of duplicating state avoids sync bugs
- Controlled vs. uncontrolled inputs — every input's `value` is tied to state, so a checkbox with `checked` but no `onChange` silently becomes read-only (learned this the hard way from a React console warning)
- Immutable state updates — updating todos via `.map()`/`.filter()` to produce new arrays rather than mutating objects in place
- `localStorage` persistence: reading with a lazy `useState` initializer so it only runs once on mount, and writing with `useEffect` so it stays a side effect rather than being mixed into render logic
- Extracting a `<TodoItem>` child component and "lifting state up" — the parent owns all state, children receive data and callback props and report events back upward
- Debugging a real logic bug (a guard clause using `&&` where `||` was needed) by tracing through what conditions should actually block the action

## Tech stack

- React (Vite)
- Tailwind CSS
- [lucide-react](https://lucide.dev/) for icons
- Browser `localStorage` for persistence (no backend)

## Running locally

```bash
git clone https://github.com/Charulathak/todo-list.git
cd todo-list
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

## Possible next steps

- Drag-to-reorder todos
- Due dates with overdue styling
- Connect to a backend API for persistence across devices instead of `localStorage`
- Undo after deleting a todo

## Notes

Built as a learning exercise to practice React state management, derived data, and browser storage from the ground up.