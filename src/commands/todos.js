import { Command } from "commander";
import inquirer from "inquirer";
import { supabase } from "../utils/supabaseClient.js";
import chalk from "chalk";
import { store } from "../utils/storage.js";
import { exit } from "process";

const program = new Command();
const session = store.get("user")

export const todo_add = program.command("todo-add")
    .description("Add a new todo")
    .action(async() => {
        if (!session) {
            console.log(chalk.yellowBright("You are not logged in! Login first..."))
            exit(1)
        }

        inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "Enter a title: ",
            },
            {
                type: "list",
                name: "priority",
                message: "Select a priority: ",
                choices: ["low", "medium", "high"],
            },
            {
                type: "input",
                name: "due_date",
                message: "Enter a due date (yyyy-mm-dd): ",
            }
        ]).then(async(answers) => {
            const {error} = await supabase.from("todos").insert([
                {
                    author: session.id,
                    title: answers.title,
                    priority: answers.priority,
                    due_date: answers.due_date,
                    status: "todo",
                }
            ])
            if (error) {
                console.log(chalk.redBright(error.message));
                exit(1)
            }
            else {
                console.log(chalk.greenBright("Todo added successfully!"))
            }
        });
    });

export const todo_list = program.command("todo-list")
    .description("List all todos")
    .action(async() => {
        if (!session) {
            console.log(chalk.yellowBright("You are not logged in! Login first..."))
            exit(1)
        }

        const {data, error} = await supabase.from("todos").select("*").eq("author", session.id)
        if (error) {
            console.log(chalk.redBright(error.message));
            exit(1)
        }
        else {
            console.log(chalk.greenBright("Your todos:"))
            const rows = []
            data.forEach(todo => {
                rows.push({Title: todo.title, Priority: todo.priority, Due_date: todo.due_date, Status: todo.status === 'todo' ? ' ✅ ' : todo.status === 'in-progress'? ' 🚧 ' : ' ❌ '})
            })
            console.table(rows)
        }
    });

export const todo_update = program.command("todo-update")
    .description("Update a todo")
    .action(async() => {
        if (!session) {
            console.log(chalk.yellowBright("You are not logged in! Login first..."))
            exit(1)
        }

        const {data, error} = await supabase.from("todos").select("*").eq("author", session.id)
        if (error) {
            console.log(chalk.redBright(error.message));
            exit(1)
        }
        else {
            const todos = []
            data.forEach(todo => {
                todos.push({name: todo.title, value: todo.id})
            })
            inquirer.prompt([
                {
                    type: "list",
                    name: "todo",
                    message: "Select a todo: ",
                    choices: todos,
                },
                {
                    type: "list",
                    name: "status",
                    message: "Select a status: ",
                    choices: ["todo", "in-progress", "done"],
                },
            ]).then(async(answers) => {
                const {error} = await supabase.from("todos").update({status: answers.status}).eq("id", answers.todo)
                if (error) {
                    console.log(chalk.redBright(error.message));
                    exit(1)
                }
                else {
                    console.log(chalk.greenBright("Todo updated successfully!"))
                }
            });
        }
    });
