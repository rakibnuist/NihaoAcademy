import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

async function main() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const { MCPServer } = await import('../node_modules/hostinger-api-mcp/src/core/runtime_exported.js');
  const hostingToolsModule = await import('../node_modules/hostinger-api-mcp/src/core/tools/hosting.js');
  const hostingTools = hostingToolsModule.default;

  // Ensure Hostinger API Token is present in environment variables
  if (!process.env.HOSTINGER_API_TOKEN) {
    console.error('❌ Error: HOSTINGER_API_TOKEN environment variable is required.');
    console.error('Please run with: HOSTINGER_API_TOKEN=your_token node scripts/check_status.js');
    process.exit(1);
  }

  const server = new MCPServer({
    name: 'hostinger-hosting-mcp',
    version: '0.2.2',
    tools: hostingTools
  });

  const tool = hostingTools.find(t => t.name === 'hosting_listJsDeployments');
  if (!tool) {
    console.error('hosting_listJsDeployments tool not found!');
    process.exit(1);
  }

  try {
    const result = await server.executeCustomTool(tool, {
      domain: 'nihao.eduexpress.info'
    });
    
    if (result && result.deployments && result.deployments.data && result.deployments.data.length > 0) {
      const latest = result.deployments.data[0];
      console.log('--- Most Recent Deployment Status ---');
      console.log(`UUID: ${latest.uuid}`);
      console.log(`State: ${latest.state}`);
      console.log(`Created: ${latest.created_at}`);
      console.log(`Updated: ${latest.updated_at}`);
      console.log(`App Type: ${latest.options.app_type}`);
      console.log(`Build Script: ${latest.options.build_script}`);
      if (latest.state === 'failed') {
        console.log(`Failed with details. Check logs with hosting_showJsDeploymentLogs.`);
      }
    } else {
      console.log('No deployments found.');
    }
    process.exit(0);
  } catch (err) {
    console.error('Error fetching deployments:', err);
    process.exit(1);
  }
}

main();
