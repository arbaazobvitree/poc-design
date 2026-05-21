import { defineConfig } from "tinacms";

export default defineConfig({
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  media: {
    loadCustomStore: async () => {
      const pack = await import("next-tinacms-cloudinary");
      return pack.TinaCloudCloudinaryMediaStore;
    },
  },

  schema: {
    collections: [
      {
        name: "project",
        label: "Projects",
        path: "content/projects",
        format: "mdx",
        ui: {
          router: ({ document }) => `/portfolio/${document._sys.filename}`,
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Project Name",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "location",
            label: "Location",
          },
          {
            type: "string",
            name: "year",
            label: "Year",
          },
          {
            type: "string",
            name: "category",
            label: "Category",
            options: [
              { value: "residential", label: "Residential" },
              { value: "commercial", label: "Commercial" },
            ],
          },
          {
            type: "image",
            name: "coverImage",
            label: "Cover Image",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Project Description",
            isBody: true,
          },
          {
            type: "object",
            name: "gallery",
            label: "Photo Gallery",
            list: true,
            fields: [
              { type: "image", name: "image", label: "Photo" },
              { type: "string", name: "caption", label: "Caption" },
            ],
          },
        ],
      },
    ],
  },
});
