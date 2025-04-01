// Test OpenAI API v2 - updated July 2024 with GPT-4o-mini
// (c) MikeRhodes.com.au

// Purpose: to quickly test your API KEY & OpenAI account if you have any issues with the Whisperer or PMax scripts



// Enter you OpenAI API Key here between the quotes (don't worry, I don't get to see your Key)
const API_KEY = ''

// You can change this prompt if you want - the idea here is that we want to ask a SIMPLE question to test the API
const PROMPT = "What's the tallest mountain in the world?"



// don't change the code below this line. pretty please. -------------------------------------------------------




function main() {
    try {

        let start = new Date();
        let model = "gpt-4o-mini"
        let output = generateTextOpenAI(PROMPT, API_KEY, model); // output

        Logger.log('Text output: ' + output);

        let end  = new Date();
        let dur = (end - start) / 1000;

        Logger.log('Time taken for script to run: ' + dur + ' seconds');

    } catch (error) {
        Logger.log('An error occurred: ' + error);
    }
}



function generateTextOpenAI(prompt, apiKey, model) {
    Logger.log('Generating report with OpenAI');
    let url = 'https://api.openai.com/v1/chat/completions';
    let messages = [
        { "role": "user", "content": prompt }
    ];
    let payload = {
        "model": model,
        "messages": messages
    };
    let httpOptions = {
        "method": "POST",
        "muteHttpExceptions": true,
        "contentType": "application/json",
        "headers": {
            "Authorization": 'Bearer ' + apiKey
        },
        'payload': JSON.stringify(payload)
    };
    let response = UrlFetchApp.fetch(url, httpOptions);
    let responseCode = response.getResponseCode();
    let responseContent = response.getContentText();

    let startTime = Date.now();
    while (response.getResponseCode() !== 200 && Date.now() - startTime < 30000) {
        Utilities.sleep(5000);
        response = UrlFetchApp.fetch(url, httpOptions);
        Logger.log('Time elapsed: ' + (Date.now() - startTime) / 1000 + ' seconds');
    }

    if (responseCode !== 200) {
        Logger.log(`Error: OpenAI API request failed with status ${responseCode}.`);
        Logger.log(`Read more about error codes here: https://help.openai.com/en/articles/6891839-api-error-codes`)
        try {
            let errorResponse = JSON.parse(responseContent);
            Logger.log(`Error details: ${errorResponse.error}`);
            return `Error: ${errorResponse.error.message}`;
        } catch (e) {
            Logger.log('Error parsing OpenAI API error response.');
            return 'Error: Failed to parse the OpenAI API error response.';
        }
    }

    let responseJson = JSON.parse(response.getContentText());
    let choices = responseJson.choices;
    let text = choices[0].message.content;
    return (text);
}




// Thanks for trying out the script.

// To get updates about my scripts & training, drop me your email here:
// https://pmaxscript.ck.page/update


// PS you're awesome!