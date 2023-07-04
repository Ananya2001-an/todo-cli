import { Command } from "commander";
import inquirer from "inquirer";
import { supabase } from "../utils/supabaseClient.js";
import chalk from "chalk";
import Storage from "node-storage";
import { exit } from "process";

const store = new Storage("./user.json");
const program = new Command();

export const register = program.command("register")
    .description("Register a new account")
    .action(() => {
        inquirer.prompt([
            {
                type: "email",
                name: "email",
                message: "Enter an email: ",
            },
            {
                type: "password",
                name: "password",
                message: "Enter a password: ",
            },
            {
                type: "input",
                name: "name",
                message: "Enter a name: ",
            }
        ]).then(async(answers) => {
            const {error} = await supabase.auth.signUp({
                email: answers.email,
                password: answers.password,
                options:{
                    data: {
                        name: answers.name,
                    }
                }})
            if (error) {
                console.log(chalk.redBright(error.message));
            }
            else {
                console.log(chalk.yellowBright("Verify your email to complete registration!"))
            }
        });
    });

export const login = program.command("login")
    .description("Login to your account")
    .action(async() => {
        const session = store.get("user")
        if (session) {
            console.log(chalk.yellowBright("You are already logged in! Logout first..."))
            exit(1)
        }

        inquirer.prompt([
                {
                    type: "email",
                    name: "email",
                    message: "Enter your email: ",
                },
                {
                    type: "password",
                    name: "password",
                    message: "Enter your password: ",
                },
            ]).then(async(answers) => {
                const {data, error} = await supabase.auth.signInWithPassword({
                    email: answers.email,
                    password: answers.password,
                })
                if (error) {
                    console.log(chalk.redBright(error.message));
                }
                else {
                    store.put("user", data.user)
                    console.log(chalk.greenBright(`Welcome ${data.user.user_metadata.name}!`))
                }
            });
    });

export const logout = program.command("logout")
    .description("Logout of your account")
    .action(() => {
        store.remove("user")
        console.log(chalk.greenBright("Logged out successfully!"))
    });

