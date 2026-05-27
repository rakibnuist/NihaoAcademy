import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

async function main() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const runtimePath = path.join(__dirname, '../node_modules/hostinger-api-mcp/src/core/runtime.js');
  let runtimeContent = fs.readFileSync(runtimePath, 'utf8');

  // Replace classes with export
  runtimeContent = runtimeContent.replace('class MCPServer {', 'export class MCPServer {');
  runtimeContent = runtimeContent.replace('class OAuthProvider {', 'export class OAuthProvider {');

  const exportedRuntimePath = path.join(__dirname, '../node_modules/hostinger-api-mcp/src/core/runtime_exported.js');
  fs.writeFileSync(exportedRuntimePath, runtimeContent, 'utf8');

  // Dynamically import MCPServer and tools
  const { MCPServer } = await import('../node_modules/hostinger-api-mcp/src/core/runtime_exported.js');
  const hostingToolsModule = await import('../node_modules/hostinger-api-mcp/src/core/tools/hosting.js');
  const hostingTools = hostingToolsModule.default;

  // Ensure Hostinger API Token is present in environment variables
  if (!process.env.HOSTINGER_API_TOKEN) {
    console.error('❌ Error: HOSTINGER_API_TOKEN environment variable is required.');
    console.error('Please run with: HOSTINGER_API_TOKEN=your_token node scripts/get_logs.js [buildUuid]');
    process.exit(1);
  }

  const buildUuid = process.argv[2] || '019e6a7e-f520-7156-a33a-5fb73d639e1c';

  const server = new MCPServer({
    name: 'hostinger-hosting-mcp',
    version: '0.2.2',
    tools: hostingTools
  });

  const tool = hostingTools.find(t => t.name === 'hosting_showJsDeploymentLogs');
  if (!tool) {
    console.error('hosting_showJsDeploymentLogs tool not found!');
    process.exit(1);
  }

  try {
    const result = await server.executeCustomTool(tool, {
      domain: 'nihao.eduexpress.info',
      buildUuid: buildUuid,
      fromLine: 0
    });
    console.log('--- DEPLOYMENT LOGS ---');
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error fetching logs:', err);
    process.exit(1);
  }
}

main();
