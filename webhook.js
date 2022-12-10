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

  let type = Object.keys(info.data)[0];

  // console.log(info);
  let pro;
  // let pro =
  //   type == "error"
  //     ? info.data.error.project
  //     : info.data.metric_alert.projects[0];

  if (type == "error") {
    pro = info.data.error.project;
  }

  if (type == "metric_alert") {
    pro = info.data.metric_alert.projects[0];
  }

  if (type == "metric_alert") {
    pro = info.data.event.project;
  }

  let project;

  // try {
  if (pro == "javascript-react" || pro == 4504278718152704) {
    project = "Streetrates Client";
  }

  if (pro == "javascript-react-jy" || pro == 4504279901863936) {
    project = "Streetrates Admin";
  }

  if (pro == "python-fastapi" || pro == 4504278710943744) {
    project = "Streetrates API";
  }

  let slackMessage;

  // Slack message format
  if (type == "metric_alert") {
    slackMessage = {
      channel: "#general",
      // pretext: `${info.data.description_title}`,
      username: "Streetrates",
      color: info.action == "critical" ? "#ff0000" : "#00ff00",
      text:
        pro == "python-fastapi"
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
              value: new Date(
                info.data.metric_alert.date_created
              ).toLocaleString("en-us", {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              }),
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
  }

  if (type == "error") {
    slackMessage = {
      channel: "#hello",
      // pretext: `${info.data.description_title}`,
      username: "Streetrates",
      color: info.data.error.level == "error" ? "#ff0000" : "#00ff00",
      text: `An Error occured on ${project} . Visit <${info.data.error.web_url}|Dashboard> to see full details.`,
      attachments: [
        {
          fields: [
            {
              title: "Level",
              value: info.data.error.level,
              short: true,
            },
            {
              title: "URL",
              value: info.data.error.culprit,
              short: true,
            },
            {
              title: "Error Message",
              value: info.data.error.title,
              short: true,
            },
            {
              title: "Location",
              value: info.data.error.location,
              short: true,
            },
            {
              title: "Date",
              value: new Date(info.data.error.date_created).toLocaleString(
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
              value: `<${info.data.error.web_url}|Go to Dashboard>`,
              short: true,
            },
          ],
        },
      ],
    };
  }
  if (type == "event") {
    slackMessage = {
      channel: "#general",
      // pretext: `${info.data.description_title}`,
      username: "Streetrates",
      color: info.data.event.level == "error" ? "#ff0000" : "#00ff00",
      text: `An Error occured on ${project} . Visit <${info.data.event.web_url}|Dashboard> to see full details.`,
      attachments: [
        {
          fields: [
            {
              title: "Level",
              value: info.data.event.level,
              short: true,
            },
            {
              title: "URL",
              value: info.data.event.culprit,
              short: true,
            },
            {
              title: "Error Message",
              value: info.data.event.title,
              short: true,
            },
            {
              title: "Location",
              value: info.data.event.location,
              short: true,
            },
            {
              title: "Date",
              value: new Date(info.data.event.date_created).toLocaleString(
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
              value: `<${info.data.event.web_url}|Go to Dashboard>`,
              short: true,
            },
          ],
        },
      ],
    };
  }

  axios
    .post(SLACK_WEBHOOK_URL, slackMessage)
    .then(() => {
      console.log(
        new Date().toLocaleString("en-us", {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        }),
        project
      );
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
