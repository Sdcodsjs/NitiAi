import { execSync } from "child_process";

// Simple utility script to clear GitHub deployment history for the repository
async function clearDeployments() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error("❌ ERROR: GITHUB_TOKEN environment variable is required.");
    console.log("\nTo create one:");
    console.log("1. Go to https://github.com/settings/tokens");
    console.log("2. Generate a token (classic) with 'repo' scope.");
    console.log("3. Run this script like: $env:GITHUB_TOKEN=\"your_token\"; node artifacts/clear-github-deployments.js\n");
    process.exit(1);
  }

  // Get owner and repo from git remote url
  let remoteUrl = "";
  try {
    remoteUrl = execSync("git remote get-url origin").toString().trim();
  } catch (err) {
    console.error("❌ Could not determine Git remote URL. Make sure you run this in a git repository.", err);
    process.exit(1);
  }

  // Extract owner and repo from e.g., "https://github.com/Sdcodsjs/NitiAi.git" or "git@github.com:Sdcodsjs/NitiAi.git"
  const match = remoteUrl.match(/github\.com[/:]([^/]+)\/([^.]+)/);
  if (!match) {
    console.error(`❌ Could not parse remote URL: ${remoteUrl}`);
    process.exit(1);
  }

  const [_, owner, repo] = match;
  console.log(`🔍 Repository detected: ${owner}/${repo}`);

  const headers = {
    Authorization: `token ${token}`,
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "NitiAI-Deploy-Cleaner",
  };

  try {
    // 1. Fetch deployments
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/deployments`, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch deployments: ${response.statusText}`);
    }

    const deployments = await response.json();
    if (deployments.length === 0) {
      console.log("✨ No deployments found in this repository. History is already clear!");
      return;
    }

    console.log(`🧹 Found ${deployments.length} deployments. Cleaning up...`);

    for (const dep of deployments) {
      const id = dep.id;
      console.log(`\n⚙️ Processing deployment #${id} (${dep.environment || "unknown"})...`);

      // 2. Mark deployment as inactive (required before deletion)
      try {
        const statusResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/deployments/${id}/statuses`, {
          method: "POST",
          headers,
          body: JSON.stringify({ state: "inactive" }),
        });
        if (statusResp.ok) {
          console.log(`   ✅ Marked as inactive.`);
        } else {
          console.warn(`   ⚠️ Warning setting inactive status: ${statusResp.statusText}`);
        }
      } catch (e) {
        console.warn(`   ⚠️ Failed to set status: ${e.message}`);
      }

      // 3. Delete deployment
      const deleteResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/deployments/${id}`, {
        method: "DELETE",
        headers,
      });

      if (deleteResp.status === 204) {
        console.log(`   🗑️ Successfully deleted deployment #${id}!`);
      } else {
        console.error(`   ❌ Failed to delete deployment #${id}: ${deleteResp.statusText}`);
      }
    }

    console.log("\n🎉 GitHub deployment history has been successfully cleared!");
  } catch (error) {
    console.error("❌ An error occurred during cleanup:", error.message);
  }
}

clearDeployments();
