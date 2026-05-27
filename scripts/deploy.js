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
  console.log('✅ Created runtime_exported.js');

  // Dynamically import MCPServer and tools
  const { MCPServer } = await import('../node_modules/hostinger-api-mcp/src/core/runtime_exported.js');
  const hostingToolsModule = await import('../node_modules/hostinger-api-mcp/src/core/tools/hosting.js');
  const hostingTools = hostingToolsModule.default;

  // 3. Ensure Hostinger API Token is present in environment variables
  if (!process.env.HOSTINGER_API_TOKEN) {
    console.error('❌ Error: HOSTINGER_API_TOKEN environment variable is required.');
    console.error('Please run with: HOSTINGER_API_TOKEN=your_token node scripts/deploy.js');
    process.exit(1);
  }
  process.env.DEBUG = 'true';

  // 4. Instantiate MCPServer
  const server = new MCPServer({
    name: 'hostinger-hosting-mcp',
    version: '0.2.2',
    tools: hostingTools
  });

  // 5. Find hosting_deployJsApplication tool
  const tool = hostingTools.find(t => t.name === 'hosting_deployJsApplication');
  if (!tool) {
    console.error('hosting_deployJsApplication tool not found!');
    process.exit(1);
  }

  // 6. Execute the tool!
  console.log('🚀 Triggering JS Application deployment to Hostinger...');
  const archiveAbsolutePath = path.resolve(__dirname, '../project.zip');

  try {
    const result = await server.executeCustomTool(tool, {
      domain: 'nihao.eduexpress.info',
      archivePath: archiveAbsolutePath,
      removeArchive: false
    });
    console.log('✅ Deployment triggered successfully! Result:', JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('❌ Deployment failed:', err);
    process.exit(1);
  }
}

main();
