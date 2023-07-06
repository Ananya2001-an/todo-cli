## todo-cli

It's a simple TODO and note-taking cli app. It's made with nodejs and uses supabase to store data and authenticate users.

https://github.com/Ananya2001-an/todo-cli/assets/55504616/2e6589e6-63a6-418e-bee0-0a914e17cdaf

## Development
You can fork this repo and then clone it on your machine. You should create a .env file and store your supabase credentials inside it. Follow the .env.example file for reference.

> Requirements/Dependencies
- [Nodejs](https://nodejs.org/en/)
- [Supabase](https://supabase.com/)
- [Commander](https://www.npmjs.com/package/commander)
- [Inquirer](https://www.npmjs.com/package/inquirer)
- [Chalk](https://www.npmjs.com/package/chalk)
- [Figlet](https://www.npmjs.com/package/figlet)

```bash
npm install
```

```bash
node src/index.js help
```

## Commands
- register: Register a new user
- login: Login a user
- logout: Logout a user
- todo-add: Add a new todo
- todo-list: List all todos
- todo-update: Update a todo
- todo-delete: Delete a todo
- note-add: Add a new note
- note-list: List all notes
- note-view: View a note
- note-delete: Delete a note

## License
[MIT](https://choosealicense.com/licenses/mit/)
```

