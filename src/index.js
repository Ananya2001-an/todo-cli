import { Command } from "commander";
import figlet from "figlet";

import { register, login, logout } from "./commands/auth.js";
import { todo_add, todo_list, todo_update } from "./commands/todos.js";

const program = new Command();

program
    .name("todo-cli")
    .version("1.0.0")
    .description(figlet.textSync("todo-cli") + "\n A simple TODO and note-taking cli app")

// "auth" commands
program.addCommand(register);
program.addCommand(login);
program.addCommand(logout);

// "todo" commands
program.addCommand(todo_add);
program.addCommand(todo_list);
program.addCommand(todo_update);

program.parse()