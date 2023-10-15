const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.use(bodyParser.json());

app.listen(9000, () => {
  console.log(`Server listening at port ${9000}`);
})

const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");

const MODEL_NAME = "models/chat-bison-001";
const API_KEY = "AIzaSyBxPgBpU13_rcPGlvRk1i9jory0e3Ph5fo";

const client = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

app.post('/bot', async (req, res) => {
  console.log('testing..');
  try {
    const { query } = req.body
    const result = await client.generateMessage({
      model: MODEL_NAME, // Required. The model to use to generate the result.
      temperature: 0.5, // Optional. Value `0.0` always uses the highest-probability result.
      candidateCount: 1, // Optional. The number of candidate results to generate.
      prompt: {
        // optional, preamble context to prime responses
        context: "Respond to all questions with a rhyming poem.",
        // Optional. Examples for further fine-tuning of responses.
        examples: [
          {
            input: { content: "What is the capital of California?" },
            output: {
              content:
                `If the capital of California is what you seek,
      Sacramento is where you ought to peek.`,
            },
          },
        ],
        // Required. Alternating prompt/response messages.
        messages: [{ content: `${query}` }],
      },
    });

    const response = result[0].candidates[0].content

    console.log(response);

    return res.status(400).json({
      status: 'success',
      reply: response,
    })
  }
  catch (error) {
    console.log(error);
  }

})