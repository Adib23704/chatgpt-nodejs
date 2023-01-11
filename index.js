import { Configuration, OpenAIApi } from "openai";
import prompts from "prompts";
import dotenv from "dotenv";
import chalk from "chalk";
import ora from "ora";
dotenv.config();

const load = ora();
const configuration = new Configuration({
    apiKey: process.env.APIKEY,
    organization: process.env.ORG
});
const openai = new OpenAIApi(configuration);

async function main() {
    console.clear();
    const response = await prompts({
        type: 'text',
        name: 'input',
        message: 'Ask me anything!'
    });
    console.clear();
    load.start('Thinking...');
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: response.input,
        max_tokens: 1000
    });
    load.stop();
    console.clear();
    console.log(completion.data.choices[0].text);
    askAgain();
}

async function askAgain() {
    const response = await prompts({
        type: 'toggle',
        name: 'input',
        message: 'Do you want to ask again?',
        initial: true,
        active: 'yes',
        inactive: 'no'
    });
    if(response.input) {
        main();
    }
    else {
        console.clear();
        console.log(chalk.green("Bye bye... Have a nice day!"));
        process.exit(0);
    }
}

main();