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

  let pro = info.data.metric_alert.projects;

  console.log(pro);

  let project;

  // try {
  if (pro == "javascript-react") {
    project = "Streetrates Client";
  }

  if (pro == "javascript-react-jy") {
    project = "Streetrates Admin";
  }

  if (pro == "python-fastapi") {
    project = "Streetrates API";
  }

  // Slack message format
  const slackMessage = {
    channel: "#general",
    // pretext: `${info.data.description_title}`,
    username: "Streetrates",
    color: info.action == "critical" ? "#FF0000" : "#00FF00",
    text:
      info.project == "python-fastapi"
        ? `Slow Query Request on ${project}: The request to the API excceded 5 secs. Visit <${info.data.web_url}|Dashboard> to see full details.`
        : `Slow Page Load on ${project}: The request to load page excceded 4 secs. Visit <${info.data.web_url}|Dashboard> to see full details.`,
    attachments: [
      {
        fields: [
          {
            title: "Level",
            value: info.action,
            short: true,
          },
          {
            title: "Message",
            value: info.data.metric_alert.title,
            short: true,
          },
          {
            title: "Date",
            value: new Date(info.data.metric_alert.date_created).toLocaleString(
              "en-us",
              {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              }
            ),
            short: true,
          },
          {
            title: "See More",
            value: `<${info.data.web_url}|Go to Dashboard>`,
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
