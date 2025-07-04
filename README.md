# Todo List App

A professional, clean, and modern Todo List web application built with React.  
Features include due dates, priority levels, local storage persistence, and a responsive UI.

## Features

- **Add, edit, and delete todos**
- **Each todo includes:**
  - Title
  - Due date
  - Priority (Low / Medium / High)
  - Mark as complete/incomplete
- **Filter and sort** by due date or priority
- **Persistent storage** via browser localStorage
- **Clean, professional UI** with responsive design

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/todo-list-app.git
    cd todo-list-app
    ```

2. **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3. **Run the development server:**
    ```bash
    npm start
    # or
    yarn start
    ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  App.js
  index.js
  styles.css
  components/
    TodoList.js
    TodoItem.js
    TodoForm.js
public/
  index.html
README.md
```

## Customization

- You can adjust styles in `src/styles.css`.
- To use a UI framework, swap out components or add dependencies (e.g., Material-UI, Bootstrap).

## License

MIT

---

**Made with React.**