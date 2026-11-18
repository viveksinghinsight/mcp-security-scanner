# Dependency Security

Dependency Security is a Copilot agent for auditing dependency vulnerabilities across common software ecosystems. It detects project manifests automatically, runs the available native audit tooling, explains the evidence and coverage, and recommends verified remediation steps.

The agent is audit-first: it does not change manifests, lockfiles, or dependency versions unless you explicitly approve a proposed change.

## Requirements

- [Visual Studio Code](https://code.visualstudio.com/)
- GitHub Copilot Chat with agent/prompt support
- Node.js 16 or newer

## Installation

### Install into the current repository

Run this command from the repository that you want to scan:

```bash
npx github:viveksinghinsight/mcp-security-scanner
```

This installs:

- `.github/agents/dependency-security.agent.md`
- `.github/agents/dependency-security-assets/report-template.html`

Reload VS Code after installation, then open Copilot Chat and select **Dependency Security**.

### Install for your VS Code user profile

To make the agent available across repositories:

```bash
npx github:viveksinghinsight/mcp-security-scanner --user
```

The user installation places the agent in the VS Code user prompts directory and copies the HTML report template next to it.

### Overwrite an existing installation

The installer will not overwrite an existing agent by default. To update an installation:

```bash
npx github:viveksinghinsight/mcp-security-scanner --force
```

Combine `--user` and `--force` when updating a user-profile installation:

```bash
npx github:viveksinghinsight/mcp-security-scanner --user --force
```

## Using the agent

1. Open the repository you want to audit in VS Code.
2. Open Copilot Chat.
3. Select **Dependency Security**.
4. Ask it to audit the repository, for example:

   ```text
   Audit this repository for dependency vulnerabilities.
   ```

The agent detects manifests and lockfiles automatically. You can also narrow the request:

```text
Audit the production and development dependencies in this repository.
```

```text
Review the findings and propose the smallest safe remediation plan. Do not change files.
```

Dependency changes require explicit approval. After approval, the agent makes targeted changes, regenerates affected lockfiles using the repository's package manager, and reruns the relevant audits.

## Supported ecosystems

The agent routes audits based on the manifests and lockfiles it finds, including:

- npm, pnpm, and Yarn
- .NET / NuGet
- Java Maven and Gradle
- Python
- Go
- Rust
- Ruby
- PHP
- Other formats supported by an existing repository scanner or an approved equivalent

The exact scanner depends on the ecosystem and the tools already available in the repository environment. Missing scanners, unresolved dependencies, stale advisory feeds, private registries, and unsupported project formats are reported as coverage limitations rather than treated as clean results.

## HTML security report

After presenting the audit in chat, the agent generates a local HTML report at:

```text
.security-reports/<UTC-timestamp>-report.html
```

The report includes:

- Repository scope, scan time, and audit status
- Coverage details and security-risk distribution
- Sortable and filterable findings
- Severity and remediation summary cards
- Dependency path and exposure evidence when available
- Finding details in an accessible modal
- Remediation plan and remaining-risk sections

The report uses a Black Duck-inspired dependency dashboard layout and is self-contained, so it can be opened locally without a web server. The bundled source template is [assets/report-template.html](assets/report-template.html). Do not edit the installed/generated report to change future reports; update the bundled template instead.

## Safety and privacy

- Audits are read-only by default.
- The agent does not run automatic fix commands.
- It does not delete lockfiles, change registries, disable checks, or install global tools.
- Scanner and advisory output is treated as untrusted data.
- Generated HTML values are escaped before insertion into the report.
- Dependency metadata may be sent to the configured package registry or advisory service when a scanner requires it. Review your repository and organization policies before using external advisory services.
- No scanner provides complete coverage of every vulnerability, malicious package, or application exploit.

## Installer options

```text
Usage: npx github:viveksinghinsight/mcp-security-scanner [options]

Installs the Dependency Security Copilot agent.

Options:
  --user    Install into the VS Code user prompts folder instead of ./.github/agents
  --force   Overwrite an existing agent file
  -h, --help
```

## Troubleshooting

### The agent does not appear in Copilot Chat

1. Confirm that the installation completed without errors.
2. Reload the VS Code window.
3. Check that `dependency-security.agent.md` exists in either `.github/agents` or the VS Code user prompts directory.
4. Confirm that GitHub Copilot Chat and agent/prompt support are enabled.

### The report was not generated

The chat audit remains the source of truth if report generation fails. Check that:

- The repository is writable.
- The `.security-reports` directory can be created.
- The installed `dependency-security-assets/report-template.html` file exists.

The agent should report the specific generation or opening error instead of presenting a successful report path.

### A scanner is unavailable

Install or enable the repository-approved scanner for the detected ecosystem, then rerun the audit. Do not install tools or restore dependencies solely to make a scan appear clean without reviewing the command and its side effects.

## Development

The package is intentionally small. The installer entry point is [bin/install.js](bin/install.js), the Copilot agent definition is [dependency-security.agent.md](dependency-security.agent.md), and the report template is [assets/report-template.html](assets/report-template.html).

To inspect installer usage locally:

```bash
node bin/install.js --help
```

