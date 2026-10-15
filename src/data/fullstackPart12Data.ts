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

export const FULLSTACK_PART_12_SECTIONS: SectionContent[] = [
  {
    id: "12-1-containers-and-docker-basics",
    number: "12.1",
    title: "Introduction to Containers & Docker Basics",
    subtitle: "Understand container architecture, contrast containers with VMs, run images, map ports, and inspect running processes.",
    readTime: "12 min",
    objectives: [
      "Distinguish container namespaces and cgroups from hypervisor-based Virtual Machines",
      "Understand the difference between immutable Docker images and live writable containers",
      "Run containerized web applications in detached mode with port bindings",
      "Inspect logs and status using docker ps, docker logs, and docker inspect",
      "Cleanly stop, remove, and manage container lifecycles"
    ],
    theoryBlocks: [
      {
        heading: "Containers vs Virtual Machines",
        text: "Containers package application code and dependencies together, sharing the host OS kernel for lightweight, near-instant startup compared to heavy guest-OS virtual machines.",
        codeSnippet: `docker --version\ndocker run hello-world`,
        mcq: {
          id: "q-12.1-0-v1",
          question: "What is the primary architectural difference between a Docker container and a traditional Virtual Machine (VM)?",
          options: [
            { id: "A", text: "Containers share the host operating system kernel, whereas VMs run a complete guest OS on top of a hypervisor" },
            { id: "B", text: "Virtual Machines are lighter and boot in milliseconds compared to containers" },
            { id: "C", text: "Containers require hypervisor hardware emulation for every single process" },
            { id: "D", text: "Containers cannot access network or storage peripherals" }
          ],
          correctAnswer: "A",
          explanationNote: "Containers share the host OS kernel and isolate processes using namespaces and cgroups, making them orders of magnitude lighter and faster to boot than VMs."
        },
        retestMcq: {
          id: "q-12.1-0-v2",
          question: "Why do Docker containers consume substantially fewer system resources than standard Virtual Machines?",
          options: [
            { id: "A", text: "Containers don't require hypervisor emulation of virtual hardware or dedicated guest OS memory allocations" },
            { id: "B", text: "Containers do not run real CPU instructions and instead run in browser emulators" },
            { id: "C", text: "Containers eliminate the need for an application runtime environment entirely" },
            { id: "D", text: "Containers only run compiled binary executables and cannot run interpreted languages" }
          ],
          correctAnswer: "A",
          explanationNote: "Because containers share the underlying host OS kernel without duplicating an entire guest operating system, memory and CPU overhead is minimal."
        }
      },
      {
        heading: "Images vs Running Containers",
        text: "A Docker image is an immutable, read-only blueprint template; a container is an active, runnable instantiated process wrapped in an isolated read-write file system layer.",
        codeSnippet: `docker images\ndocker ps -a`,
        mcq: {
          id: "q-12.1-1-v1",
          question: "What is the relationship between a Docker image and a Docker container?",
          options: [
            { id: "A", text: "An image is an immutable snapshot/blueprint, while a container is a live running instance with a writable layer" },
            { id: "B", text: "A container is a read-only template, and an image is the live running process" },
            { id: "C", text: "Images and containers are completely identical terms in Docker syntax" },
            { id: "D", text: "An image can only be created by stopping an existing container permanently" }
          ],
          correctAnswer: "A",
          explanationNote: "A Docker image represents an immutable collection of read-only layers, whereas a container is a runtime instantiation with a thin top read-write layer."
        },
        retestMcq: {
          id: "q-12.1-1-v2",
          question: "What happens to files created or modified inside a container's default filesystem when the container is deleted?",
          options: [
            { id: "A", text: "Changes written to the container's writable layer are lost unless persisted via a volume or bind mount" },
            { id: "B", text: "The changes are automatically permanently written back to the base Docker image" },
            { id: "C", text: "The changes are synced directly to the host machine's root directory automatically" },
            { id: "D", text: "Docker prevents any file modification inside running containers" }
          ],
          correctAnswer: "A",
          explanationNote: "A container's top writable layer is ephemeral and discarded when the container is deleted, unless persistent storage is configured."
        }
      },
      {
        heading: "Running Containers with Port Binding",
        text: "Container network ports are isolated by default; use `-p <host-port>:<container-port>` with `docker run` to route external host traffic to the container application.",
        codeSnippet: `docker run -d -p 8080:80 --name my-web nginx:alpine`,
        mcq: {
          id: "q-12.1-2-v1",
          question: "In the command \"docker run -d -p 3001:3000 my-app\", which port on the host machine routes traffic to the container?",
          options: [
            { id: "A", text: "Port 3001 on the host routes to port 3000 inside the container" },
            { id: "B", text: "Port 3000 on the host routes to port 3001 inside the container" },
            { id: "C", text: "Both ports 3000 and 3001 are opened on the host machine simultaneously" },
            { id: "D", text: "Port 3001 is a process identifier and not a network port" }
          ],
          correctAnswer: "A",
          explanationNote: "The `-p` syntax maps `<host-port>:<container-port>`. Thus, navigating to `localhost:3001` reaches port `3000` inside the container."
        },
        retestMcq: {
          id: "q-12.1-2-v2",
          question: "What is the purpose of the `-d` flag when executing \"docker run -d -p 8080:80 nginx\"?",
          options: [
            { id: "A", text: "Runs the container in detached mode in the background, freeing the terminal prompt" },
            { id: "B", text: "Enables verbose debug logging mode in the container console" },
            { id: "C", text: "Deletes the container immediately after the first HTTP request" },
            { id: "D", text: "Mounts the host root directory into /dev inside the container" }
          ],
          correctAnswer: "A",
          explanationNote: "The `-d` (`--detach`) flag runs the container in the background as a daemon process and outputs the container ID."
        }
      },
      {
        heading: "Listing and Inspecting Containers",
        text: "Use `docker ps` to list currently active containers, `docker ps -a` to view stopped containers, and `docker logs <container-id>` to inspect stdout/stderr console output.",
        codeSnippet: `docker ps -a\ndocker logs -f my-web\ndocker inspect my-web`,
        mcq: {
          id: "q-12.1-3-v1",
          question: "Which Docker command allows you to view the real-time standard output and console logs of a running container?",
          options: [
            { id: "A", text: "docker logs -f <container_name>" },
            { id: "B", text: "docker cat <container_name>" },
            { id: "C", text: "docker console --follow <container_name>" },
            { id: "D", text: "docker tail -syslog <container_name>" }
          ],
          correctAnswer: "A",
          explanationNote: "`docker logs -f <container>` streams stdout and stderr logs emitted by the main process running inside the container."
        },
        retestMcq: {
          id: "q-12.1-3-v2",
          question: "Why might a container not show up when executing `docker ps`, but appear in `docker ps -a`?",
          options: [
            { id: "A", text: "The container's primary process has exited or terminated and is no longer actively running" },
            { id: "B", text: "The container is running in invisible kernel stealth mode" },
            { id: "C", text: "The container has not received an IP address yet" },
            { id: "D", text: "docker ps only shows images, while docker ps -a shows active containers" }
          ],
          correctAnswer: "A",
          explanationNote: "`docker ps` lists only active running containers; `docker ps -a` displays all containers, including exited or stopped ones."
        }
      },
      {
        heading: "Stopping and Removing Containers",
        text: "Stop running containers gracefully with `docker stop <id>`, and remove terminated containers with `docker rm <id>` or use `--rm` flag to auto-remove upon exit.",
        codeSnippet: `docker stop my-web\ndocker rm my-web\ndocker run --rm -it alpine sh`,
        mcq: {
          id: "q-12.1-4-v1",
          question: "What is the benefit of including the `--rm` flag in a `docker run` command?",
          options: [
            { id: "A", text: "Automatically removes and cleans up the container file system when it terminates or exits" },
            { id: "B", text: "Removes the Docker base image from local disk immediately after running" },
            { id: "C", text: "Forces a hard immediate SIGKILL rather than a graceful SIGTERM" },
            { id: "D", text: "Prevents any logs from being generated by the container" }
          ],
          correctAnswer: "A",
          explanationNote: "The `--rm` flag automatically cleans up the container upon exit, preventing abandoned stopped containers from consuming disk space."
        },
        retestMcq: {
          id: "q-12.1-4-v2",
          question: "What signal does `docker stop` send to the container's PID 1 process before resorting to SIGKILL after a timeout?",
          options: [
            { id: "A", text: "SIGTERM, allowing the application to close connections and clean up resources gracefully" },
            { id: "B", text: "SIGHUP, instructing the container to reload configuration files" },
            { id: "C", text: "SIGINT, emulating an interactive Ctrl+C keystroke only" },
            { id: "D", text: "SIGUSR1, reserving memory for immediate crash dumps" }
          ],
          correctAnswer: "A",
          explanationNote: "`docker stop` sends SIGTERM to allow graceful shutdown; if the application does not exit within 10 seconds, it sends SIGKILL."
        }
      },
      {
        heading: "Executing Commands in Running Containers",
        text: "Use `docker exec -it <container> <command>` to run an interactive shell or diagnostics utility directly inside an existing running container environment.",
        codeSnippet: `docker exec -it my-web /bin/sh\ndocker exec my-web node -v`,
        mcq: {
          id: "q-12.1-5-v1",
          question: "Which command opens an interactive terminal shell inside a currently running container named \"api-server\"?",
          options: [
            { id: "A", text: "docker exec -it api-server sh" },
            { id: "B", text: "docker run -shell api-server" },
            { id: "C", text: "docker attach --new-terminal api-server" },
            { id: "D", text: "docker open api-server /bin/bash" }
          ],
          correctAnswer: "A",
          explanationNote: "`docker exec -it <container> sh` executes an interactive shell inside a running container, with `-i` keeping STDIN open and `-t` allocating a pseudo-TTY."
        },
        retestMcq: {
          id: "q-12.1-5-v2",
          question: "How does `docker exec` differ from `docker run`?",
          options: [
            { id: "A", text: "`docker exec` runs a process inside an existing container, while `docker run` creates and starts a brand-new container from an image" },
            { id: "B", text: "`docker exec` builds images, while `docker run` stops them" },
            { id: "C", text: "`docker exec` only works on stopped containers" },
            { id: "D", text: "`docker exec` can only run with root privileges on the host kernel" }
          ],
          correctAnswer: "A",
          explanationNote: "`docker run` instantiates a new container from an image; `docker exec` runs a command inside an already active running container."
        }
      }
    ]
  },
  {
    id: "12-2-writing-dockerfiles-and-images",
    number: "12.2",
    title: "Writing Dockerfiles & Base Images",
    subtitle: "Structure production Dockerfiles, leverage Alpine Linux, implement layer caching, and run with non-root security.",
    readTime: "14 min",
    objectives: [
      "Select optimal base images like node:20-alpine",
      "Structure WORKDIR, COPY, and RUN commands for layer caching",
      "Prevent secret leaks with .dockerignore",
      "Understand the difference between RUN, CMD, and ENTRYPOINT",
      "Harden containers using non-root users (USER node)"
    ],
    theoryBlocks: [
      {
        heading: "Dockerfile Anatomy & FROM Instruction",
        text: "A Dockerfile defines step-by-step instructions to build an image. Every Dockerfile begins with `FROM`, specifying the parent base image from Docker Hub or a registry.",
        codeSnippet: `FROM node:20-alpine\nWORKDIR /usr/src/app`,
        mcq: {
          id: "q-12.2-0-v1",
          question: "What is the required initial instruction in almost every standard Dockerfile?",
          options: [
            { id: "A", text: "FROM, specifying the base image to build upon" },
            { id: "B", text: "RUN, installing required system packages" },
            { id: "C", text: "WORKDIR, creating the root directory" },
            { id: "D", text: "CMD, declaring the container startup script" }
          ],
          correctAnswer: "A",
          explanationNote: "`FROM` initializes a new build stage and sets the parent base image for subsequent build steps."
        },
        retestMcq: {
          id: "q-12.2-0-v2",
          question: "Why are Alpine Linux based images (`node:alpine`) widely preferred for production Node.js Dockerfiles?",
          options: [
            { id: "A", text: "Alpine images are extremely lightweight (5–10MB base), reducing download times and attack surface" },
            { id: "B", text: "Alpine Linux is the only Linux distribution that can run JavaScript V8" },
            { id: "C", text: "Alpine images automatically disable all network firewall restrictions" },
            { id: "D", text: "Alpine images include pre-installed PostgreSQL and Redis servers" }
          ],
          correctAnswer: "A",
          explanationNote: "Alpine Linux provides an ultra-minimal footprint (<10MB), drastically decreasing image sizes, build times, and security vulnerability attack surface."
        }
      },
      {
        heading: "WORKDIR and COPY Best Practices",
        text: "WORKDIR sets the working directory for subsequent instructions. Copy `package.json` first before application source code to take full advantage of Docker layer caching.",
        codeSnippet: `WORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .`,
        mcq: {
          id: "q-12.2-1-v1",
          question: "Why is it a Docker best practice to copy `package*.json` and run `npm ci` before copying the rest of the application files (`COPY . .`)?",
          options: [
            { id: "A", text: "To utilize Docker layer caching so npm dependencies are not reinstalled when only source code files change" },
            { id: "B", text: "Because npm ci deletes all other files in the working directory if they exist beforehand" },
            { id: "C", text: "Because COPY . . cannot copy JSON files by default" },
            { id: "D", text: "Docker requires npm packages to be stored in the root filesystem" }
          ],
          correctAnswer: "A",
          explanationNote: "Docker caches instruction layers. If `package.json` hasn't changed, Docker reuses the cached dependency layer, accelerating rebuilds."
        },
        retestMcq: {
          id: "q-12.2-1-v2",
          question: "What occurs if you specify `WORKDIR /app` in a Dockerfile when the directory `/app` does not exist yet?",
          options: [
            { id: "A", text: "Docker automatically creates the directory `/app` and sets it as the active working context" },
            { id: "B", text: "The build fails immediately with a DirectoryNotFound exception" },
            { id: "C", text: "Docker mounts the host machine root directory as read-only" },
            { id: "D", text: "The instruction is ignored and `/` remains the active working directory" }
          ],
          correctAnswer: "A",
          explanationNote: "If the target directory for `WORKDIR` does not exist, Docker creates it automatically for subsequent instructions."
        }
      },
      {
        heading: "The .dockerignore File",
        text: "A `.dockerignore` file prevents unwanted files (like `node_modules`, `.git`, `.env`) from being copied into the Docker image, shrinking build context and protecting secrets.",
        codeSnippet: `node_modules\n.git\n.env\ndist`,
        mcq: {
          id: "q-12.2-2-v1",
          question: "What is the primary danger of failing to include `node_modules` in a `.dockerignore` file when building a Node.js Docker image?",
          options: [
            { id: "A", text: "Host-platform specific binaries might be copied into the container, breaking execution on Linux containers and inflating build context size" },
            { id: "B", text: "Docker will refuse to start the build daemon without an empty node_modules" },
            { id: "C", text: "The container will delete the host computer's local node_modules folder" },
            { id: "D", text: "NPM will crash because multiple versions cannot coexist in git" }
          ],
          correctAnswer: "A",
          explanationNote: "Ignoring `node_modules` prevents bloated build contexts and ensures native compiled packages (like bcrypt) are built cleanly for the container's Linux OS."
        },
        retestMcq: {
          id: "q-12.2-2-v2",
          question: "Which file should ALWAYS be listed in `.dockerignore` to prevent accidental credential leakage in container images?",
          options: [
            { id: "A", text: ".env (or any file containing local secrets, private API keys, and environment variables)" },
            { id: "B", text: "package.json" },
            { id: "C", text: "Dockerfile" },
            { id: "D", text: "index.js" }
          ],
          correctAnswer: "A",
          explanationNote: "Local `.env` files should never be committed into image layers; environment configuration should be passed securely at container runtime."
        }
      },
      {
        heading: "RUN vs CMD vs ENTRYPOINT",
        text: "RUN executes during the image build process to commit a new layer; `CMD` provides the default command executed when the container starts running at runtime.",
        codeSnippet: `RUN npm ci --only=production\nEXPOSE 3000\nCMD ["node", "index.js"]`,
        mcq: {
          id: "q-12.2-3-v1",
          question: "What is the fundamental difference between `RUN` and `CMD` in a Dockerfile?",
          options: [
            { id: "A", text: "`RUN` executes commands at build time to produce image layers, whereas `CMD` defines the default runtime command when starting a container" },
            { id: "B", text: "`CMD` runs during docker build, while `RUN` only triggers on docker run" },
            { id: "C", text: "`RUN` is used for frontend applications, while `CMD` is only for backend databases" },
            { id: "D", text: "`RUN` can only be declared once per Dockerfile, while `CMD` can appear on every line" }
          ],
          correctAnswer: "A",
          explanationNote: "`RUN` runs during image build to install packages and configure files. `CMD` specifies the executable command launched when the container runs."
        },
        retestMcq: {
          id: "q-12.2-3-v2",
          question: "What happens if a Dockerfile contains multiple `CMD` instructions?",
          options: [
            { id: "A", text: "Only the last `CMD` instruction in the Dockerfile will take effect" },
            { id: "B", text: "All `CMD` commands are executed concurrently in parallel threads" },
            { id: "C", text: "The Docker build engine throws a fatal syntax validation error" },
            { id: "D", text: "Docker executes them sequentially in alphabetical order" }
          ],
          correctAnswer: "A",
          explanationNote: "Only the final `CMD` instruction in a Dockerfile takes effect. Earlier `CMD` statements are overridden."
        }
      },
      {
        heading: "Building and Tagging Images",
        text: "Build a Docker image with `docker build -t <image-name>:<tag> <build-context-path>`. Tags like `:v1.0` or `:latest` allow tracking image version releases.",
        codeSnippet: `docker build -t backend-api:1.0 .\ndocker run -p 3001:3001 backend-api:1.0`,
        mcq: {
          id: "q-12.2-4-v1",
          question: "In the command `docker build -t fullstack-app:v1 .`, what does the trailing dot (`.`) signify?",
          options: [
            { id: "A", text: "The build context directory (current directory) sent to the Docker daemon to resolve COPY and ADD commands" },
            { id: "B", text: "A command flag instructing Docker to hide terminal build progress" },
            { id: "C", text: "A shortcut telling Docker to delete previous untagged images" },
            { id: "D", text: "An indicator that the image should be pushed to Docker Hub immediately" }
          ],
          correctAnswer: "A",
          explanationNote: "The trailing dot defines the build context path sent to the Docker daemon so `COPY` instructions can access local files."
        },
        retestMcq: {
          id: "q-12.2-4-v2",
          question: "If you run `docker build -t my-service .` without specifying an explicit tag, what default tag does Docker assign?",
          options: [
            { id: "A", text: ":latest" },
            { id: "B", text: ":default" },
            { id: "C", text: ":1.0.0" },
            { id: "D", text: ":master" }
          ],
          correctAnswer: "A",
          explanationNote: "When no explicit tag is supplied, Docker automatically applies the default tag `:latest`."
        }
      },
      {
        heading: "Container Security & Non-Root Users",
        text: "By default, processes in containers run as `root`. For production security, switch to a non-privileged user (e.g. `USER node`) to prevent privilege escalation.",
        codeSnippet: `FROM node:20-alpine\nWORKDIR /app\nCOPY --chown=node:node . .\nUSER node\nCMD ["node", "index.js"]`,
        mcq: {
          id: "q-12.2-5-v1",
          question: "Why is it strongly recommended to declare `USER node` (or a non-root user) in production Dockerfiles?",
          options: [
            { id: "A", text: "To follow the principle of least privilege, preventing potential container breakout attacks from obtaining host root access" },
            { id: "B", text: "Because Node.js refuses to start on Linux if executed by the root user" },
            { id: "C", text: "Because root processes are automatically throttled by the Docker engine CPU scheduler" },
            { id: "D", text: "Because npm commands fail with permission errors unless run as a non-root user" }
          ],
          correctAnswer: "A",
          explanationNote: "Adhering to least privilege by running as non-root mitigates the risk of an attacker escaping the container with root permissions on the host."
        },
        retestMcq: {
          id: "q-12.2-5-v2",
          question: "What does the `--chown=node:node` flag in `COPY --chown=node:node . .` accomplish?",
          options: [
            { id: "A", text: "Assigns file ownership to the `node` user and group during copy, allowing the non-root process to read and write them" },
            { id: "B", text: "Encrypts copied files with a proprietary node hash" },
            { id: "C", text: "Deletes file permissions on the host system permanently" },
            { id: "D", text: "Ensures files can only be accessed across localhost network sockets" }
          ],
          correctAnswer: "A",
          explanationNote: "`--chown=node:node` grants the unprivileged `node` user ownership over copied files inside the container."
        }
      }
    ]
  },
  {
    id: "12-3-multi-stage-builds",
    number: "12.3",
    title: "Multi-Stage Builds & Optimization",
    subtitle: "Separate compilation environments from minimal runtime images, shrinking image size from 1GB to 25MB.",
    readTime: "14 min",
    objectives: [
      "Identify the causes of bloated production images",
      "Write multi-stage Dockerfiles with named build stages (AS builder)",
      "Extract compiled static assets to Nginx alpine images",
      "Omit devDependencies in backend Node.js production containers",
      "Target specific stages for automated testing in CI/CD"
    ],
    theoryBlocks: [
      {
        heading: "The Problem of Bloated Images",
        text: "Building frontend assets (e.g. Vite/React) or compiling TypeScript requires heavy tools (compilers, devDependencies) that are unnecessary at runtime and bloat image sizes.",
        codeSnippet: `# Single-stage build: Bloated 1GB+ image\nFROM node:20\nWORKDIR /app\nCOPY . .\nRUN npm install && npm run build`,
        mcq: {
          id: "q-12.3-0-v1",
          question: "Why is a single-stage Dockerfile that builds a Vite or React Single Page Application suboptimal for production?",
          options: [
            { id: "A", text: "It includes compilers, build tools, source code, and full devDependencies in the final image, drastically bloating image size and security surface" },
            { id: "B", text: "Because React applications cannot render inside Docker containers without an active compiler" },
            { id: "C", text: "Because Vite will not produce production bundles inside Linux containers" },
            { id: "D", text: "Single-stage Dockerfiles cannot expose port 80" }
          ],
          correctAnswer: "A",
          explanationNote: "Single-stage builds package all intermediate build tools, source code, and large devDependencies into the final production image."
        },
        retestMcq: {
          id: "q-12.3-0-v2",
          question: "What is the primary benefit of multi-stage Docker builds?",
          options: [
            { id: "A", text: "Separating the build environment from the runtime environment, copying only compiled production artifacts into a minimal final image" },
            { id: "B", text: "Allowing Docker to run multiple operating systems concurrently in a single container" },
            { id: "C", text: "Enabling a container to connect to multiple Docker networks simultaneously" },
            { id: "D", text: "Automatically converting JavaScript code to binary assembly language" }
          ],
          correctAnswer: "A",
          explanationNote: "Multi-stage builds permit using heavy compiler stages to produce artifacts, then copying only the finalized static assets into a lean runtime image."
        }
      },
      {
        heading: "Multi-Stage Syntax with AS",
        text: "Name intermediate stages with `FROM <image> AS <stage_name>`, then use `COPY --from=<stage_name>` to extract only built artifacts into the clean final stage.",
        codeSnippet: `FROM node:20-alpine AS build-stage\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM nginx:1.25-alpine\nCOPY --from=build-stage /app/dist /usr/share/nginx/html`,
        mcq: {
          id: "q-12.3-1-v1",
          question: "In a multi-stage Dockerfile, what does the instruction `COPY --from=build-stage /app/dist /usr/share/nginx/html` do?",
          options: [
            { id: "A", text: "Copies compiled static files from the intermediate build stage into Nginx's web root directory in the final image" },
            { id: "B", text: "Copies files directly from the host computer's desktop into the container" },
            { id: "C", text: "Uploads the build-stage files to an external cloud storage bucket" },
            { id: "D", text: "Deletes the /app/dist directory to free up container RAM" }
          ],
          correctAnswer: "A",
          explanationNote: "`COPY --from=<stage>` pulls only the necessary built files from the named intermediate stage, discarding node, npm, and devDependencies."
        },
        retestMcq: {
          id: "q-12.3-1-v2",
          question: "Which of the following images is present in the final deployed container from the snippet above?",
          options: [
            { id: "A", text: "Only `nginx:1.25-alpine` containing the copied static HTML/JS files" },
            { id: "B", text: "Both `node:20-alpine` and `nginx:1.25-alpine` running side-by-side" },
            { id: "C", text: "A combined dual-kernel Linux operating system image" },
            { id: "D", text: "The `build-stage` image with Nginx installed on top of Node.js" }
          ],
          correctAnswer: "A",
          explanationNote: "Only the final stage produces the deployed container image; the intermediate build stage is discarded after extraction."
        }
      },
      {
        heading: "Multi-Stage Node.js Backend Builds",
        text: "For TypeScript or compiled backend apps, compile in a build stage, run `npm ci --omit=dev` in a fresh stage, and copy both production `node_modules` and compiled JS.",
        codeSnippet: `FROM node:20-alpine AS builder\nWORKDIR /app\nCOPY . .\nRUN npm ci && npm run build\n\nFROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --omit=dev\nCOPY --from=builder /app/dist ./dist\nUSER node\nCMD ["node", "dist/index.js"]`,
        mcq: {
          id: "q-12.3-2-v1",
          question: "What is the purpose of running `npm ci --omit=dev` in the final runtime stage of a Node.js backend Dockerfile?",
          options: [
            { id: "A", text: "Installs strictly production runtime dependencies, excluding heavy devDependencies like TypeScript, linters, and test frameworks" },
            { id: "B", text: "Deletes all existing packages from npm registry" },
            { id: "C", text: "Skips checking package-lock.json integrity" },
            { id: "D", text: "Converts all JavaScript code into compiled C++ binary add-ons" }
          ],
          correctAnswer: "A",
          explanationNote: "`npm ci --omit=dev` installs only production dependencies, keeping the final container image lightweight."
        },
        retestMcq: {
          id: "q-12.3-2-v2",
          question: "Why is TypeScript source code (`.ts` files) typically excluded from the final production container image?",
          options: [
            { id: "A", text: "Node.js natively executes the compiled JavaScript in `dist/`, rendering `.ts` files and the TypeScript compiler unnecessary at runtime" },
            { id: "B", text: "TypeScript syntax is illegal in production Linux containers" },
            { id: "C", text: "Docker cannot parse files with the `.ts` extension" },
            { id: "D", text: "Because TypeScript files automatically leak database credentials" }
          ],
          correctAnswer: "A",
          explanationNote: "Once compiled, Node.js only needs standard JavaScript (`dist/*.js`) and production modules to execute."
        }
      },
      {
        heading: "Minimizing Layer Counts & Chaining RUNs",
        text: "Each `RUN`, `COPY`, and `ADD` creates a new filesystem layer. Chain related shell commands with `&&` and clean package caches in the same command to minimize layer size.",
        codeSnippet: `RUN apt-get update && apt-get install -y --no-install-recommends \\\n    curl ca-certificates \\\n && rm -rf /var/lib/apt/lists/*`,
        mcq: {
          id: "q-12.3-3-v1",
          question: "Why is `rm -rf /var/lib/apt/lists/*` included in the same `RUN` command as `apt-get install` instead of a separate subsequent `RUN` instruction?",
          options: [
            { id: "A", text: "If run in a subsequent layer, the package cache remains permanently saved in the previous layer, failing to reduce total image size" },
            { id: "B", text: "Because apt-get install will fail unless the cache is deleted simultaneously" },
            { id: "C", text: "Docker terminates builds if two RUN commands execute back-to-back" },
            { id: "D", text: "To prevent apt from uninstalling the packages it just downloaded" }
          ],
          correctAnswer: "A",
          explanationNote: "Because Docker layers are immutable, cleaning caches in subsequent layers does not reduce total image size; cleanup must occur in the same command."
        },
        retestMcq: {
          id: "q-12.3-3-v2",
          question: "What is the effect of chaining shell commands with `&&` in a Dockerfile `RUN` instruction?",
          options: [
            { id: "A", text: "Executes commands sequentially, halting immediately if any command fails, and consolidates all changes into a single layer" },
            { id: "B", text: "Executes all commands concurrently in parallel subshells regardless of errors" },
            { id: "C", text: "Splits the single line into multiple separate Docker image layers" },
            { id: "D", text: "Translates Unix bash commands into Windows PowerShell equivalents" }
          ],
          correctAnswer: "A",
          explanationNote: "`&&` ensures commands execute in sequence and only proceeds if the previous command succeeded, compressing file changes into a single layer."
        }
      },
      {
        heading: "Targeting Stages for Development & Testing",
        text: "You can target specific intermediate stages with `docker build --target <stage_name>` to run tests or debug without building the entire production image.",
        codeSnippet: `docker build --target test-stage -t app-tests .\ndocker run --rm app-tests npm test`,
        mcq: {
          id: "q-12.3-4-v1",
          question: "How can you instruct Docker to stop building after a specific intermediate stage named `test` in a multi-stage Dockerfile?",
          options: [
            { id: "A", text: "docker build --target test -t my-app-test ." },
            { id: "B", text: "docker build --stop-at test ." },
            { id: "C", text: "docker build --stage test -f Dockerfile ." },
            { id: "D", text: "docker run --until test ." }
          ],
          correctAnswer: "A",
          explanationNote: "The `--target` flag instructs Docker to build only up to the named stage, allowing CI pipelines to run unit/integration tests without assembling production images."
        },
        retestMcq: {
          id: "q-12.3-4-v2",
          question: "What happens to stages defined AFTER the targeted stage when running `docker build --target test .`?",
          options: [
            { id: "A", text: "They are skipped completely and not built or evaluated" },
            { id: "B", text: "They are built in the background and cached for later" },
            { id: "C", text: "Docker throws an unfinished pipeline warning" },
            { id: "D", text: "They overwrite the target stage output" }
          ],
          correctAnswer: "A",
          explanationNote: "Docker halts execution after building the designated target stage, skipping all subsequent stages in the file."
        }
      },
      {
        heading: "Distroless & Scratch Images",
        text: "Google \"Distroless\" and Docker `FROM scratch` images contain only your application binary and runtime dependencies — no package managers or shells — maximizing security.",
        codeSnippet: `FROM gcr.io/distroless/nodejs20-debian12\nCOPY --from=build /app /app\nWORKDIR /app\nCMD ["server.js"]`,
        mcq: {
          id: "q-12.3-5-v1",
          question: "What is a key security characteristic of a \"Distroless\" container image?",
          options: [
            { id: "A", text: "It contains no package managers (apt, apk), shells (bash, sh), or standard OS utilities, denying attackers common exploit tools" },
            { id: "B", text: "It does not allow TCP/IP network connections to be opened" },
            { id: "C", text: "It automatically encrypts all source code files with AES-256" },
            { id: "D", text: "It cannot run on Linux host operating systems" }
          ],
          correctAnswer: "A",
          explanationNote: "Distroless images omit shells and package managers, denying attackers standard utilities even if an application vulnerability is compromised."
        },
        retestMcq: {
          id: "q-12.3-5-v2",
          question: "Why might debugging a crashed container built on a Distroless image using `docker exec -it <container> sh` fail?",
          options: [
            { id: "A", text: "Because Distroless images deliberately omit `/bin/sh` and all terminal shell binaries" },
            { id: "B", text: "Because Distroless containers do not support standard output logs" },
            { id: "C", text: "Because docker exec only works on images based on Ubuntu" },
            { id: "D", text: "Because Distroless containers can only run in detached background mode" }
          ],
          correctAnswer: "A",
          explanationNote: "Because Distroless images omit shells entirely, attempting to spawn `/bin/sh` fails because the binary does not exist in the filesystem."
        }
      }
    ]
  },
  {
    id: "12-4-volumes-and-persistence",
    number: "12.4",
    title: "Volume Mounts & Data Persistence",
    subtitle: "Distinguish ephemeral storage from persistent volumes, use bind mounts for live code reloading, and configure read-only mounts.",
    readTime: "13 min",
    objectives: [
      "Understand ephemeral container writable layers",
      "Create and attach Docker Named Volumes for database storage",
      "Use Bind Mounts for live source code hot-reloading in local development",
      "Protect host configuration files with read-only mounts (:ro)",
      "Manage volume backups and pruning"
    ],
    theoryBlocks: [
      {
        heading: "Ephemeral Containers vs Persistent Storage",
        text: "By default, all data inside a container is ephemeral and destroyed when removed. Docker Volumes provide persistent, host-independent storage for databases and uploads.",
        codeSnippet: `docker volume create pg_data\ndocker volume ls\ndocker run -v pg_data:/var/lib/postgresql/data postgres:16`,
        mcq: {
          id: "q-12.4-0-v1",
          question: "What occurs to database records saved inside a PostgreSQL container that was started without any volumes attached when the container is deleted (`docker rm`)?",
          options: [
            { id: "A", text: "All database files and records are permanently lost with the deletion of the container's writable layer" },
            { id: "B", text: "Docker saves the database state to the host /tmp directory automatically" },
            { id: "C", text: "The database records are restored when a new container uses the same image" },
            { id: "D", text: "PostgreSQL automatically commits data to Docker Hub registry" }
          ],
          correctAnswer: "A",
          explanationNote: "Without volumes, all data written inside a container lives in its ephemeral layer and disappears permanently when the container is removed."
        },
        retestMcq: {
          id: "q-12.4-0-v2",
          question: "Where are Docker Named Volumes managed and stored by default on the host system?",
          options: [
            { id: "A", text: "In a dedicated storage area managed entirely by Docker (e.g. `/var/lib/docker/volumes/` on Linux)" },
            { id: "B", text: "Directly inside the root user's Downloads folder" },
            { id: "C", text: "On an external remote cloud drive configured by default" },
            { id: "D", text: "Inside the Git repository's `.git/objects` folder" }
          ],
          correctAnswer: "A",
          explanationNote: "Named volumes are isolated directories managed directly by the Docker daemon in its dedicated storage area."
        }
      },
      {
        heading: "Named Volumes vs Bind Mounts",
        text: "Named volumes are managed by Docker (ideal for databases); bind mounts link an exact host filesystem path into the container (ideal for live development hot-reloading).",
        codeSnippet: `# Named volume (production/DB)\ndocker run -v my_db_vol:/var/lib/mysql mysql\n\n# Bind mount (development code sync)\ndocker run -v $(pwd):/app -p 3000:3000 my-node-dev`,
        mcq: {
          id: "q-12.4-1-v1",
          question: "When is a Bind Mount preferred over a Docker Named Volume?",
          options: [
            { id: "A", text: "During local software development to mirror host source code into the container for instant hot-reloading without rebuilding images" },
            { id: "B", text: "When running high-concurrency production database clusters" },
            { id: "C", text: "When sharing sensitive cryptographic keys across unrelated host machines" },
            { id: "D", text: "When deploying container images to public cloud registries" }
          ],
          correctAnswer: "A",
          explanationNote: "Bind mounts directly link host directories into the container, allowing code edits on the host to immediately reflect inside the container."
        },
        retestMcq: {
          id: "q-12.4-1-v2",
          question: "What distinguishes the syntax of a Bind Mount from a Named Volume in the `-v` flag?",
          options: [
            { id: "A", text: "A bind mount uses an absolute or relative directory path (`./src:/app`), whereas a named volume uses a plain identifier name (`my-vol:/app`)" },
            { id: "B", text: "A bind mount requires the `--volume-bind` prefix keyword" },
            { id: "C", text: "Named volumes can only mount to read-only directories" },
            { id: "D", text: "Bind mounts only accept URLs and remote network shares" }
          ],
          correctAnswer: "A",
          explanationNote: "If the first argument starts with `/`, `./`, or `~/`, Docker treats it as a host path (bind mount); otherwise, it is interpreted as a named volume."
        }
      },
      {
        heading: "Read-Only Mounts for Security",
        text: "Append `:ro` to any volume or bind mount flag to prevent the container process from modifying or corrupting host files or shared configuration templates.",
        codeSnippet: `docker run -d \\\n  -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro \\\n  -p 80:80 nginx:alpine`,
        mcq: {
          id: "q-12.4-2-v1",
          question: "What does appending `:ro` to a volume flag like `-v $(pwd)/config.json:/app/config.json:ro` enforce?",
          options: [
            { id: "A", text: "Mounts the file or volume as Read-Only, preventing the container process from modifying the host file" },
            { id: "B", text: "Enforces root-only read permissions on the host system" },
            { id: "C", text: "Re-opens the file every time a network packet arrives" },
            { id: "D", text: "Limits memory allocation for that file to 1 Megabyte" }
          ],
          correctAnswer: "A",
          explanationNote: "The `:ro` flag mounts the directory or file as read-only, preventing any process inside the container from tampering with it."
        },
        retestMcq: {
          id: "q-12.4-2-v2",
          question: "Why is mounting configuration files as `:ro` a recommended security practice for web servers like Nginx?",
          options: [
            { id: "A", text: "It prevents compromised container web server processes from tampering with or overwriting host configuration files" },
            { id: "B", text: "It enables automatic TLS certificate generation" },
            { id: "C", text: "Nginx crashes if its configuration file is writable" },
            { id: "D", text: "It caches the entire file in CPU L1 cache" }
          ],
          correctAnswer: "A",
          explanationNote: "Read-only mounts prevent attackers who gain access to the web server process from overwriting server routing rules or configuration."
        }
      },
      {
        heading: "Handling node_modules in Bind Mounts",
        text: "When bind-mounting host code into a Node container, add an anonymous volume (`-v /app/node_modules`) to keep container-installed Linux dependencies from being overwritten by the host.",
        codeSnippet: `docker run -p 5173:5173 \\\n  -v $(pwd):/app \\\n  -v /app/node_modules \\\n  frontend-dev`,
        mcq: {
          id: "q-12.4-3-v1",
          question: "In local development, why is `-v /app/node_modules` (an anonymous volume) added alongside the bind mount `-v $(pwd):/app`?",
          options: [
            { id: "A", text: "It prevents the host machine's local `node_modules` from shadowing or overwriting the container-installed Linux `node_modules`" },
            { id: "B", text: "It downloads npm packages twice for redundancy" },
            { id: "C", text: "It forces Docker to delete the host machine's node_modules" },
            { id: "D", text: "It enables remote debugging via Chrome DevTools" }
          ],
          correctAnswer: "A",
          explanationNote: "Mounting an anonymous volume over `/app/node_modules` prevents the host's folder from replacing container-installed Linux dependencies."
        },
        retestMcq: {
          id: "q-12.4-3-v2",
          question: "How does Docker determine which mount takes precedence when overlapping directory paths are mounted?",
          options: [
            { id: "A", text: "The mount with the more specific (longer) destination path within the container takes precedence" },
            { id: "B", text: "The first flag declared in the command line always overrides subsequent flags" },
            { id: "C", text: "Docker combines files from both directories alphabetically" },
            { id: "D", text: "Docker halts execution and flags a path conflict error" }
          ],
          correctAnswer: "A",
          explanationNote: "Docker resolves overlapping mounts by giving precedence to the deeper/longer container destination path."
        }
      },
      {
        heading: "Backing Up and Migrating Docker Volumes",
        text: "Back up a Docker volume by attaching it alongside a temporary container that creates an archive `tar` file directed to a mounted host folder.",
        codeSnippet: `docker run --rm \\\n  -v pg_data:/volume \\\n  -v $(pwd):/backup \\\n  alpine tar -czf /backup/db_backup.tar.gz -C /volume .`,
        mcq: {
          id: "q-12.4-4-v1",
          question: "How does the command snippet above back up the data inside the named volume `pg_data`?",
          options: [
            { id: "A", text: "It mounts `pg_data` and the host directory into a disposable Alpine container that compresses the volume contents into a host tar.gz archive" },
            { id: "B", text: "It uploads the raw Docker volume directly to Docker Hub repository" },
            { id: "C", text: "It converts the PostgreSQL database into a MongoDB document collection" },
            { id: "D", text: "It creates a read-only snapshot image of the host filesystem" }
          ],
          correctAnswer: "A",
          explanationNote: "The temporary container attaches both the named volume and the host folder, compressing the data directly to the host filesystem."
        },
        retestMcq: {
          id: "q-12.4-4-v2",
          question: "Which Docker command cleans up all unused, unreferenced Docker volumes that are consuming host storage?",
          options: [
            { id: "A", text: "docker volume prune" },
            { id: "B", text: "docker clean --volumes" },
            { id: "C", text: "docker volume delete --all" },
            { id: "D", text: "docker rm -v --force" }
          ],
          correctAnswer: "A",
          explanationNote: "`docker volume prune` removes all local volumes not actively referenced by at least one container."
        }
      },
      {
        heading: "Volume Drivers and Cloud Storage",
        text: "Docker supports custom volume drivers (e.g. AWS EBS, Azure File, NFS), enabling container storage to persist across physical host machines in cloud clusters.",
        codeSnippet: `docker volume create --driver rexray/ebs \\\n  --name production_db_vol`,
        mcq: {
          id: "q-12.4-5-v1",
          question: "What is the key capability unlocked by using custom Docker Volume Drivers (such as cloud block storage plugins)?",
          options: [
            { id: "A", text: "Allowing volumes to exist independently of any single physical host machine, enabling data persistence when containers relocate across nodes in a cluster" },
            { id: "B", text: "Enabling containers to bypass operating system file permission checks" },
            { id: "C", text: "Allowing SQLite databases to operate with infinite write concurrency" },
            { id: "D", text: "Compressing video files automatically inside the container" }
          ],
          correctAnswer: "A",
          explanationNote: "Volume plugins connect containers to managed network storage (EBS, NFS), enabling persistence across node rescheduling."
        },
        retestMcq: {
          id: "q-12.4-5-v2",
          question: "Why are local default volumes insufficient for high-availability multi-node container orchestration platforms (like Kubernetes or Swarm)?",
          options: [
            { id: "A", text: "Because default local volumes only exist on the specific physical node where the container was originally launched" },
            { id: "B", text: "Because local volumes cannot store more than 512MB of data" },
            { id: "C", text: "Because local volumes only function with root-level containers" },
            { id: "D", text: "Because local volumes are erased every time the computer reboots" }
          ],
          correctAnswer: "A",
          explanationNote: "Default volumes reside on local disks; if an orchestrator reschedules a container to another host, local volumes on the previous node are inaccessible."
        }
      }
    ]
  },
  {
    id: "12-5-docker-compose-orchestration",
    number: "12.5",
    title: "Multi-Container Orchestration with Docker Compose",
    subtitle: "Orchestrate frontend, backend, and database containers declaratively with Compose, environment configs, and health checks.",
    readTime: "14 min",
    objectives: [
      "Author declarative compose.yaml application blueprints",
      "Configure services, build contexts, and environment variables",
      "Manage service dependencies with depends_on and health checks",
      "Retain database persistence with top-level volumes",
      "Rebuild modified services with docker compose up --build"
    ],
    theoryBlocks: [
      {
        heading: "Introduction to Docker Compose",
        text: "Docker Compose allows defining and running multi-container applications (e.g. React frontend, Node backend, PostgreSQL database) using a single declarative YAML file.",
        codeSnippet: `version: '3.8'\nservices:\n  app:\n    build: .\n    ports:\n      - "3000:3000"`,
        mcq: {
          id: "q-12.5-0-v1",
          question: "What is the main role of Docker Compose in modern full stack development?",
          options: [
            { id: "A", text: "Declaratively managing, networking, and launching multi-container application stacks with a single configuration file and command (`docker compose up`)" },
            { id: "B", text: "Replacing the Linux operating system kernel with Docker daemon" },
            { id: "C", text: "Writing frontend React components using YAML syntax" },
            { id: "D", text: "Deploying serverless functions without containers" }
          ],
          correctAnswer: "A",
          explanationNote: "Docker Compose replaces manual `docker run` scripts by declaratively launching and networking complete application stacks via YAML."
        },
        retestMcq: {
          id: "q-12.5-0-v2",
          question: "Which file name is the standard default recognized by modern Docker Compose commands?",
          options: [
            { id: "A", text: "compose.yaml (or docker-compose.yml)" },
            { id: "B", text: "docker.config.json" },
            { id: "C", text: "Containerfile.yml" },
            { id: "D", text: "Procfile.dev" }
          ],
          correctAnswer: "A",
          explanationNote: "Modern Docker Compose looks for `compose.yaml` or `docker-compose.yml` in the working directory by default."
        }
      },
      {
        heading: "Defining Services & Environment Variables",
        text: "Under `services:`, configure each container with its build context or image, exposed port mappings, volumes, and runtime environment variables or `.env` files.",
        codeSnippet: `services:\n  backend:\n    build: ./backend\n    ports:\n      - "3001:3001"\n    environment:\n      - PORT=3001\n      - DATABASE_URL=postgres://user:pass@db:5432/mydb\n    env_file:\n      - .env`,
        mcq: {
          id: "q-12.5-1-v1",
          question: "In the Docker Compose snippet above, how does the `backend` service connect over the network to the database container?",
          options: [
            { id: "A", text: "By using the service name `db` as the hostname in the connection URI (`@db:5432`)" },
            { id: "B", text: "By querying the public external IP address of the host machine router" },
            { id: "C", text: "By scanning localhost 127.0.0.1 inside the backend container" },
            { id: "D", text: "Docker Compose requires hardcoded MAC addresses for service communication" }
          ],
          correctAnswer: "A",
          explanationNote: "Docker Compose automatically sets up an internal bridge network where containers resolve sibling services by service name using embedded DNS."
        },
        retestMcq: {
          id: "q-12.5-1-v2",
          question: "What happens if an environment variable is defined in both `.env` file and directly under the `environment:` section in `docker-compose.yml`?",
          options: [
            { id: "A", text: "The value in `environment:` takes precedence and overrides the value in `.env`" },
            { id: "B", text: "The `.env` file always overrides the Compose file" },
            { id: "C", text: "Docker Compose throws a duplicate variable syntax error" },
            { id: "D", text: "The two values are concatenated with a hyphen" }
          ],
          correctAnswer: "A",
          explanationNote: "In Compose variable precedence, variables explicitly listed in the `environment:` block override values from `.env` files."
        }
      },
      {
        heading: "Service Dependencies with depends_on",
        text: "Use `depends_on` to dictate container startup order (e.g. ensure the PostgreSQL database container starts before the Node.js API backend service launches).",
        codeSnippet: `services:\n  backend:\n    build: ./backend\n    depends_on:\n      db:\n        condition: service_healthy\n  db:\n    image: postgres:16-alpine`,
        mcq: {
          id: "q-12.5-2-v1",
          question: "Why is using `depends_on` with `condition: service_healthy` superior to standard `depends_on`?",
          options: [
            { id: "A", text: "It waits until the dependency has actually passed its internal health check (e.g. database is ready to accept connections), rather than just starting the container process" },
            { id: "B", text: "It restarts the computer if the database fails to boot" },
            { id: "C", text: "It automatically creates the SQL database schema" },
            { id: "D", text: "It bypasses password authentication for local development" }
          ],
          correctAnswer: "A",
          explanationNote: "Databases often take time to initialize. `condition: service_healthy` waits until the DB is genuinely accepting connections before starting dependent apps."
        },
        retestMcq: {
          id: "q-12.5-2-v2",
          question: "What is the command to run an entire Docker Compose stack in detached mode in the background?",
          options: [
            { id: "A", text: "docker compose up -d" },
            { id: "B", text: "docker compose start --background" },
            { id: "C", text: "docker compose run -detach" },
            { id: "D", text: "docker compose launch -b" }
          ],
          correctAnswer: "A",
          explanationNote: "`docker compose up -d` builds, creates, and starts all stack containers in background detached mode."
        }
      },
      {
        heading: "Persistent Volumes in Docker Compose",
        text: "Declare top-level `volumes:` in Compose to define persistent named volumes shared across services or retained across `docker compose down` teardowns.",
        codeSnippet: `services:\n  db:\n    image: postgres:16-alpine\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n\nvolumes:\n  pgdata:`,
        mcq: {
          id: "q-12.5-3-v1",
          question: "What happens to the named volume `pgdata` when executing `docker compose down`?",
          options: [
            { id: "A", text: "The volume and its data are preserved and will be re-attached the next time `docker compose up` is run" },
            { id: "B", text: "The volume and all its stored data are permanently deleted by default" },
            { id: "C", text: "The volume is compressed and uploaded to Docker Hub" },
            { id: "D", text: "Docker Compose moves the data into host RAM cache" }
          ],
          correctAnswer: "A",
          explanationNote: "`docker compose down` removes containers and networks but preserves declared named volumes unless `-v` is explicitly passed."
        },
        retestMcq: {
          id: "q-12.5-3-v2",
          question: "Which command explicitly tears down containers, networks, AND deletes all declared named volumes?",
          options: [
            { id: "A", text: "docker compose down -v" },
            { id: "B", text: "docker compose destroy --purge" },
            { id: "C", text: "docker compose reset --all" },
            { id: "D", text: "docker compose drop -f" }
          ],
          correctAnswer: "A",
          explanationNote: "Adding `-v` (`--volumes`) to `docker compose down` removes declared named volumes along with containers."
        }
      },
      {
        heading: "Rebuilding Images with Compose",
        text: "When modifying source code or Dockerfiles, use `docker compose up --build` or `docker compose build` to force Docker to rebuild changed image layers.",
        codeSnippet: `docker compose up --build\ndocker compose build --no-cache backend`,
        mcq: {
          id: "q-12.5-4-v1",
          question: "Why might changes to your backend source code not appear when you re-run `docker compose up`?",
          options: [
            { id: "A", text: "If an image already exists locally, `docker compose up` reuses the existing cached image unless the `--build` flag is specified" },
            { id: "B", text: "Docker Compose can only run pre-compiled images from Docker Hub" },
            { id: "C", text: "You must always restart the host operating system to update code" },
            { id: "D", text: "Source code cannot be edited once a Dockerfile is saved" }
          ],
          correctAnswer: "A",
          explanationNote: "By default, `docker compose up` uses existing built images. Adding `--build` forces Compose to rebuild images from modified source code."
        },
        retestMcq: {
          id: "q-12.5-4-v2",
          question: "What is the command to view live streaming logs from only a specific service named \"backend\" in Compose?",
          options: [
            { id: "A", text: "docker compose logs -f backend" },
            { id: "B", text: "docker compose tail backend" },
            { id: "C", text: "docker compose cat -s backend" },
            { id: "D", text: "docker compose watch --log backend" }
          ],
          correctAnswer: "A",
          explanationNote: "`docker compose logs -f <service>` filters output to the specified service and follows real-time log output."
        }
      },
      {
        heading: "Multiple Compose Files for Environments",
        text: "Use compose file overrides (`docker-compose.override.yml` or `-f docker-compose.prod.yml`) to cleanly separate development settings (bind mounts) from production configurations.",
        codeSnippet: `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d`,
        mcq: {
          id: "q-12.5-5-v1",
          question: "What is the purpose of using multiple Compose files (e.g. `docker-compose.yml` and `docker-compose.prod.yml`)?",
          options: [
            { id: "A", text: "To keep a common base configuration while overlaying environment-specific settings (like development hot-reloading vs production replicas and secrets)" },
            { id: "B", text: "Because Compose files are limited to a maximum of 50 lines each" },
            { id: "C", text: "To allow frontend and backend containers to run on separate Linux kernels" },
            { id: "D", text: "Because Docker does not allow using YAML for production" }
          ],
          correctAnswer: "A",
          explanationNote: "Layering compose files enables sharing a common base configuration while customizing ports, mounts, and secrets per environment."
        },
        retestMcq: {
          id: "q-12.5-5-v2",
          question: "What file does Docker Compose automatically merge with `docker-compose.yml` by default without needing the `-f` flag?",
          options: [
            { id: "A", text: "docker-compose.override.yml" },
            { id: "B", text: "docker-compose.dev.yml" },
            { id: "C", text: "docker-compose.local.yml" },
            { id: "D", text: "override.config.json" }
          ],
          correctAnswer: "A",
          explanationNote: "Docker Compose automatically detects and merges `docker-compose.override.yml` on top of `docker-compose.yml` when executed."
        }
      }
    ]
  },
  {
    id: "12-6-networking-and-capstone",
    number: "12.6",
    title: "Container Networking, Reverse Proxy & Capstone",
    subtitle: "Configure bridge networks, reverse proxy with Nginx, harden container security, and deploy production full-stack architectures.",
    readTime: "15 min",
    objectives: [
      "Master Docker bridge network isolation and internal DNS resolution",
      "Route /api and frontend SPA traffic through an Nginx reverse proxy",
      "Implement Docker HEALTHCHECK diagnostics for automated recovery",
      "Enforce read-only filesystems and resource limits",
      "Synthesize complete full-stack container pipelines"
    ],
    theoryBlocks: [
      {
        heading: "Docker Network Drivers",
        text: "Docker offers network drivers: `bridge` (default isolated private container network), `host` (shares host network stack directly), and `none` (completely isolates container).",
        codeSnippet: `docker network ls\ndocker network create my-net\ndocker run --network my-net --name api my-image`,
        mcq: {
          id: "q-12.6-0-v1",
          question: "What is the default network driver used when launching standalone Docker containers or user-defined networks?",
          options: [
            { id: "A", text: "bridge network, creating an isolated private internal software bridge on the host" },
            { id: "B", text: "host network, giving every container full unfiltered access to host interfaces" },
            { id: "C", text: "overlay network, spanning multiple physical data centers" },
            { id: "D", text: "none network, blocking all incoming and outgoing connections" }
          ],
          correctAnswer: "A",
          explanationNote: "The `bridge` driver creates a software bridge network allowing containers on the same bridge to communicate while isolating them from the outside world."
        },
        retestMcq: {
          id: "q-12.6-0-v2",
          question: "What advantage do custom user-defined bridge networks have over the default `bridge` network in Docker?",
          options: [
            { id: "A", text: "User-defined bridge networks provide automatic internal DNS resolution by container name, whereas the default bridge only resolves by IP" },
            { id: "B", text: "User-defined bridges disable SSL encryption for faster throughput" },
            { id: "C", text: "User-defined bridges allow containers to run without root permissions on Windows" },
            { id: "D", text: "User-defined bridges do not consume any CPU memory" }
          ],
          correctAnswer: "A",
          explanationNote: "User-defined bridge networks enable automatic DNS resolution by container/service name, eliminating the need for hardcoded IP addresses."
        }
      },
      {
        heading: "DNS Discovery and Service Communication",
        text: "Inside a user-defined network, containers resolve sibling containers using their container or service name (e.g. `http://backend:3001`), eliminating hardcoded IP addresses.",
        codeSnippet: `# Inside frontend Nginx proxy configuration:\nproxy_pass http://backend:3001/api;`,
        mcq: {
          id: "q-12.6-1-v1",
          question: "Why should you NEVER use hardcoded container IP addresses (e.g. `172.17.0.2`) to communicate between containers?",
          options: [
            { id: "A", text: "Container IP addresses are dynamically assigned upon startup and can change whenever containers restart or recreate" },
            { id: "B", text: "Docker blocks HTTP requests directed at IPv4 addresses" },
            { id: "C", text: "IP addresses can only be used by database containers" },
            { id: "D", text: "Hardcoded IP addresses cause physical network card overheating" }
          ],
          correctAnswer: "A",
          explanationNote: "Container IP addresses are dynamically allocated at launch. Using container service names leverages Docker DNS for resilient routing."
        },
        retestMcq: {
          id: "q-12.6-1-v2",
          question: "What IP address does `localhost` refer to when executed inside a running container?",
          options: [
            { id: "A", text: "The loopback network interface of that specific container itself, NOT the host computer" },
            { id: "B", text: "The host operating system gateway address" },
            { id: "C", text: "The default router IP address of the local Wi-Fi network" },
            { id: "D", text: "The public IP address of the internet service provider" }
          ],
          correctAnswer: "A",
          explanationNote: "`localhost` inside a container refers to the container's own network namespace, not the host machine or other containers."
        }
      },
      {
        heading: "Reverse Proxy with Nginx",
        text: "In production, place an Nginx reverse proxy in front of frontend and backend services to expose a single public port (80/443), routing `/api` requests to backend and `/` to frontend.",
        codeSnippet: `server {\n  listen 80;\n  location / {\n    proxy_pass http://frontend:80;\n  }\n  location /api/ {\n    proxy_pass http://backend:3001;\n  }\n}`,
        mcq: {
          id: "q-12.6-2-v1",
          question: "What major architecture and security benefit is achieved by placing an Nginx reverse proxy container in front of frontend and backend services?",
          options: [
            { id: "A", text: "Only port 80/443 needs to be publicly exposed on the host, preventing CORS issues and keeping internal backend and database ports hidden from the public internet" },
            { id: "B", text: "Nginx automatically compiles TypeScript into web assembly" },
            { id: "C", text: "It eliminates the need for database storage entirely" },
            { id: "D", text: "It forces the browser to run in headless background mode" }
          ],
          correctAnswer: "A",
          explanationNote: "An Nginx reverse proxy unifies frontend and backend under a single domain, eliminates CORS issues, and hides internal backend/DB ports."
        },
        retestMcq: {
          id: "q-12.6-2-v2",
          question: "When using an Nginx reverse proxy container, which containers need their ports exposed to the host machine via `-p` or `ports:` in Compose?",
          options: [
            { id: "A", text: "Only the Nginx reverse proxy container (e.g. port 80/443)" },
            { id: "B", text: "Every container (frontend, backend, database, and proxy) must expose public ports" },
            { id: "C", text: "Only the backend database container" },
            { id: "D", text: "No containers can expose ports in a reverse proxy setup" }
          ],
          correctAnswer: "A",
          explanationNote: "Only the reverse proxy needs host port binding (80/443). Internal services communicate across private networks without exposing extra ports."
        }
      },
      {
        heading: "Container Health Checks",
        text: "Add `HEALTHCHECK` to your Dockerfile to let Docker and orchestrators monitor whether an application is genuinely responsive or hung, auto-restarting unhealthy containers.",
        codeSnippet: `HEALTHCHECK --interval=30s --timeout=3s --retries=3 \\\n  CMD curl -f http://localhost:3001/health || exit 1`,
        mcq: {
          id: "q-12.6-3-v1",
          question: "What is the purpose of the `HEALTHCHECK` instruction in a production Dockerfile?",
          options: [
            { id: "A", text: "Periodically runs a diagnostic probe to verify the application inside is actively responding to requests, marking the container unhealthy if it fails" },
            { id: "B", text: "Checks the host operating system battery level and CPU temperature" },
            { id: "C", text: "Scans source code for known npm vulnerabilities" },
            { id: "D", text: "Validates that SSL certificates have not expired" }
          ],
          correctAnswer: "A",
          explanationNote: "`HEALTHCHECK` periodically verifies that the application inside the container is responding, allowing orchestrators to restart hung containers."
        },
        retestMcq: {
          id: "q-12.6-3-v2",
          question: "What exit code must the `HEALTHCHECK` command return to indicate that the container is healthy?",
          options: [
            { id: "A", text: "Exit code 0 indicates success (healthy); exit code 1 indicates failure (unhealthy)" },
            { id: "B", text: "Exit code 200 HTTP OK" },
            { id: "C", text: "Exit code -1" },
            { id: "D", text: "Exit code 404" }
          ],
          correctAnswer: "A",
          explanationNote: "In Docker health checks, exit code 0 signifies healthy, and exit code 1 signifies unhealthy."
        }
      },
      {
        heading: "Container Security Hardening",
        text: "Harden production containers by using read-only root filesystems (`--read-only`), dropping Linux capabilities (`--cap-drop=ALL`), and enforcing strict memory/CPU limits.",
        codeSnippet: `services:\n  backend:\n    image: my-app:prod\n    read_only: true\n    tmpfs:\n      - /tmp\n    deploy:\n      resources:\n        limits:\n          cpus: '0.50'\n          memory: 512M`,
        mcq: {
          id: "q-12.6-4-v1",
          question: "What is the security advantage of configuring `read_only: true` on a container's root filesystem in Docker Compose?",
          options: [
            { id: "A", text: "Prevents any malicious payload or attacker from writing, modifying, or executing new binaries on the container file system" },
            { id: "B", text: "Accelerates hard drive read speeds by disabling filesystem indexing" },
            { id: "C", text: "Forces all console log outputs to be encrypted with PGP keys" },
            { id: "D", text: "Prevents developers from reading environment variables" }
          ],
          correctAnswer: "A",
          explanationNote: "A read-only root filesystem prevents attackers who exploit an application vulnerability from creating malicious scripts or replacing binaries."
        },
        retestMcq: {
          id: "q-12.6-4-v2",
          question: "Why should CPU and memory limits (`limits: memory: 512M`) be explicitly defined for production containers?",
          options: [
            { id: "A", text: "To prevent a single runaway container or memory leak from starving the host OS and crashing other containers on the same server" },
            { id: "B", text: "Because Docker terminates containers that use less than their allocated limit" },
            { id: "C", text: "To lower the monthly cost of Docker Hub subscriptions" },
            { id: "D", text: "Because Linux cannot allocate more than 512MB to Docker" }
          ],
          correctAnswer: "A",
          explanationNote: "Resource limits prevent rogue containers or memory leaks from starving the host system and causing out-of-memory kernel panics."
        }
      },
      {
        heading: "Part 12 Capstone & Full Container Pipeline",
        text: "In this capstone, you mastered containerization: multi-stage Dockerfiles, Docker Compose orchestrating React, Node, and PostgreSQL, and zero-downtime Nginx reverse proxying.",
        codeSnippet: `# Complete Stack Launch:\ndocker compose -f docker-compose.prod.yml up -d --build\ndocker compose ps\ndocker compose logs -f`,
        mcq: {
          id: "q-12.6-5-v1",
          question: "Which of the following describes a production-grade full stack containerized application architecture?",
          options: [
            { id: "A", text: "Nginx reverse proxy exposing port 80/443, routing to a multi-stage built React SPA and non-root Node.js API, with PostgreSQL persisting data via named volumes on an isolated internal network" },
            { id: "B", text: "Single monolithic Ubuntu container running SSH, Apache, Node, Vite dev server, and MySQL as root with all ports open publicly" },
            { id: "C", text: "Frontend running locally on developer laptop connecting directly to unencrypted database container over public IP" },
            { id: "D", text: "Virtual machines running inside a single container without volumes" }
          ],
          correctAnswer: "A",
          explanationNote: "A robust container architecture separates concerns: Nginx for reverse proxying, multi-stage non-root containers for frontend/backend, and persistent named volumes for databases."
        },
        retestMcq: {
          id: "q-12.6-5-v2",
          question: "What is the final step to cleanly stop and remove the entire production container stack and its internal networks while keeping your database records safe?",
          options: [
            { id: "A", text: "`docker compose down` (without the `-v` flag)" },
            { id: "B", text: "`docker kill $(docker ps -q)` followed by `rm -rf /`" },
            { id: "C", text: "`docker system prune -a --volumes`" },
            { id: "D", text: "`docker compose down --volumes --remove-orphans`" }
          ],
          correctAnswer: "A",
          explanationNote: "`docker compose down` without `-v` stops and removes containers and networks while leaving persistent database named volumes untouched."
        }
      }
    ]
  }
];

