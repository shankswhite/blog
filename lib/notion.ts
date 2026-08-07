import { Client } from "@notionhq/client";
import {
  BlockObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const databaseId = process.env.NOTION_DATABASE_ID;
const configuredDataSourceId = process.env.NOTION_DATA_SOURCE_ID;

export interface NotionBlog {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  image?: string;
  tags: string[];
  published: boolean;
}

// Fetch all published blogs from Notion database
export async function getNotionBlogs(): Promise<NotionBlog[]> {
  if (!process.env.NOTION_API_KEY || (!databaseId && !configuredDataSourceId)) {
    return [];
  }

  try {
    const dataSourceId = await resolveDataSourceId();
    if (!dataSourceId) return [];

    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        property: "Published",
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    });

    const blogs = response.results
      .filter((result): result is PageObjectResponse => result.object === "page")
      .map((pageObj) => {
      const properties = pageObj.properties;

      // Extract properties with type safety
      const title =
        properties.Title?.type === "title"
          ? properties.Title.title[0]?.plain_text || "Untitled"
          : "Untitled";

      const slug =
        properties.Slug?.type === "rich_text"
          ? properties.Slug.rich_text[0]?.plain_text || pageObj.id
          : pageObj.id;

      const description =
        properties.Description?.type === "rich_text"
          ? properties.Description.rich_text[0]?.plain_text || ""
          : "";

      const date =
        properties.Date?.type === "date"
          ? properties.Date.date?.start || new Date().toISOString()
          : new Date().toISOString();

      const image =
        properties.Image?.type === "url" ? properties.Image.url || undefined : undefined;

      const tags =
        properties.Tags?.type === "multi_select"
          ? properties.Tags.multi_select.map((tag) => tag.name)
          : [];

      const published =
        properties.Published?.type === "checkbox"
          ? properties.Published.checkbox
          : false;

      return {
        id: pageObj.id,
        slug,
        title,
        description,
        date,
        image,
        tags,
        published,
      };
      });

    return blogs;
  } catch (error) {
    console.error("Error fetching Notion blogs:", error);
    return [];
  }
}

async function resolveDataSourceId(): Promise<string | null> {
  if (configuredDataSourceId) return configuredDataSourceId;
  if (!databaseId) return null;

  const database = await notion.databases.retrieve({ database_id: databaseId });
  if ("data_sources" in database) {
    return database.data_sources[0]?.id || null;
  }

  return null;
}

// Fetch a single blog page content
export async function getNotionBlogContent(pageId: string): Promise<string> {
  try {
    const blocks = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
    });

    const content = await blocksToMarkdown(blocks.results as BlockObjectResponse[]);
    return content;
  } catch (error) {
    console.error("Error fetching Notion blog content:", error);
    return "";
  }
}

// Convert Notion blocks to Markdown
async function blocksToMarkdown(blocks: BlockObjectResponse[]): Promise<string> {
  const lines: string[] = [];

  for (const block of blocks) {
    const line = await blockToMarkdown(block);
    if (line) {
      lines.push(line);
    }
  }

  return lines.join("\n\n");
}

async function blockToMarkdown(block: BlockObjectResponse): Promise<string> {
  const type = block.type;

  switch (type) {
    case "paragraph": {
      const text = richTextToPlain(block.paragraph.rich_text);
      return text || "";
    }

    case "heading_1": {
      const text = richTextToPlain(block.heading_1.rich_text);
      return `# ${text}`;
    }

    case "heading_2": {
      const text = richTextToPlain(block.heading_2.rich_text);
      return `## ${text}`;
    }

    case "heading_3": {
      const text = richTextToPlain(block.heading_3.rich_text);
      return `### ${text}`;
    }

    case "bulleted_list_item": {
      const text = richTextToPlain(block.bulleted_list_item.rich_text);
      return `- ${text}`;
    }

    case "numbered_list_item": {
      const text = richTextToPlain(block.numbered_list_item.rich_text);
      return `1. ${text}`;
    }

    case "code": {
      const text = richTextToPlain(block.code.rich_text);
      const lang = block.code.language || "";
      return `\`\`\`${lang}\n${text}\n\`\`\``;
    }

    case "quote": {
      const text = richTextToPlain(block.quote.rich_text);
      return `> ${text}`;
    }

    case "divider": {
      return "---";
    }

    case "image": {
      const imageBlock = block.image;
      const url =
        imageBlock.type === "external"
          ? imageBlock.external.url
          : imageBlock.type === "file"
          ? imageBlock.file.url
          : "";
      const caption = richTextToPlain(imageBlock.caption);
      return `![${caption || "image"}](${url})`;
    }

    case "callout": {
      const text = richTextToPlain(block.callout.rich_text);
      const icon =
        block.callout.icon?.type === "emoji" ? block.callout.icon.emoji : "💡";
      return `> ${icon} ${text}`;
    }

    case "toggle": {
      const text = richTextToPlain(block.toggle.rich_text);
      return `<details>\n<summary>${text}</summary>\n</details>`;
    }

    default:
      return "";
  }
}

function richTextToPlain(richText: any[]): string {
  if (!richText || !Array.isArray(richText)) return "";

  return richText
    .map((text) => {
      let content = text.plain_text || "";

      // Apply formatting
      if (text.annotations?.bold) {
        content = `**${content}**`;
      }
      if (text.annotations?.italic) {
        content = `*${content}*`;
      }
      if (text.annotations?.code) {
        content = `\`${content}\``;
      }
      if (text.annotations?.strikethrough) {
        content = `~~${content}~~`;
      }

      // Handle links
      if (text.href) {
        content = `[${content}](${text.href})`;
      }

      return content;
    })
    .join("");
}

// Get blog by slug
export async function getNotionBlogBySlug(
  slug: string
): Promise<{ blog: NotionBlog; content: string } | null> {
  const blogs = await getNotionBlogs();
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    return null;
  }

  const content = await getNotionBlogContent(blog.id);

  return { blog, content };
}
