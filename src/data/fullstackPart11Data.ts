export interface McqOption {
  id: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
  explanationIfWrong?: string;
}

export interface McqQuestion {
  id?: string;
  question: string;
  options: McqOption[];
  correctAnswer: string;
  explanationNote: string;
}

export interface TheoryBlock {
  heading: string;
  text: string;
  codeSnippet?: string;
  terminalOutput?: string;
  tip?: string;
  warning?: string;
  sampleInput?: string;
  mcq?: McqQuestion;
  retestMcq?: McqQuestion;
  questionPool?: McqQuestion[];
}

export interface SectionContent {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  readTime: string;
  objectives: string[];
  theoryBlocks: TheoryBlock[];
}

export const FULLSTACK_PART_11_SECTIONS: SectionContent[] = [
  {
    id: "11-1-cicd-basics-workflows",
    number: "11.1",
    title: "Introduction to CI/CD & Workflows",
    subtitle: "Understand Continuous Integration principles, configure GitHub Actions workflows in YAML, and define automated triggers.",
    readTime: "12 min",
    objectives: [
      "Understand the motivation for Continuous Integration (CI) and Continuous Delivery (CD)",
      "Structure workflow configuration files in the .github/workflows directory",
      "Write YAML syntax for workflow names, triggers, jobs, and steps",
      "Configure triggers for git push, pull_request, and branch filters",
      "Select virtual runner environments like ubuntu-latest",
      "Inspect workflow runs and execution logs in GitHub's Actions tab"
    ],
    theoryBlocks: [
      {
        heading: "Continuous Integration & Delivery Concepts",
        text: "Continuous Integration (CI) automatically builds and tests every code commit to detect integration errors early before code is merged.",
        codeSnippet: `// Developer commits -> GitHub Actions automatically runs linter, tests & build.\n// If any step fails, merging is blocked!`,
        mcq: {
          id: "q-11.1-0-v1",
          question: "What is the primary goal of Continuous Integration (CI)?",
          options: [
            { id: "A", text: "To automate building and testing of every code commit to discover integration bugs as early as possible" },
            { id: "B", text: "To rewrite JavaScript code into C++" },
            { id: "C", text: "To replace software developers with AI bots" },
            { id: "D", text: "To store database backups in localStorage" }
          ],
          correctAnswer: "A",
          explanationNote: "CI automates linting, building, and testing whenever developers push code, ensuring broken code is caught immediately before merging."
        },
        retestMcq: {
          id: "q-11.1-0-v2",
          question: "How does Continuous Delivery (CD) differ from Continuous Integration (CI)?",
          options: [
            { id: "A", text: "CD automates releasing and deploying tested builds directly to staging or production environments" },
            { id: "B", text: "CD only runs on Windows computers" },
            { id: "C", text: "CD requires manual copy-pasting of files over FTP" },
            { id: "D", text: "CD deletes the git commit history" }
          ],
          correctAnswer: "A",
          explanationNote: "While CI focuses on automatically building and testing code, CD extends automation to releasing and deploying to production."
        }
      },
      {
        heading: "Workflow Files & Directory Structure",
        text: "GitHub Actions detects workflows stored as `.yml` or `.yaml` files inside the `.github/workflows/` directory in your repository root.",
        codeSnippet: `# .github/workflows/pipeline.yml\nname: Deployment Pipeline\non:\n  push:\n    branches:\n      - main\njobs:\n  simple_deployment_pipeline:\n    runs-on: ubuntu-latest`,
        mcq: {
          id: "q-11.1-1-v1",
          question: "Where must workflow configuration files be located for GitHub Actions to execute them?",
          options: [
            { id: "A", text: "In the `.github/workflows/` directory at the root of the repository" },
            { id: "B", text: "In the `src/workflows/` directory" },
            { id: "C", text: "Inside `node_modules`" },
            { id: "D", text: "In the root `package.json` file under `scripts`" }
          ],
          correctAnswer: "A",
          explanationNote: "GitHub Actions specifically watches `.github/workflows/*.yml` (or `.yaml`) files for workflow declarations."
        },
        retestMcq: {
          id: "q-11.1-1-v2",
          question: "Which file format is used to declare GitHub Actions workflow pipelines?",
          options: [
            { id: "A", text: "YAML (`.yml` or `.yaml`)" },
            { id: "B", text: "XML (`.xml`)" },
            { id: "C", text: "CSV (`.csv`)" },
            { id: "D", text: "HTML (`.html`)" }
          ],
          correctAnswer: "A",
          explanationNote: "GitHub Actions uses YAML (YAML Ain't Markup Language) for defining workflows, relying on whitespace indentation for hierarchy."
        }
      },
      {
        heading: "Workflow Triggers (on: push & pull_request)",
        text: "The `on` key specifies the events that trigger the workflow, such as pushes to specific branches or opening pull requests.",
        codeSnippet: `on:\n  push:\n    branches:\n      - main\n  pull_request:\n    branches: [main]\n    types: [opened, synchronize]`,
        mcq: {
          id: "q-11.1-2-v1",
          question: "What does `types: [opened, synchronize]` specify under a `pull_request` trigger?",
          options: [
            { id: "A", text: "The workflow runs when a pull request is first opened and whenever new commits are pushed to it" },
            { id: "B", text: "The workflow runs only when the pull request is closed" },
            { id: "C", text: "The workflow merges the pull request automatically without review" },
            { id: "D", text: "The workflow deletes the branch" }
          ],
          correctAnswer: "A",
          explanationNote: "`opened` triggers when the PR is created; `synchronize` triggers whenever new commits are added to the source branch of the PR."
        },
        retestMcq: {
          id: "q-11.1-2-v2",
          question: "How do you prevent a workflow from running on every commit to personal feature branches?",
          options: [
            { id: "A", text: "Specify branch filters under the trigger (e.g. `branches: [main]`)" },
            { id: "B", text: "Delete the `.git` folder" },
            { id: "C", text: "Commit without git commit messages" },
            { id: "D", text: "GitHub Actions cannot filter branches" }
          ],
          correctAnswer: "A",
          explanationNote: "Adding a `branches` filter restricts triggers to specified branches (e.g. `main`), preventing runs on arbitrary experimental branches."
        }
      },
      {
        heading: "Jobs and Runner Environments (runs-on)",
        text: "Workflows consist of one or more `jobs` that execute on a virtual runner environment specified by `runs-on` (such as `ubuntu-latest`).",
        codeSnippet: `jobs:\n  test_and_build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4`,
        mcq: {
          id: "q-11.1-3-v1",
          question: "What does `runs-on: ubuntu-latest` specify in a GitHub Actions job?",
          options: [
            { id: "A", text: "The operating system of the virtual machine hosted by GitHub where the job will execute" },
            { id: "B", text: "The target production database engine" },
            { id: "C", text: "The brand of laptop used by the developer" },
            { id: "D", text: "The browser engine for rendering CSS" }
          ],
          correctAnswer: "A",
          explanationNote: "`runs-on` selects the hosted virtual runner environment (e.g. Ubuntu Linux, Windows Server, or macOS) that runs the job's steps."
        },
        retestMcq: {
          id: "q-11.1-3-v2",
          question: "By default, do multiple jobs defined under `jobs:` in a single workflow run in parallel or sequentially?",
          options: [
            { id: "A", text: "In parallel simultaneously, unless a `needs:` dependency is specified" },
            { id: "B", text: "Always sequentially in alphabetical order" },
            { id: "C", text: "Only the first job executes; others are discarded" },
            { id: "D", text: "Randomly one at a time" }
          ],
          correctAnswer: "A",
          explanationNote: "Jobs execute in parallel by default for maximum speed; you can use `needs: [job_name]` to declare sequential dependencies."
        }
      },
      {
        heading: "The checkout Action (actions/checkout)",
        text: "The standard `actions/checkout` action clones your repository's code into the runner so subsequent build steps can access it.",
        codeSnippet: `steps:\n  - name: Check out repository code\n    uses: actions/checkout@v4`,
        mcq: {
          id: "q-11.1-4-v1",
          question: "Why is `actions/checkout` virtually always the very first step in a GitHub Actions job?",
          options: [
            { id: "A", text: "Virtual runners start as blank machines; `checkout` clones your repository code so the runner has access to project files" },
            { id: "B", text: "It verifies user credit card information" },
            { id: "C", text: "It compiles TypeScript into JavaScript" },
            { id: "D", text: "It checks out an Git commit as a zip download" }
          ],
          correctAnswer: "A",
          explanationNote: "Hosted runners start in an empty workspace directory. `actions/checkout` downloads your repository source code into the runner."
        },
        retestMcq: {
          id: "q-11.1-4-v2",
          question: "In GitHub Actions syntax, what is the difference between `uses:` and `run:` in a step?",
          options: [
            { id: "A", text: "`uses:` executes a pre-built reusable action from GitHub, while `run:` executes a shell command (e.g. bash)" },
            { id: "B", text: "`uses:` is for Windows only; `run:` is for Linux" },
            { id: "C", text: "`run:` can only execute Node.js files" },
            { id: "D", text: "There is no difference" }
          ],
          correctAnswer: "A",
          explanationNote: "`uses:` invokes community/official actions published in the GitHub Marketplace; `run:` executes arbitrary shell commands on the runner."
        }
      },
      {
        heading: "Inspecting Workflow Runs in GitHub UI",
        text: "GitHub's 'Actions' tab displays every workflow run, showing individual step status (green check or red cross) and live terminal logs.",
        codeSnippet: `// If npm test exits with code 1 -> Step fails with red ✕\n// Full terminal stdout and stderr are recorded in the step logs for debugging!`,
        mcq: {
          id: "q-11.1-5-v1",
          question: "How does GitHub Actions determine whether a step succeeded or failed?",
          options: [
            { id: "A", text: "By the process exit code: exit code 0 indicates success, while any non-zero exit code indicates failure" },
            { id: "B", text: "By counting the number of characters printed to the terminal" },
            { id: "C", text: "By checking if the word 'success' appears in the log" },
            { id: "D", text: "By measuring how long the step took in seconds" }
          ],
          correctAnswer: "A",
          explanationNote: "Standard Unix exit codes dictate step status: 0 means success; anything else (e.g. 1) triggers a step and job failure."
        },
        retestMcq: {
          id: "q-11.1-5-v2",
          question: "What happens to subsequent steps in a job when a step fails (exits non-zero)?",
          options: [
            { id: "A", text: "Subsequent steps are skipped by default, and the job is marked as failed" },
            { id: "B", text: "Subsequent steps run anyway" },
            { id: "C", text: "The entire GitHub repository is deleted" },
            { id: "D", text: "The runner restarts from step 1 in an infinite loop" }
          ],
          correctAnswer: "A",
          explanationNote: "By default, any failure terminates job progression and skips remaining steps, unless an `if: always()` condition is specified."
        }
      }
    ]
  },
  {
    id: "11-2-lint-build-test-ci",
    number: "11.2",
    title: "Building, Linting & Automated Testing in CI",
    subtitle: "Install dependencies, cache node_modules, run linters, execute unit tests, and verify production builds.",
    readTime: "12 min",
    objectives: [
      "Set up Node.js runtimes using actions/setup-node with node-version",
      "Accelerate workflow execution by caching npm dependencies with cache: 'npm'",
      "Run static linters (ESLint) and type checkers in CI pipelines",
      "Execute automated unit and integration test suites with Jest and Vitest",
      "Compile production frontend assets with npm run build",
      "Prevent broken pull requests from merging using branch protection rules"
    ],
    theoryBlocks: [
      {
        heading: "Setting Up Node.js (actions/setup-node)",
        text: "The `actions/setup-node` action installs the desired version of Node.js on the runner and configures the system PATH.",
        codeSnippet: `- name: Set up Node.js\n  uses: actions/setup-node@v4\n  with:\n    node-version: '20'\n    cache: 'npm'`,
        mcq: {
          id: "q-11.2-0-v1",
          question: "What is the purpose of `actions/setup-node` in a CI workflow?",
          options: [
            { id: "A", text: "It installs the specified Node.js version and npm on the virtual runner environment" },
            { id: "B", text: "It starts an Express server in the cloud" },
            { id: "C", text: "It minifies CSS files" },
            { id: "D", text: "It converts React components to HTML" }
          ],
          correctAnswer: "A",
          explanationNote: "`actions/setup-node` installs and configures the exact version of Node.js required for your application on the clean runner."
        },
        retestMcq: {
          id: "q-11.2-0-v2",
          question: "What does adding `cache: 'npm'` to `actions/setup-node` achieve?",
          options: [
            { id: "A", text: "It caches npm dependencies between workflow runs to speed up `npm install`" },
            { id: "B", text: "It clears all temporary browser files" },
            { id: "C", text: "It disables node_modules entirely" },
            { id: "D", text: "It saves git commits to a cache server" }
          ],
          correctAnswer: "A",
          explanationNote: "Dependency caching preserves downloaded packages across runs, significantly speeding up workflow build times."
        }
      },
      {
        heading: "Clean Dependency Installation (npm ci)",
        text: "In automated CI environments, `npm ci` is preferred over `npm install` because it strictly installs dependencies based on `package-lock.json`.",
        codeSnippet: `- name: Install dependencies\n  run: npm ci`,
        mcq: {
          id: "q-11.2-1-v1",
          question: "Why is `npm ci` preferred over `npm install` in automated CI pipelines?",
          options: [
            { id: "A", text: "It provides clean, deterministic installs matching `package-lock.json` exactly and never modifies lockfiles" },
            { id: "B", text: "Because `npm install` cannot run on Linux" },
            { id: "C", text: "Because `npm ci` installs packages without using the internet" },
            { id: "D", text: "Because `npm install` is deprecated" }
          ],
          correctAnswer: "A",
          explanationNote: "`npm ci` deletes existing `node_modules`, strictly respects `package-lock.json`, and errors if the lockfile is out of sync with `package.json`."
        },
        retestMcq: {
          id: "q-11.2-1-v2",
          question: "What happens if `package.json` and `package-lock.json` are out of sync when `npm ci` runs in CI?",
          options: [
            { id: "A", text: "`npm ci` exits with an error and fails the build immediately" },
            { id: "B", text: "It updates `package-lock.json` and commits to Git automatically" },
            { id: "C", text: "It ignores the error and proceeds" },
            { id: "D", text: "It deletes the repository" }
          ],
          correctAnswer: "A",
          explanationNote: "`npm ci` will never update your lockfile; if versions conflict, it fails the build, preventing unintended package upgrades in CI."
        }
      },
      {
        heading: "Automated Linting with ESLint",
        text: "Running `npm run eslint` catches syntax errors, code style violations, and bad practices before code review.",
        codeSnippet: `- name: Check code formatting & linting\n  run: npm run eslint`,
        mcq: {
          id: "q-11.2-2-v1",
          question: "What is the benefit of adding an ESLint step to your CI pipeline?",
          options: [
            { id: "A", text: "It enforces code standards and catches syntax and static errors before any testing or deployment occurs" },
            { id: "B", text: "It formats HTML files automatically" },
            { id: "C", text: "It generates documentation websites" },
            { id: "D", text: "It compresses the backend database" }
          ],
          correctAnswer: "A",
          explanationNote: "Running ESLint in CI guarantees that no code containing lint errors or unused variables can be merged into production branches."
        },
        retestMcq: {
          id: "q-11.2-2-v2",
          question: "If ESLint finds a rule violation configured as `'error'`, what exit code does it emit?",
          options: [
            { id: "A", text: "Exit code 1 (causing the GitHub Actions step to fail)" },
            { id: "B", text: "Exit code 0" },
            { id: "C", text: "HTTP 500" },
            { id: "D", text: "Exit code -1" }
          ],
          correctAnswer: "A",
          explanationNote: "Lint errors cause ESLint to exit with code 1, which immediately fails the workflow step in GitHub Actions."
        }
      },
      {
        heading: "Executing Automated Unit & Integration Tests",
        text: "Automated tests ensure that changes do not break existing business logic; the pipeline runs `npm test` and waits for all suites to pass.",
        codeSnippet: `- name: Run unit & integration tests\n  run: npm test`,
        mcq: {
          id: "q-11.2-3-v1",
          question: "Why must test runners like Jest be configured with `--watchAll=false` or `CI=true` in GitHub Actions?",
          options: [
            { id: "A", text: "Otherwise Jest enters interactive watch mode and hangs indefinitely waiting for keyboard input" },
            { id: "B", text: "Because Jest only works when watching files" },
            { id: "C", text: "To make tests run in reverse order" },
            { id: "D", text: "To encrypt the test results" }
          ],
          correctAnswer: "A",
          explanationNote: "In non-interactive CI environments, Jest must run tests once and exit. GitHub Actions sets `CI=true` by default, disabling watch mode."
        },
        retestMcq: {
          id: "q-11.2-3-v2",
          question: "If 1 test out of 50 fails during `npm test`, what is the outcome of the CI pipeline?",
          options: [
            { id: "A", text: "The test step fails, the pipeline halts, and the commit is marked with a red failure badge" },
            { id: "B", text: "The pipeline passes because 98% of tests passed" },
            { id: "C", text: "The failing test is deleted automatically" },
            { id: "D", text: "The code deploys with a warning" }
          ],
          correctAnswer: "A",
          explanationNote: "CI adheres to zero-tolerance quality gates: if even a single test fails, the step exits with code 1 and blocks deployment."
        }
      },
      {
        heading: "Verifying Production Builds (npm run build)",
        text: "Running `npm run build` verifies that transpilation, bundling, and asset compilation succeed with zero compiler or bundler errors.",
        codeSnippet: `- name: Build production bundle\n  run: npm run build`,
        mcq: {
          id: "q-11.2-4-v1",
          question: "Why should `npm run build` be included in the CI pipeline even if all unit tests pass?",
          options: [
            { id: "A", text: "It verifies that TypeScript compilation, JSX bundling, and asset optimization succeed without production build errors" },
            { id: "B", text: "To upload the files to Google Drive" },
            { id: "C", text: "Because unit tests only run after a build" },
            { id: "D", text: "It is required to generate the package.json file" }
          ],
          correctAnswer: "A",
          explanationNote: "Unit tests often test components in isolation. Building the production bundle ensures that bundler configurations, CSS imports, and TypeScript typing compile cleanly."
        },
        retestMcq: {
          id: "q-11.2-4-v2",
          question: "Where are the output files of `npm run build` placed by default in Vite and Webpack apps?",
          options: [
            { id: "A", text: "In a `dist` or `build` directory on the runner" },
            { id: "B", text: "In `node_modules`" },
            { id: "C", text: "In the browser's download folder" },
            { id: "D", text: "In `/etc/nginx`" }
          ],
          correctAnswer: "A",
          explanationNote: "Standard frontend bundlers output production-ready static assets (minified JS, CSS, HTML) to a `dist/` or `build/` directory."
        }
      },
      {
        heading: "Branch Protection Rules",
        text: "GitHub branch protection rules require passing CI status checks before pull requests can be merged into `main`.",
        codeSnippet: `// In GitHub Settings -> Branches -> Add branch protection rule:\n// Enable: "Require status checks to pass before merging"\n// Select: "Deployment Pipeline"`,
        mcq: {
          id: "q-11.2-5-v1",
          question: "What is the purpose of GitHub Branch Protection Rules?",
          options: [
            { id: "A", text: "To enforce that PRs cannot be merged into `main` until required CI status checks pass and reviews are approved" },
            { id: "B", text: "To encrypt the repository with a password" },
            { id: "C", text: "To limit git commits to 1 per day" },
            { id: "D", text: "To hide repository code from search engines" }
          ],
          correctAnswer: "A",
          explanationNote: "Branch protection guarantees that broken code cannot accidentally be merged into `main`, protecting production stability."
        },
        retestMcq: {
          id: "q-11.2-5-v2",
          question: "Who can override a required status check in a protected branch by default?",
          options: [
            { id: "A", text: "Repository administrators (unless 'Do not allow bypassing the above settings' is enabled)" },
            { id: "B", text: "Any contributor who opened a PR" },
            { id: "C", text: "No one, under any circumstances" },
            { id: "D", text: "Only GitHub customer support" }
          ],
          correctAnswer: "A",
          explanationNote: "Admins can bypass rules by default unless the strict setting 'Do not allow bypassing the above settings' is checked."
        }
      }
    ]
  },
  {
    id: "11-3-e2e-testing-ci-artifacts",
    number: "11.3",
    title: "End-to-End Testing & Artifacts in CI",
    subtitle: "Run headless browser tests with Playwright and Cypress in CI, manage service containers, and upload artifacts.",
    readTime: "12 min",
    objectives: [
      "Run headless browser E2E test suites in GitHub Actions runners",
      "Install browser binaries in CI using npx playwright install --with-deps",
      "Start background web servers during CI using wait-on or start-server-and-test",
      "Upload screenshots, videos, and test reports using actions/upload-artifact",
      "Configure headless Cypress and Playwright browsers on Linux runners",
      "Diagnose flaky test failures using CI artifacts and trace viewers"
    ],
    theoryBlocks: [
      {
        heading: "Headless E2E Testing in CI",
        text: "E2E testing in CI runs browsers headlessly (without a visible GUI window) to simulate real user journeys across the entire application stack.",
        codeSnippet: `- name: Install Playwright Browsers\n  run: npx playwright install --with-deps\n- name: Run Playwright tests\n  run: npx playwright test`,
        mcq: {
          id: "q-11.3-0-v1",
          question: "What does running a browser in 'headless' mode mean in a CI runner?",
          options: [
            { id: "A", text: "The browser executes without a graphical user interface (GUI), rendering pages in memory" },
            { id: "B", text: "The browser disables all CSS styling" },
            { id: "C", text: "The browser can only render plain text files" },
            { id: "D", text: "The browser operates without internet access" }
          ],
          correctAnswer: "A",
          explanationNote: "Headless browsers run without a graphical display server, allowing automated tests to interact with web pages on Linux servers."
        },
        retestMcq: {
          id: "q-11.3-0-v2",
          question: "Why is `npx playwright install --with-deps` necessary on clean GitHub Actions runners?",
          options: [
            { id: "A", text: "To download browser binaries (Chromium, Firefox, WebKit) and install Linux OS system dependencies" },
            { id: "B", text: "To install Node.js" },
            { id: "C", text: "To update the operating system kernel" },
            { id: "D", text: "To install the npm CLI tool" }
          ],
          correctAnswer: "A",
          explanationNote: "Fresh virtual runners do not have all browser rendering libraries pre-installed; `--with-deps` installs required Linux system packages."
        }
      },
      {
        heading: "Starting Background Servers for E2E Tests",
        text: "E2E tests require both the frontend and backend servers to be running; tools like `start-server-and-test` launch servers and wait for ports to open.",
        codeSnippet: `// In package.json:\n// "test:e2e": "start-server-and-test start:server http://localhost:3000 test:playwright"`,
        mcq: {
          id: "q-11.3-1-v1",
          question: "What problem does `start-server-and-test` solve in automated E2E testing pipelines?",
          options: [
            { id: "A", text: "It starts the backend/frontend server, waits until it is healthy and responding to HTTP requests, and then runs the tests" },
            { id: "B", text: "It translates tests into Python" },
            { id: "C", text: "It tests database connection latency" },
            { id: "D", text: "It prevents tests from using network requests" }
          ],
          correctAnswer: "A",
          explanationNote: "E2E tests fail if run before the server finishes booting; `start-server-and-test` waits for the server port to open before triggering test runners."
        },
        retestMcq: {
          id: "q-11.3-1-v2",
          question: "What happens to the background server once `start-server-and-test` completes the test run?",
          options: [
            { id: "A", text: "It automatically shuts down the background server processes cleanly" },
            { id: "B", text: "The server continues running indefinitely, blocking the runner" },
            { id: "C", text: "The server crashes with an exception" },
            { id: "D", text: "It restarts the computer" }
          ],
          correctAnswer: "A",
          explanationNote: "`start-server-and-test` terminates the spawned server processes as soon as the test command completes, freeing resources."
        }
      },
      {
        heading: "Uploading Artifacts (actions/upload-artifact)",
        text: "When E2E tests fail, screenshots, video recordings, and trace logs can be preserved and uploaded as artifacts using `actions/upload-artifact`.",
        codeSnippet: `- uses: actions/upload-artifact@v4\n  if: always()\n  with:\n    name: playwright-report\n    path: playwright-report/\n    retention-days: 14`,
        mcq: {
          id: "q-11.3-2-v1",
          question: "What is the purpose of `actions/upload-artifact` in GitHub Actions?",
          options: [
            { id: "A", text: "To save files (like test reports, failure screenshots, and videos) produced during the job so developers can download them" },
            { id: "B", text: "To publish packages to npm" },
            { id: "C", text: "To deploy apps to the cloud" },
            { id: "D", text: "To delete old git branches" }
          ],
          correctAnswer: "A",
          explanationNote: "Virtual runners are destroyed after jobs finish; uploading artifacts preserves test reports, screenshots, and logs on GitHub for inspection."
        },
        retestMcq: {
          id: "q-11.3-2-v2",
          question: "Why should `if: always()` or `if: failure()` be specified on the artifact upload step?",
          options: [
            { id: "A", text: "So artifacts like failure screenshots are uploaded even if earlier test steps failed and exited with an error" },
            { id: "B", text: "To prevent the upload from taking more than 1 second" },
            { id: "C", text: "Because upload-artifact fails without an if condition" },
            { id: "D", text: "To force the upload to use HTTPS" }
          ],
          correctAnswer: "A",
          explanationNote: "By default, failing steps cause subsequent steps to be skipped; `if: always()` or `if: failure()` ensures crash artifacts are still captured."
        }
      },
      {
        heading: "Debugging Flaky Tests with Playwright Trace Viewer",
        text: "Playwright's Trace Viewer captures DOM snapshots, network requests, console logs, and action timings for every step of an E2E test run.",
        codeSnippet: `// In playwright.config.ts:\nuse: {\n  trace: 'on-first-retry',\n  screenshot: 'only-on-failure',\n  video: 'retain-on-failure'\n}`,
        mcq: {
          id: "q-11.3-3-v1",
          question: "What is Playwright Trace Viewer?",
          options: [
            { id: "A", text: "A GUI tool that lets you inspect recorded test execution: DOM snapshots, timelines, console logs, and network traffic" },
            { id: "B", text: "A hardware device used to track mouse clicks" },
            { id: "C", text: "An automated code linter" },
            { id: "D", text: "A CSS layout debugger" }
          ],
          correctAnswer: "A",
          explanationNote: "Trace Viewer is an invaluable debugging tool for headless CI failures, allowing you to step forward and backward through test execution."
        },
        retestMcq: {
          id: "q-11.3-3-v2",
          question: "What does setting `trace: 'on-first-retry'` do in Playwright?",
          options: [
            { id: "A", text: "It records a full trace only when a test fails and is retried, saving disk space during passing runs" },
            { id: "B", text: "It disables tracing entirely" },
            { id: "C", text: "It retries the test 100 times" },
            { id: "D", text: "It logs errors to Twitter" }
          ],
          correctAnswer: "A",
          explanationNote: "`on-first-retry` keeps passing runs lightweight while capturing detailed trace data only for problematic or flaky tests."
        }
      },
      {
        heading: "Container Services in GitHub Actions",
        text: "Workflows can spin up auxiliary database services (like MongoDB or PostgreSQL) using the `services:` block in jobs.",
        codeSnippet: `jobs:\n  e2e:\n    runs-on: ubuntu-latest\n    services:\n      mongodb:\n        image: mongo:6\n        ports:\n          - 27017:27017`,
        mcq: {
          id: "q-11.3-4-v1",
          question: "What does defining a `services:` block (e.g. `image: mongo:6`) in a GitHub Actions job provide?",
          options: [
            { id: "A", text: "It runs a Docker container (like a clean MongoDB database) accessible to the job steps during testing" },
            { id: "B", text: "It deploys the database to production" },
            { id: "C", text: "It replaces Express with MongoDB" },
            { id: "D", text: "It creates a backup of the source code" }
          ],
          correctAnswer: "A",
          explanationNote: "GitHub Actions service containers run lightweight Docker containers in the background, providing databases or queues for test suites."
        },
        retestMcq: {
          id: "q-11.3-4-v2",
          question: "How do steps on an `ubuntu-latest` runner connect to a service container configured on port 27017?",
          options: [
            { id: "A", text: "Via `localhost:27017` (or `127.0.0.1:27017`)" },
            { id: "B", text: "Via `docker.internal:80`" },
            { id: "C", text: "Using a public domain name" },
            { id: "D", text: "Through an SSH tunnel" }
          ],
          correctAnswer: "A",
          explanationNote: "Service containers mapped to host ports are accessible directly on `localhost` from the runner's shell steps."
        }
      },
      {
        heading: "Fast Feedback & Test Parallelization",
        text: "To keep CI feedback loops fast, test matrices can split test execution across multiple runners in parallel.",
        codeSnippet: `strategy:\n  matrix:\n    project: [chromium, firefox, webkit]`,
        mcq: {
          id: "q-11.3-5-v1",
          question: "What is the purpose of a build matrix (`strategy.matrix`) in GitHub Actions?",
          options: [
            { id: "A", text: "To spawn multiple parallel job instances running under different configurations (e.g. different OS, Node versions, or browsers)" },
            { id: "B", text: "To solve mathematical matrix equations" },
            { id: "C", text: "To compress image files into 3D matrices" },
            { id: "D", text: "To organize git branches alphabetically" }
          ],
          correctAnswer: "A",
          explanationNote: "A matrix generates multiple concurrent jobs for each combination of inputs, testing your app across different platforms simultaneously."
        },
        retestMcq: {
          id: "q-11.3-5-v2",
          question: "Why is fast CI execution time (ideally under 5–10 minutes) critical for software engineering teams?",
          options: [
            { id: "A", text: "Developers stay in flow and receive rapid feedback on their commits rather than waiting around or context switching" },
            { id: "B", text: "Because GitHub charges by the second after 10 minutes" },
            { id: "C", text: "Because browsers crash if tests run longer than 5 minutes" },
            { id: "D", text: "Slow CI burns out computer processors" }
          ],
          correctAnswer: "A",
          explanationNote: "Fast CI maintains high engineering velocity: developers get immediate feedback, fix issues promptly, and avoid disruptive context switching."
        }
      }
    ]
  },
  {
    id: "11-4-deployment-secrets-cd",
    number: "11.4",
    title: "Deployment Automation & Secrets Management",
    subtitle: "Automate zero-downtime deployments, manage environment secrets securely, and configure conditional releases.",
    readTime: "12 min",
    objectives: [
      "Understand Continuous Deployment (CD) and automated deployment triggers",
      "Store API keys, deployment tokens, and webhooks in GitHub Encrypted Secrets",
      "Deploy full-stack applications to platforms like Render, Fly.io, or Heroku",
      "Use conditional step execution (if: github.event_name == 'push') to separate PR testing from production releases",
      "Trigger automated deployments using deploy webhooks or platform CLIs",
      "Prevent deployment of untested or failing code"
    ],
    theoryBlocks: [
      {
        heading: "Automating Deployments (Continuous Deployment)",
        text: "Continuous Deployment automatically ships code that passes all CI checks into production without manual human intervention.",
        codeSnippet: `// Merge PR into main -> CI tests pass -> Automated deploy step triggers -> New version goes live!`,
        mcq: {
          id: "q-11.4-0-v1",
          question: "What is the defining characteristic of Continuous Deployment (CD)?",
          options: [
            { id: "A", text: "Every code change that successfully passes the automated test pipeline is released to production automatically" },
            { id: "B", text: "Deployments are scheduled manually only on weekends" },
            { id: "C", text: "Software is delivered to customers via physical flash drives" },
            { id: "D", text: "Deployments occur without running any tests" }
          ],
          correctAnswer: "A",
          explanationNote: "Continuous Deployment automates the entire delivery pipeline: any commit passing all automated gates goes live automatically."
        },
        retestMcq: {
          id: "q-11.4-0-v2",
          question: "How does Continuous Delivery differ slightly from Continuous Deployment?",
          options: [
            { id: "A", text: "Continuous Delivery ensures code is always in a deployable state, but final production release may involve a manual approval trigger" },
            { id: "B", text: "Continuous Delivery does not use automated testing" },
            { id: "C", text: "Continuous Delivery is only for mobile applications" },
            { id: "D", text: "Continuous Delivery requires deleting old versions manually" }
          ],
          correctAnswer: "A",
          explanationNote: "Continuous Delivery keeps software deployable at all times, with a human deciding when to push the deploy button; Continuous Deployment automates that step too."
        }
      },
      {
        heading: "GitHub Encrypted Secrets",
        text: "Sensitive credentials like API keys and deploy tokens must never be committed to git; they are stored in GitHub Secrets and accessed via `${{ secrets.SECRET_NAME }}`.",
        codeSnippet: `- name: Trigger deployment webhook\n  run: curl "\${{ secrets.RENDER_DEPLOY_HOOK_URL }}"`,
        mcq: {
          id: "q-11.4-1-v1",
          question: "Why should deployment tokens and database passwords be stored in GitHub Secrets rather than in workflow YAML files?",
          options: [
            { id: "A", text: "Workflow YAML files are committed to version control; committing plaintext credentials creates severe security vulnerabilities" },
            { id: "B", text: "Because YAML does not support strings containing numbers" },
            { id: "C", text: "Because GitHub Actions cannot parse secrets in YAML" },
            { id: "D", text: "It is a requirement invented by Docker" }
          ],
          correctAnswer: "A",
          explanationNote: "Committing credentials to Git exposes them publicly or to unauthorized parties. GitHub Secrets encrypts credentials and masks them in logs."
        },
        retestMcq: {
          id: "q-11.4-1-v2",
          question: "How does GitHub Actions protect secret values from accidentally appearing in public build logs?",
          options: [
            { id: "A", text: "It automatically redacts (masks) secret values printed to stdout with asterisks (`***`)" },
            { id: "B", text: "It deletes the build logs immediately" },
            { id: "C", text: "It converts logs to binary" },
            { id: "D", text: "It only shows logs to repository owners" }
          ],
          correctAnswer: "A",
          explanationNote: "GitHub Actions scans log streams and replaces occurrences of any registered secret with `***` to prevent accidental exposure."
        }
      },
      {
        heading: "Conditional Deployments (if conditions)",
        text: "Deployments should only happen on direct pushes or merges to `main`, not when running tests against pull requests.",
        codeSnippet: `- name: Deploy to production\n  if: \${{ github.event_name == 'push' && github.ref == 'refs/heads/main' }}\n  run: curl "\${{ secrets.DEPLOY_HOOK }}"`,
        mcq: {
          id: "q-11.4-2-v1",
          question: "What does the condition `if: ${{ github.event_name == 'push' }}` ensure?",
          options: [
            { id: "A", text: "The step runs only on commits pushed or merged to the branch, skipping execution during pull request validation runs" },
            { id: "B", text: "The step runs only on pull requests" },
            { id: "C", text: "The step runs only if the user presses enter" },
            { id: "D", text: "The step runs only on weekend pushes" }
          ],
          correctAnswer: "A",
          explanationNote: "Without this check, PRs would trigger deployments before being merged. The condition ensures deployment happens only on actual branch merges."
        },
        retestMcq: {
          id: "q-11.4-2-v2",
          question: "What happens if a pull request contains a failing test and is open against `main`?",
          options: [
            { id: "A", text: "The CI job runs, the test step fails, the deploy step is skipped, and branch protection prevents merging" },
            { id: "B", text: "The app deploys anyway because it's a pull request" },
            { id: "C", text: "The pull request is automatically merged" },
            { id: "D", text: "GitHub locks the repository" }
          ],
          correctAnswer: "A",
          explanationNote: "The failure blocks the workflow, preventing the PR from satisfying branch protection requirements and blocking deployment."
        }
      },
      {
        heading: "Deploy Webhooks with curl",
        text: "Hosting platforms like Render and Netlify provide deploy webhooks: an HTTP POST or GET request to the webhook URL triggers a fresh deployment.",
        codeSnippet: `- name: Deploy to Render\n  if: \${{ github.event_name == 'push' }}\n  run: curl -f "\${{ secrets.RENDER_DEPLOY_HOOK_URL }}"`,
        mcq: {
          id: "q-11.4-3-v1",
          question: "Why is the `-f` (or `--fail`) flag recommended when executing `curl` in a deployment step?",
          options: [
            { id: "A", text: "It causes curl to exit with a non-zero exit code if the server returns an HTTP error code (e.g. 404 or 500)" },
            { id: "B", text: "It causes curl to run faster" },
            { id: "C", text: "It disables SSL verification" },
            { id: "D", text: "It retries forever" }
          ],
          correctAnswer: "A",
          explanationNote: "By default, `curl` exits with code 0 even if an HTTP 4xx/5xx error is returned; `-f` ensures the GitHub Actions step fails on HTTP errors."
        },
        retestMcq: {
          id: "q-11.4-3-v2",
          question: "What does an HTTP Deploy Webhook URL typically do when called by CI?",
          options: [
            { id: "A", text: "It signals the cloud hosting provider to pull the latest commit from `main`, build it, and deploy it to production" },
            { id: "B", text: "It downloads the database to your computer" },
            { id: "C", text: "It restarts the developer's laptop" },
            { id: "D", text: "It sends an email to every registered user" }
          ],
          correctAnswer: "A",
          explanationNote: "Deploy webhooks notify the platform to pull the newest code, build the production image, and swap traffic with zero downtime."
        }
      },
      {
        heading: "Deploying with CLI Tools (Fly.io example)",
        text: "For platforms using CLI deployments, install the platform CLI and run deployment commands using authentication tokens from secrets.",
        codeSnippet: `- uses: superfly/flyctl-actions/setup-flyctl@master\n- name: Deploy App to Fly.io\n  run: flyctl deploy --remote-only\n  env:\n    FLY_API_TOKEN: \${{ secrets.FLY_API_TOKEN }}`,
        mcq: {
          id: "q-11.4-4-v1",
          question: "How are authentication tokens provided to CLI deployment commands in GitHub Actions?",
          options: [
            { id: "A", text: "Via environment variables passed under the `env:` block from `secrets`" },
            { id: "B", text: "By typing the password interactively in the terminal prompt" },
            { id: "C", text: "By hardcoding the password in `package.json`" },
            { id: "D", text: "Through the user's web browser cookies" }
          ],
          correctAnswer: "A",
          explanationNote: "Passing tokens via the `env:` block injects the secret into the environment where CLI tools look for API tokens automatically."
        },
        retestMcq: {
          id: "q-11.4-4-v2",
          question: "What is the advantage of using `--remote-only` when deploying with `flyctl` in CI?",
          options: [
            { id: "A", text: "It builds the Docker container remotely on Fly.io servers rather than requiring a local Docker daemon on the runner" },
            { id: "B", text: "It deploys only to remote countries" },
            { id: "C", text: "It disables the database" },
            { id: "D", text: "It prevents users from connecting" }
          ],
          correctAnswer: "A",
          explanationNote: "`--remote-only` offloads Docker image compilation to Fly's remote builders, keeping CI runner resource requirements low."
        }
      },
      {
        heading: "Slack & Discord Notifications on Build Status",
        text: "Teams configure webhook notifications to send channel alerts in Slack or Discord whenever a build or deployment succeeds or fails.",
        codeSnippet: `- name: Notify Discord on Failure\n  uses: rjstone/discord-webhook-notify@v1\n  if: failure()\n  with:\n    severity: error\n    webhookUrl: \${{ secrets.DISCORD_WEBHOOK }}`,
        mcq: {
          id: "q-11.4-5-v1",
          question: "Why do engineering teams integrate chat notifications (Slack/Discord) into CI/CD pipelines?",
          options: [
            { id: "A", text: "To immediately alert developers when a build breaks or when a new version has successfully gone live" },
            { id: "B", text: "To post public advertisements on social media" },
            { id: "C", text: "To track employee keyboard activity" },
            { id: "D", text: "Because GitHub requires Discord for production" }
          ],
          correctAnswer: "A",
          explanationNote: "Chat notifications surface build health immediately, so engineers can react instantly to broken deployments without checking GitHub constantly."
        },
        retestMcq: {
          id: "q-11.4-5-v2",
          question: "What does the condition `if: failure()` mean in a workflow step?",
          options: [
            { id: "A", text: "The step executes ONLY if any previous step in the current job has failed" },
            { id: "B", text: "The step causes the build to fail on purpose" },
            { id: "C", text: "The step retries the build 5 times" },
            { id: "D", text: "The step runs only when the internet is disconnected" }
          ],
          correctAnswer: "A",
          explanationNote: "`if: failure()` is specifically designed for cleanup and notification steps that should only trigger when an error has occurred."
        }
      }
    ]
  },
  {
    id: "11-5-health-checks-rollbacks",
    number: "11.5",
    title: "Health Checks, Periodic Pings & Rollbacks",
    subtitle: "Implement /health endpoint verification, periodic cron health checks, and automatic rollback strategies.",
    readTime: "12 min",
    objectives: [
      "Create lightweight /health endpoints in Express backends",
      "Verify live server health post-deployment using curl and status codes",
      "Configure scheduled cron workflows in GitHub Actions for periodic uptime pings",
      "Implement automatic rollback strategies when health checks fail",
      "Differentiate between shallow ping checks and deep dependency health checks",
      "Monitor application availability and error budgets"
    ],
    theoryBlocks: [
      {
        heading: "The /health Endpoint",
        text: "Production web applications expose a lightweight `/health` or `/ping` endpoint that returns HTTP 200 to confirm the application process is alive.",
        codeSnippet: `app.get('/health', (_req, res) => {\n  res.send('ok');\n});\n// Deep check can verify DB connection:\napp.get('/health/deep', async (_req, res) => {\n  const dbOk = await mongoose.connection.db.admin().ping();\n  res.status(dbOk ? 200 : 500).send(dbOk ? 'ok' : 'db failed');\n});`,
        mcq: {
          id: "q-11.5-0-v1",
          question: "What is the purpose of a `/health` endpoint in modern web services?",
          options: [
            { id: "A", text: "To allow load balancers, deployment scripts, and monitors to verify that the application server is operational" },
            { id: "B", text: "To diagnose patient symptoms using medical AI" },
            { id: "C", text: "To display CPU temperatures to users" },
            { id: "D", text: "To count total lines of code in the project" }
          ],
          correctAnswer: "A",
          explanationNote: "Health endpoints allow automated systems to periodically check service availability and prevent routing traffic to unhealthy instances."
        },
        retestMcq: {
          id: "q-11.5-0-v2",
          question: "What HTTP status code signifies a healthy, operational service in a `/health` check response?",
          options: [
            { id: "A", text: "HTTP 200 OK" },
            { id: "B", text: "HTTP 301 Moved Permanently" },
            { id: "C", text: "HTTP 500 Internal Server Error" },
            { id: "D", text: "HTTP 404 Not Found" }
          ],
          correctAnswer: "A",
          explanationNote: "HTTP 200 (or any 2xx status) signals to monitors and load balancers that the instance is alive and ready to process traffic."
        }
      },
      {
        heading: "Post-Deployment Health Verification",
        text: "Immediately after triggering a deployment, the pipeline polls the live production `/health` endpoint to ensure the new version is serving traffic.",
        codeSnippet: `- name: Verify production deployment health\n  run: |\n    sleep 30\n    curl -f https://fullstack-pokedex.onrender.com/health`,
        mcq: {
          id: "q-11.5-1-v1",
          question: "Why should a CI/CD pipeline include a post-deployment verification check?",
          options: [
            { id: "A", text: "To immediately confirm that the newly deployed version booted successfully and is serving live requests in production" },
            { id: "B", text: "To download the production database to the runner" },
            { id: "C", text: "To reset user passwords" },
            { id: "D", text: "Because GitHub Actions requires 10 steps per job" }
          ],
          correctAnswer: "A",
          explanationNote: "A deployment command might succeed while the application itself crashes on boot due to missing runtime environment variables; a health check catches this immediately."
        },
        retestMcq: {
          id: "q-11.5-1-v2",
          question: "Why is a `sleep 30` or polling retry loop often used before querying the production health endpoint?",
          options: [
            { id: "A", text: "To give the cloud provider time to pull the new image, spin up the new container, and switch routing" },
            { id: "B", text: "Because Linux computers sleep every 30 seconds" },
            { id: "C", text: "To let the developer drink coffee" },
            { id: "D", text: "To reset the internet connection" }
          ],
          correctAnswer: "A",
          explanationNote: "Cloud platforms take 15–60 seconds to build, boot, and shift traffic to new instances. Polling or waiting prevents checking the old instance."
        }
      },
      {
        heading: "Scheduled Cron Workflows in GitHub Actions",
        text: "GitHub Actions can run workflows on a recurring schedule using standard 5-field cron syntax via `on.schedule`.",
        codeSnippet: `on:\n  schedule:\n    # Runs every day at 04:00 UTC\n    - cron: '0 4 * * *'`,
        mcq: {
          id: "q-11.5-2-v1",
          question: "How do you schedule a GitHub Actions workflow to run automatically at 04:00 AM UTC every day?",
          options: [
            { id: "A", text: "`on: schedule: - cron: '0 4 * * *'`" },
            { id: "B", text: "`on: daily: '04:00'`" },
            { id: "C", text: "`on: timer: 86400`" },
            { id: "D", text: "`repeat: every_day`" }
          ],
          correctAnswer: "A",
          explanationNote: "Standard 5-field cron syntax (`minute hour day-of-month month day-of-week`) under `on.schedule` configures recurring background triggers."
        },
        retestMcq: {
          id: "q-11.5-2-v2",
          question: "What is an ideal use case for a scheduled cron workflow in web operations?",
          options: [
            { id: "A", text: "Periodic uptime pings to keep free-tier containers warm, or daily security vulnerability scans with `npm audit`" },
            { id: "B", text: "Sending random spam emails" },
            { id: "C", text: "Editing the source code automatically" },
            { id: "D", text: "Deleting git commits" }
          ],
          correctAnswer: "A",
          explanationNote: "Scheduled workflows excel at periodic maintenance: keeping dormant containers awake, database backups, and daily security scans."
        }
      },
      {
        heading: "Automated Rollback Strategies",
        text: "If post-deployment health verification fails, an automated rollback can redeploy the previous known-good commit to restore service immediately.",
        codeSnippet: `# If health check fails -> trigger rollback hook:\n- name: Rollback on health check failure\n  if: failure()\n  run: curl "\${{ secrets.ROLLBACK_WEBHOOK_URL }}"`,
        mcq: {
          id: "q-11.5-3-v1",
          question: "What is the purpose of an automated rollback strategy in CD pipelines?",
          options: [
            { id: "A", text: "To immediately restore the previous working release when a new deployment fails health checks, minimizing downtime" },
            { id: "B", text: "To delete the GitHub repository" },
            { id: "C", text: "To roll back user database transactions from last year" },
            { id: "D", text: "To revert TypeScript to JavaScript" }
          ],
          correctAnswer: "A",
          explanationNote: "Automated rollbacks limit Mean Time to Recovery (MTTR) by reverting to the previous stable artifact as soon as health checks fail."
        },
        retestMcq: {
          id: "q-11.5-3-v2",
          question: "What deployment architecture enables instant rollbacks by maintaining two identical production environments?",
          options: [
            { id: "A", text: "Blue-Green Deployment" },
            { id: "B", text: "Monolithic Deployment" },
            { id: "C", text: "Waterfall Deployment" },
            { id: "D", text: "Single-Thread Deployment" }
          ],
          correctAnswer: "A",
          explanationNote: "In Blue-Green deployment, one environment is live while the other is idle. If the new release fails, routing switches back to the old environment instantly."
        }
      },
      {
        heading: "Deep vs Shallow Health Checks",
        text: "A shallow check confirms the web server process is responding, while a deep check tests critical dependencies like database connections and third-party APIs.",
        codeSnippet: `// Shallow: return 200 immediately\n// Deep: ping MongoDB, verify Redis cache, check payment gateway connection`,
        mcq: {
          id: "q-11.5-4-v1",
          question: "What is the key difference between a shallow health check and a deep health check?",
          options: [
            { id: "A", text: "Shallow checks verify the HTTP process is running; deep checks verify connectivity to databases and external dependencies" },
            { id: "B", text: "Shallow checks only run on desktop computers" },
            { id: "C", text: "Deep checks take 24 hours to complete" },
            { id: "D", text: "Shallow checks use HTML while deep checks use XML" }
          ],
          correctAnswer: "A",
          explanationNote: "Shallow checks test process liveness; deep checks test overall system readiness by validating essential database connections and services."
        },
        retestMcq: {
          id: "q-11.5-4-v2",
          question: "Why should high-frequency load balancer health checks (e.g. every 5 seconds) usually be shallow rather than deep?",
          options: [
            { id: "A", text: "To avoid overloading the database with thousands of repetitive ping queries per minute" },
            { id: "B", text: "Because load balancers cannot parse database responses" },
            { id: "C", text: "Because deep checks cannot return HTTP status codes" },
            { id: "D", text: "It is forbidden by HTTP standards" }
          ],
          correctAnswer: "A",
          explanationNote: "Excessively frequent deep checks can saturate databases with diagnostic pings. Frequent checks should be lightweight, with deep checks run periodically."
        }
      },
      {
        heading: "Uptime Monitoring Services",
        text: "External uptime monitoring services (like UptimeRobot or BetterStack) continuously ping production endpoints and alert on outages.",
        codeSnippet: `// External monitor pings /health every 5 minutes from multiple global regions.\n// If 2 pings fail -> On-call engineer alerted via SMS/PagerDuty!`,
        mcq: {
          id: "q-11.5-5-v1",
          question: "Why do companies use external uptime monitoring services in addition to internal CI checks?",
          options: [
            { id: "A", text: "To detect real-world outages from external networks and alert on-call engineers 24/7 if production goes down" },
            { id: "B", text: "To spy on user browsing history" },
            { id: "C", text: "To automatically write unit tests" },
            { id: "D", text: "To increase server RAM" }
          ],
          correctAnswer: "A",
          explanationNote: "External monitors test availability from outside your internal infrastructure, alerting on-call staff to ISP, DNS, or server failures."
        },
        retestMcq: {
          id: "q-11.5-5-v2",
          question: "What is an SLA (Service Level Agreement) in web operations?",
          options: [
            { id: "A", text: "A formal commitment specifying the expected uptime percentage (e.g. 99.9% uptime) of a web service" },
            { id: "B", text: "A software license for open-source code" },
            { id: "C", text: "A database query language" },
            { id: "D", text: "An encryption algorithm" }
          ],
          correctAnswer: "A",
          explanationNote: "An SLA defines the contractual uptime reliability (often measured in 'nines', e.g. 99.9% = 'three nines') promised to users."
        }
      }
    ]
  },
  {
    id: "11-6-semver-release-tagging",
    number: "11.6",
    title: "Semantic Versioning, Release Tagging & Capstone",
    subtitle: "Automate semantic versioning (SemVer), tag Git releases automatically, and control workflow execution.",
    readTime: "12 min",
    objectives: [
      "Master Semantic Versioning rules: MAJOR.MINOR.PATCH (e.g. 1.2.3)",
      "Automate Git release tagging in GitHub Actions using community actions",
      "Control workflow execution and skip pipelines using [skip ci] commit tags",
      "Understand Git tags and GitHub Releases",
      "Configure changelog generation and release notes",
      "Synthesize complete CI/CD pipeline architecture across the Full Stack Open course"
    ],
    theoryBlocks: [
      {
        heading: "Semantic Versioning (SemVer)",
        text: "Semantic Versioning uses a three-part version format `MAJOR.MINOR.PATCH` to communicate the nature of changes to users and package managers.",
        codeSnippet: `// 1.4.2 -> MAJOR.MINOR.PATCH\n// PATCH: Bug fixes without API changes (1.4.3)\n// MINOR: New features backward-compatible (1.5.0)\n// MAJOR: Breaking API changes (2.0.0)`,
        mcq: {
          id: "q-11.6-0-v1",
          question: "Under Semantic Versioning (`MAJOR.MINOR.PATCH`), when should the `MAJOR` number be incremented?",
          options: [
            { id: "A", text: "When you introduce incompatible (breaking) API changes" },
            { id: "B", text: "Whenever you fix a small typo or bug" },
            { id: "C", text: "Every month on the first day" },
            { id: "D", text: "Whenever you add backward-compatible features" }
          ],
          correctAnswer: "A",
          explanationNote: "MAJOR increments signify breaking changes requiring consumers to update their code. MINOR is for backward-compatible features; PATCH is for backward-compatible bug fixes."
        },
        retestMcq: {
          id: "q-11.6-0-v2",
          question: "If your app is at version `2.4.1` and you release a backward-compatible bug fix, what is the new version?",
          options: [
            { id: "A", text: "`2.4.2`" },
            { id: "B", text: "`2.5.0`" },
            { id: "C", text: "`3.0.0`" },
            { id: "D", text: "`2.4.1.1`" }
          ],
          correctAnswer: "A",
          explanationNote: "Backward-compatible bug fixes increment the PATCH version: `2.4.1` becomes `2.4.2`."
        }
      },
      {
        heading: "Automated Tagging with GitHub Actions",
        text: "Community actions (like `anothrNick/github-tag-action`) analyze commit messages and automatically increment Git tags upon merging to `main`.",
        codeSnippet: `- name: Bump version and push tag\n  uses: anothrNick/github-tag-action@1.67.0\n  env:\n    GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}\n    DEFAULT_BUMP: patch`,
        mcq: {
          id: "q-11.6-1-v1",
          question: "What does `DEFAULT_BUMP: patch` do in an automated tagging action?",
          options: [
            { id: "A", text: "It increments the PATCH version number by default on merges unless a commit message specifies #minor or #major" },
            { id: "B", text: "It resets the version to 0.0.1" },
            { id: "C", text: "It deletes the git tag" },
            { id: "D", text: "It downloads a software patch file" }
          ],
          correctAnswer: "A",
          explanationNote: "`DEFAULT_BUMP: patch` increments the third version number (e.g. 1.2.3 -> 1.2.4) automatically on each merge, unless overridden by commit tags."
        },
        retestMcq: {
          id: "q-11.6-1-v2",
          question: "What token provides the necessary Git permissions for actions to create tags in your repository?",
          options: [
            { id: "A", text: "The built-in `${{ secrets.GITHUB_TOKEN }}` automatically generated by GitHub Actions for each run" },
            { id: "B", text: "The developer's personal email password" },
            { id: "C", text: "An AWS access key" },
            { id: "D", text: "A PayPal API client ID" }
          ],
          correctAnswer: "A",
          explanationNote: "GitHub automatically creates a temporary `GITHUB_TOKEN` for each workflow run with permissions to interact with repository refs and releases."
        }
      },
      {
        heading: "Skipping CI Runs with [skip ci]",
        text: "Including `[skip ci]` or `[skip actions]` anywhere in a git commit message tells GitHub Actions to skip triggering workflow runs.",
        codeSnippet: `git commit -m \"update README documentation [skip ci]\"\ngit push origin main\n// GitHub Actions detects [skip ci] and skips running the pipeline!`,
        mcq: {
          id: "q-11.6-2-v1",
          question: "What is the purpose of adding `[skip ci]` to a Git commit message?",
          options: [
            { id: "A", text: "It instructs GitHub Actions not to trigger workflow runs for that commit (ideal for docs and markdown edits)" },
            { id: "B", text: "It causes the pipeline to skip running tests and deploy immediately" },
            { id: "C", text: "It deletes the CI workflow file" },
            { id: "D", text: "It hides the commit from Git history" }
          ],
          correctAnswer: "A",
          explanationNote: "Adding `[skip ci]` or `[skip actions]` avoids wasting runner minutes and deploying unnecessary builds for documentation changes."
        },
        retestMcq: {
          id: "q-11.6-2-v2",
          question: "How can you check within a workflow step whether the commit message contains `#skip` using expressions?",
          options: [
            { id: "A", text: "`!contains(join(toJson(github.event.commits.*.message)), '#skip')`" },
            { id: "B", text: "`if (git.message == 'skip')`" },
            { id: "C", text: "`@skip_step`" },
            { id: "D", text: "`eval(commit.message)`" }
          ],
          correctAnswer: "A",
          explanationNote: "GitHub Actions expressions like `contains()` allow inspecting commit message payloads to conditionally skip individual steps."
        }
      },
      {
        heading: "GitHub Releases & Release Notes",
        text: "Creating a GitHub Release associates release notes and build artifacts with a specific Git tag, providing a clear history of shipped features.",
        codeSnippet: `// Git tag: v1.3.0\n// GitHub Release: includes compiled binaries, assets, and auto-generated changelog of PRs!`,
        mcq: {
          id: "q-11.6-3-v1",
          question: "What is a GitHub Release in software development?",
          options: [
            { id: "A", text: "A packaged version of your software associated with a Git tag, containing release notes, changelogs, and binary assets" },
            { id: "B", text: "A legal document signed by developers" },
            { id: "C", text: "A marketing email sent to users" },
            { id: "D", text: "A tool that deletes old repositories" }
          ],
          correctAnswer: "A",
          explanationNote: "Releases provide a structured way for users and package managers to download versioned source code, changelogs, and compiled artifacts."
        },
        retestMcq: {
          id: "q-11.6-3-v2",
          question: "How can GitHub automatically generate release notes for a release?",
          options: [
            { id: "A", text: "By clicking 'Generate release notes' which compiles merged pull request titles and contributors since the previous tag" },
            { id: "B", text: "By using an AI voice recorder" },
            { id: "C", text: "By scanning browser cookies" },
            { id: "D", text: "Release notes cannot be generated automatically" }
          ],
          correctAnswer: "A",
          explanationNote: "GitHub can auto-generate release notes by analyzing all pull requests merged between the current tag and the prior release tag."
        }
      },
      {
        heading: "Managing Monorepos in CI/CD",
        text: "In monorepos containing multiple apps, the `paths:` filter ensures workflows run only when files in relevant subdirectories change.",
        codeSnippet: `on:\n  push:\n    paths:\n      - 'frontend/**'\n      - 'shared-types/**'`,
        mcq: {
          id: "q-11.6-4-v1",
          question: "What does the `paths:` filter under a GitHub Actions trigger do?",
          options: [
            { id: "A", text: "It triggers the workflow only when pushed commits modify files matching the specified file path patterns" },
            { id: "B", text: "It sets the PATH environment variable in Linux" },
            { id: "C", text: "It redirects HTTP URL requests" },
            { id: "D", text: "It moves files from folder A to folder B" }
          ],
          correctAnswer: "A",
          explanationNote: "`paths` filters allow monorepos to trigger frontend CI only when frontend files change, avoiding wasteful backend builds."
        },
        retestMcq: {
          id: "q-11.6-4-v2",
          question: "What is the inverse of `paths:` to ignore changes to specific files like README.md?",
          options: [
            { id: "A", text: "`paths-ignore:`" },
            { id: "B", text: "`no-paths:`" },
            { id: "C", text: "`exclude-files:`" },
            { id: "D", text: "`skip-paths:`" }
          ],
          correctAnswer: "A",
          explanationNote: "`paths-ignore:` specifies patterns of files that should NOT trigger a workflow run when modified alone."
        }
      },
      {
        heading: "Full Stack Open CI/CD Capstone",
        text: "A complete production CI/CD pipeline integrates checkout, linting, unit testing, building, E2E testing, automated deployment, health verification, and semantic version tagging.",
        codeSnippet: `// The Full Pipeline Architecture:\n// 1. Checkout -> 2. Lint -> 3. Unit Tests -> 4. Build Bundle\n// 5. E2E Tests (Playwright) -> 6. Deploy to Cloud (Render/Fly)\n// 7. Verify /health -> 8. Tag Release (SemVer)`,
        mcq: {
          id: "q-11.6-5-v1",
          question: "What is the complete sequential order of a robust production CI/CD pipeline?",
          options: [
            { id: "A", text: "Checkout -> Lint -> Test -> Build -> E2E -> Deploy (on merge to main) -> Health Check -> Version Tag" },
            { id: "B", text: "Deploy -> Build -> Lint -> Test -> Checkout" },
            { id: "C", text: "Version Tag -> Deploy -> Test -> Lint" },
            { id: "D", text: "Lint -> Deploy -> Test -> Build" }
          ],
          correctAnswer: "A",
          explanationNote: "Fast quality gates (linting & unit tests) run first, followed by building and E2E testing; deployment only happens after all gates pass, followed by health verification and tagging."
        },
        retestMcq: {
          id: "q-11.6-5-v2",
          question: "What is the greatest cultural and operational transformation brought by automated CI/CD pipelines to engineering teams?",
          options: [
            { id: "A", text: "Releases change from stressful, infrequent manual events into routine, low-risk, continuous automated deliveries" },
            { id: "B", text: "Developers never have to write code anymore" },
            { id: "C", text: "Software never has bugs again" },
            { id: "D", text: "Computers run without electricity" }
          ],
          correctAnswer: "A",
          explanationNote: "CI/CD transforms software delivery into small, frequent, highly automated releases, eliminating 'deployment day anxiety' and accelerating innovation."
        }
      }
    ]
  }
];

