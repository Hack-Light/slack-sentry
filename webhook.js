const express = require("express");
const cors = require("cors");
const { IncomingWebhook } = require("@slack/webhook");

const SLACK_WEBHOOK_URL =
  "https://hooks.slack.com/services/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";

const slackWebhook = new IncomingWebhook(SLACK_WEBHOOK_URL);

const app = express();

// Parse incoming request bodies in a middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Set up route for webhook
app.post("/webhook", async (req, res) => {
  // Process webhook data here

  let info = req.body;

  console.log(info);

  let project;

  try {
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
      text:
        info.project == "python-fastapi"
          ? `Slow Query Request on ${project}: The request to ${info.event.request.url} excceded 5 secs. Visit ${info.url} to see full info.`
          : `Slow Page Load on ${project}: The request to ${info.event.request.url} excceded 4 secs. Visit ${info.url} to see full info.`,
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

    await slackWebhook.send(slackMessage);
    return true;
  } catch (error) {
    console.log(error);
  }

  // Return a response
  //   res.json({ message: "Webhook received" });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Webhook listening on port ${port}`);
});
