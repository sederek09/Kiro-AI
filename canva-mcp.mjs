import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from "axios";

const CANVA_ACCESS_TOKEN = process.env.CANVA_TOKEN;

if (!CANVA_ACCESS_TOKEN) {
  console.error("CANVA_TOKEN missing in env");
  process.exit(1);
}

const server = new McpServer({
  name: "canva-kiro-stdio",
  version: "1.0.0",
});

server.tool(
  "create_canva_design",
  "Membuat file desain baru di Canva",
  {
    title: z.string().describe("Judul file desain"),
    width: z.number().describe("Lebar dalam pixel"),
    height: z.number().describe("Tinggi dalam pixel"),
  },
  async ({ title, width, height }) => {
    try {
      const response = await axios.post(
        'https://api.canva.com/rest/v1/designs',
        { title, asset_type: "design", design_type: "custom", width, height },
        { headers: { Authorization: `Bearer ${CANVA_ACCESS_TOKEN}` } }
      );
      return { content: [{ type: "text", text: `Desain Canva berhasil dibuat! Silakan buka link ini untuk mengedit: ${response.data.urls.edit_url}` }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Gagal: ${error.response?.data?.message || error.message}` }], isError: true };
    }
  }
);

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

run().catch(console.error);