// Helper functions for student attempt tracking and failure streak logic
export const getLevelAttemptCountFullstackPart11 = (sectionId: string, studentId: string): number => {
  try {
    const key = `dopilot_fullstack_p11_attempt_${sectionId}_${studentId}`;
    const saved = localStorage.getItem(key);
    return saved ? Number(saved) : 1;
  } catch {
    return 1;
  }
};

export const setLevelAttemptCountFullstackPart11 = (sectionId: string, studentId: string, count: number): void => {
  try {
    const key = `dopilot_fullstack_p11_attempt_${sectionId}_${studentId}`;
    localStorage.setItem(key, String(count));
  } catch {}
};

export const getActiveQuestionsForLevelFullstackPart11 = (
  section: SectionContent,
  studentId: string,
  forceRetest: boolean = false
): McqQuestion[] => {
  const attempt = forceRetest ? 2 : getLevelAttemptCountFullstackPart11(section.id, studentId);
  return section.theoryBlocks.map((block) => {
    if (attempt >= 2 && block.retestMcq) {
      return block.retestMcq;
    }
    return block.mcq!;
  });
};

export const getConsecutiveFailedLevelsFullstackPart11 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_fullstack_p11_failed_levels_streak_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const isLevelLockedFullstackPart11 = (studentId: string): boolean => {
  try {
    return localStorage.getItem(`dopilot_fullstack_p11_locked_${studentId}`) === 'true';
  } catch {
    return false;
  }
};

