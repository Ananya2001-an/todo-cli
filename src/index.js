import { Command } from "commander";
import figlet from "figlet";
import chalk from "chalk";

import { register, login, logout } from "./commands/auth.js";
import { todo_add, todo_list, todo_update, todo_delete } from "./commands/todos.js";
import { note_add, note_list, note_view, note_delete } from "./commands/notes.js";

const program = new Command();

program
    .name("todo-cli")
    .version("1.0.0")
    .description(chalk.cyanBright.bold(figlet.textSync("todo-cli") + "\n A simple TODO and note-taking cli app"))

// "auth" commands
program.addCommand(register);
program.addCommand(login);
program.addCommand(logout);

// "todo" commands
program.addCommand(todo_add);
program.addCommand(todo_list);
program.addCommand(todo_update);
program.addCommand(todo_delete);

// "note" commands
program.addCommand(note_add);
program.addCommand(note_list);
program.addCommand(note_view);
program.addCommand(note_delete);

program.parse()