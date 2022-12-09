const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const { IncomingWebhook } = require("@slack/webhook");
const request = require("request");
const { default: axios } = require("axios");

// https://hooks.slack.com/services/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

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

// const slackWebhook = new IncomingWebhook(SLACK_WEBHOOK_URL);

const app = express();

// Parse incoming request bodies in a middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cors());

// Set up route for webhook
app.post("/webhook", async (req, res) => {
  // Process webhook data here

  let info = req.body;

  console.log(info);

  let project;

  // try {
  if (info.project == "javascript-react") {
    project = "Streetrates Client";
  }

  if (info.project == "javascript-react-jy") {
    project = "Streetrates Admin";
  }

  if (info.project == "python-fastapi") {
    project = "Streetrates API";
  }

  // Slack message format
  const slackMessage = {
    channel: "#general",
    username: "Streetrates",
    text:
      info.project == "python-fastapi"
        ? `Slow Query Request on ${project}: The request to ${info.event.request.url} excceded 5 secs. Visit <${info.url}|Dashboard > to see full details.`
        : `Slow Page Load on ${project}: The request to ${info.event.request.url} excceded 4 secs. Visit <${info.url}|Dashboard> to see full info.`,
    attachments: [
      {
        fields: [
          {
            title: "Title",
            value: info.title,
            short: true,
          },
          {
            title: "Message",
            value: info.message,
            short: true,
          },
        ],
      },
    ],
  };

  axios
    .post(SLACK_WEBHOOK_URL, slackMessage)
    .then(() => {
      return res.json({ status: 200 });
    })
    .catch((err) => {
      console.error(err);
    });

  // await slackWebhook.send(slackMessage);

  // let result = await fetch(SLACK_WEBHOOK_URL, {
  //   method: "POST",
  //   body: JSON.stringify(slackMessage),
  //   //   headers: {
  //   //     "Content-Type": "application/json",
  //   //     Authorization: `Bearer ${SLACK_TOKEN_SECRET}`,
  //   //   },
  // });

  // var payload = { text: "This is via an integration from Me - It is a test" };

  // var headers = { "Content-type": "application/json" };

  // request.post(
  //   { url: SLACK_WEBHOOK_URL, payload: payload, headers: headers },
  //   function (err, res) {
  //     if (err) {
  //       console.log(err);
  //     }
  //     if (res) {
  //       console.log(res.body);
  //     }
  //   }
  // );

  // console.log(result);

  // return true;
  // } catch (error) {
  //   console.log(error);
  // }

  // Return a response
  //   res.json({ message: "Webhook received" });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Webhook listening on port ${port}`);
});
