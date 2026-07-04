import type { Preview } from "@storybook/react-vite";
import { themes } from "storybook/theming";

import { Providers } from "../src/app/providers";
import stylesUrl from "../src/app/styles.css?url";
import docsStylesUrl from "./docs.css?url";

for (const href of [stylesUrl, docsStylesUrl]) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

document.documentElement.classList.add("bg-slate-50");
document.body.classList.add("min-h-screen", "bg-slate-50", "text-slate-900");

const preview: Preview = {
  tags: ["autodocs"],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
      theme: themes.dark,
    },
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <Providers>
        <Story />
      </Providers>
    ),
  ],
};

export default preview;