export function getActiveQuestionsForLevelFullstackPart12(
  section: SectionContent,
  studentId: string,
  isRetest: boolean = false
): McqQuestion[] {
  const attemptCount = getLevelAttemptCountFullstackPart12(section.id, studentId);
  const useRetest = isRetest || attemptCount > 0;

  return section.theoryBlocks.map((block) => {
    if (useRetest && block.retestMcq) {
      return block.retestMcq;
    }
    return block.mcq!;
  });
}

export function getLevelAttemptCountFullstackPart12(sectionId: string, studentId: string): number {
  try {
    const key = `dopilot_fullstack_p12_attempt_${studentId}_${sectionId}`;
    const val = localStorage.getItem(key);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

export function setLevelAttemptCountFullstackPart12(sectionId: string, studentId: string, count: number): void {
  try {
    const key = `dopilot_fullstack_p12_attempt_${studentId}_${sectionId}`;
    localStorage.setItem(key, count.toString());
  } catch {}
}

export function getConsecutiveFailedLevelsFullstackPart12(studentId: string): number {
  try {
    const key = `dopilot_fullstack_p12_failed_levels_streak_${studentId}`;
    const val = localStorage.getItem(key);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

export function setConsecutiveFailedLevelsFullstackPart12(studentId: string, streak: number): void {
  try {
    const key = `dopilot_fullstack_p12_failed_levels_streak_${studentId}`;
    localStorage.setItem(key, streak.toString());
  } catch {}
}

export function resetConsecutiveFailuresFullstackPart12(studentId: string): void {
  try {
    const key = `dopilot_fullstack_p12_failed_levels_streak_${studentId}`;
    const lockKey = `dopilot_fullstack_p12_locked_${studentId}`;
    localStorage.setItem(key, '0');
    localStorage.removeItem(lockKey);
  } catch {}
}

export function recordLevelAttemptResultFullstackPart12(
  sectionId: string,
  studentId: string,
  passed: boolean
): { isPassed: boolean; attemptCount: number; isSecondFailureInLevel: boolean; consecutiveFailedLevels: number; isLocked: boolean } {
  const currentAttempts = getLevelAttemptCountFullstackPart12(sectionId, studentId);
  const nextAttempts = currentAttempts + 1;
  setLevelAttemptCountFullstackPart12(sectionId, studentId, nextAttempts);

  let streak = getConsecutiveFailedLevelsFullstackPart12(studentId);

  if (passed) {
    streak = 0;
    setConsecutiveFailedLevelsFullstackPart12(studentId, 0);
    return {
      isPassed: true,
      attemptCount: nextAttempts,
      isSecondFailureInLevel: false,
      consecutiveFailedLevels: 0,
      isLocked: false
    };
  } else {
    streak += 1;
    setConsecutiveFailedLevelsFullstackPart12(studentId, streak);
    const isLocked = streak >= 3;
    if (isLocked) {
      try {
        localStorage.setItem(`dopilot_fullstack_p12_locked_${studentId}`, 'true');
      } catch {}
    }
    return {
      isPassed: false,
      attemptCount: nextAttempts,
      isSecondFailureInLevel: streak === 2,
      consecutiveFailedLevels: streak,
      isLocked
    };
  }
}
