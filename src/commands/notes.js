import { Command } from "commander";
import inquirer from "inquirer";
import { supabase } from "../utils/supabaseClient.js";
import chalk from "chalk";
import { store } from "../utils/storage.js";
import { exit } from "process";
import { readFileSync } from "fs";
import terminalImage from "terminal-image";
import chalkAnimation from "chalk-animation";

const program = new Command();
const session = store.get("user")

export const note_add = program.command("note-add")
    .description("Add a new note")
    .action(async() => {
        if (!session) {
            console.log(chalk.yellowBright("⚠️ You are not logged in! Login first..."))
            exit(1)
        }

        inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "Enter a title for your note: ",
            },
            {
                type: "input",
                name: "note",
                message: "Write your note: ",
            },
            {
                type: "confirm",
                name: "thumbnail",
                message: "Do you want to add a thumbnail? ",
            }
        ]).then(async(answers) => {
            let image
            if (answers.thumbnail) {
                const res = await inquirer.prompt([
                    {
                        type: "input",
                        name: "thumbnail_path",
                        message: "Select the path for your thumbnail: ",
                    }
                ])
                const { data, error: err } = await supabase
                    .storage
                    .from('thumbnails')
                    .upload(`public/${res.thumbnail_path.split('\\').pop()}`, readFileSync(res.thumbnail_path), {
                        cacheControl: '3600',
                        upsert: false,
                        contentType: `image/${res.thumbnail_path.split('\\').pop().split('.').pop()}`,
                    })
                if (err) {
                    console.log(chalk.redBright('⛔ ' + err.message));
                    exit(1)
                }
                image = data.path
            }
            
            const {error} = await supabase.from("notes").insert([
                {
                    author: session.id,
                    title: answers.title,
                    note: answers.note,
                    thumbnail: image? image : null,
                }
            ])
            if (error) {
                console.log(chalk.redBright('⛔ ' + error.message));
                exit(1)
            }
            else {
                console.log(chalk.greenBright("✅ Note added successfully!"))
            }
        });
    });

export const note_list = program.command("note-list")
    .description("List all notes")
    .action(async() => {
        if (!session) {
            console.log(chalk.yellowBright("⚠️ You are not logged in! Login first..."))
            exit(1)
        }

        const {data, error} = await supabase.from("notes").select("*").eq("author", session.id)
        if (error) {
            console.log(chalk.redBright('⛔ ' + error.message));
            exit(1)
        }
        else {
            console.log(chalk.greenBright("✅ Your notes:"))
            const rows = []
            data.forEach(todo => {
                rows.push({Title: todo.title})
            })
            console.table(rows)
        }
    });

export const note_view = program.command("note-view")
    .description("View a note")
    .action(async() => {
        if (!session) {
            console.log(chalk.yellowBright("⚠️ You are not logged in! Login first..."))
            exit(1)
        }

        const {data, error} = await supabase.from("notes").select("*").eq("author", session.id)
        if (error) {
            console.log(chalk.redBright('⛔ ' + error.message));
            exit(1) 
        }
        else {
            const notes = []
            data.forEach(note => {
                notes.push({name: note.title, value: note.id})
            })
            inquirer.prompt([
                {
                    type: "list",
                    name: "note",
                    message: "Select a note: ",
                    choices: notes,
                },
            ]).then(async(answers) => {
                const {data: note, error} = await supabase.from("notes").select("*").eq("id", answers.note)
                if (error) {
                    console.log(chalk.redBright('⛔ ' + error.message));
                    exit(1)
                }
                else {
                    console.log(chalk.greenBright("✅ Your note:"))
                    const { data: image, error } = await supabase.storage.from('thumbnails').download(note[0].thumbnail)
                    if (error) {
                        console.log(chalk.redBright('⛔ ' + error.message));
                        exit(1)
                    }
                    if (image) {
                        const imageBuffer = Buffer.from(await image.arrayBuffer())
                        console.log(await terminalImage.buffer(imageBuffer, {width: "50%", height: "50%", preserveAspectRatio: true}))
                    }

                    const rainbow = chalkAnimation.rainbow(note[0].title);
                    setTimeout(() => {
                        rainbow.start();
                    }, 0);

                    setTimeout(() => {
                        rainbow.stop();
                        console.log(chalk.bold.cyanBright(note[0].note + "\n"))
                    }, 2000);
                }
            })
        }
    });

export const note_delete = program.command("note-delete")
    .description("Delete a note")
    .action(async() => {
        if (!session) {
            console.log(chalk.yellowBright("⚠️ You are not logged in! Login first..."))
            exit(1)
        }

        const {data, error} = await supabase.from("notes").select("*").eq("author", session.id)
        if (error) {
            console.log(chalk.redBright('⛔ ' + error.message));
            exit(1)
        }
        else {
            const notes = []
            data.forEach(note => {
                notes.push({name: note.title, value: note.id})
            })
            inquirer.prompt([
                {
                    type: "list",
                    name: "note",
                    message: "Select a note: ",
                    choices: notes,
                },
            ]).then(async(answers) => {
                const {error} = await supabase.from("notes").delete().eq("id", answers.note)
                if (error) {
                    console.log(chalk.redBright('⛔ ' + error.message));
                    exit(1)
                }
                else {
                    console.log(chalk.greenBright("✅ Note deleted successfully!"))
                }
            });
        }
    });
