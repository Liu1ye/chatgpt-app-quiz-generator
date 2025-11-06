import { baseURL } from "@/baseUrl";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const getAppsSdkCompatibleHtml = async (baseUrl: string, path: string) => {
  const result = await fetch(`${baseUrl}${path}`);
  return await result.text();
};

type ContentWidget = {
  id: string;
  title: string;
  templateUri: string;
  invoking: string;
  invoked: string;
  html: string;
  description: string;
  widgetDomain: string;
};

function widgetMeta(widget: ContentWidget) {
  return {
    "openai/outputTemplate": widget.templateUri,
    "openai/toolInvocation/invoking": widget.invoking,
    "openai/toolInvocation/invoked": widget.invoked,
    "openai/widgetAccessible": false,
    "openai/resultCanProduceWidget": true,
  } as const;
}

const handler = createMcpHandler(async (server) => {
  const html = await getAppsSdkCompatibleHtml(baseURL, "/");

  const quizGeneratorWidget: ContentWidget = {
    id: "quiz-generator",
    title: "Quiz Generator",
    templateUri: "ui://widget/quiz-generator-template.html",
    invoking: "Loading quiz...",
    invoked: "Quiz loaded",
    html: html,
    description: "Generates a quiz based on the user's input",
    widgetDomain: "https://nextjs.org/docs",
  };
  server.registerResource(
    "quiz-generator-widget",
    quizGeneratorWidget.templateUri,
    {
      title: quizGeneratorWidget.title,
      description: quizGeneratorWidget.description,
      mimeType: "text/html+skybridge",
      _meta: {
        "openai/widgetDescription": quizGeneratorWidget.description,
        "openai/widgetPrefersBorder": true,
      },
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/html+skybridge",
          text: `<html>${quizGeneratorWidget.html}</html>`,
          _meta: {
            "openai/widgetDescription": quizGeneratorWidget.description,
            "openai/widgetPrefersBorder": true,
            "openai/widgetDomain": quizGeneratorWidget.widgetDomain,
          },
        },
      ],
    })
  );

  server.registerTool(
    quizGeneratorWidget.id,
    {
      title: quizGeneratorWidget.title,
      description:
        "Fetch and display the homepage content with the name of the user",
      inputSchema: {
        name: z.string().describe("The name of the user to display on the homepage"),
      },
      _meta: widgetMeta(quizGeneratorWidget),
    },
    async ({ name }) => {
      return {
        content: [
          {
            type: "text",
            text: name,
          },
        ],
        structuredContent: {
          name: name,
          timestamp: new Date().toISOString(),
        },
        _meta: widgetMeta(quizGeneratorWidget),
      };
    }
  );
});

export const GET = handler;
export const POST = handler;