export const recordLevelAttemptResultFullstackPart11 = (
  sectionId: string,
  studentId: string,
  isPassed: boolean
): {
  isPassed: boolean;
  attemptCount: number;
  isSecondFailureInLevel: boolean;
  consecutiveFailedLevels: number;
  isLocked: boolean;
} => {
  const currentAttempt = getLevelAttemptCountFullstackPart11(sectionId, studentId);

  if (isPassed) {
    try {
      localStorage.setItem(`dopilot_fullstack_p11_failed_levels_streak_${studentId}`, '0');
      localStorage.setItem(`dopilot_fullstack_p11_consecutive_failures_${studentId}`, '0');
      localStorage.setItem(`dopilot_fullstack_p11_attempt_${sectionId}_${studentId}`, '1');
      localStorage.removeItem(`dopilot_fullstack_p11_locked_${studentId}`);
    } catch {}

    return {
      isPassed: true,
      attemptCount: currentAttempt,
      isSecondFailureInLevel: false,
      consecutiveFailedLevels: 0,
      isLocked: false
    };
  } else {
    if (currentAttempt === 1) {
      setLevelAttemptCountFullstackPart11(sectionId, studentId, 2);
      const streak = getConsecutiveFailedLevelsFullstackPart11(studentId);

      return {
        isPassed: false,
        attemptCount: 1,
        isSecondFailureInLevel: false,
        consecutiveFailedLevels: streak,
        isLocked: false
      };
    } else {
      const prevStreak = getConsecutiveFailedLevelsFullstackPart11(studentId);
      const newStreak = prevStreak + 1;
      const isLocked = newStreak >= 3;

      try {
        localStorage.setItem(`dopilot_fullstack_p11_failed_levels_streak_${studentId}`, String(newStreak));
        localStorage.setItem(`dopilot_fullstack_p11_consecutive_failures_${studentId}`, String(newStreak));
        if (isLocked) {
          localStorage.setItem(`dopilot_fullstack_p11_locked_${studentId}`, 'true');
        }
      } catch {}

      return {
        isPassed: false,
        attemptCount: 2,
        isSecondFailureInLevel: true,
        consecutiveFailedLevels: newStreak,
        isLocked
      };
    }
  }
};

export const resetConsecutiveFailuresFullstackPart11 = (studentId: string): void => {
  try {
    localStorage.setItem(`dopilot_fullstack_p11_consecutive_failures_${studentId}`, '0');
    localStorage.setItem(`dopilot_fullstack_p11_failed_levels_streak_${studentId}`, '0');
    localStorage.removeItem(`dopilot_fullstack_p11_locked_${studentId}`);
  } catch {}
};
