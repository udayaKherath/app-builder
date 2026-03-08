<div align="center">

# 🤖 AgentForge

### *An AI-Powered Multi-Agent App Builder*

**Describe it. Build it. Ship it.**

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![LangGraph](https://img.shields.io/badge/LangGraph-0.2%2B-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white)](https://langchain-ai.github.io/langgraph/)
[![LangChain](https://img.shields.io/badge/LangChain-0.3%2B-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white)](https://langchain.com)
[![Groq](https://img.shields.io/badge/Groq-API-F55036?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge)](CONTRIBUTING.md)

---

*Give it a prompt like* `"create a calculator app"` *— and watch three specialized AI agents collaborate to plan, architect, and code a complete, working application.*

</div>

---

## ✨ What Is This?

**AgentForge** is a **multi-agent code generation system** built on [LangGraph](https://langchain-ai.github.io/langgraph/) and powered by [Groq's](https://groq.com) blazing-fast LLM inference. You provide a natural language description of an application; the system autonomously plans, designs, and implements it — writing every file to disk, ready to run.

> **Example**: Prompt → `"Create a todo list web app with local storage"` → Output → a fully structured project folder with `index.html`, `style.css`, `app.js`, and more.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        AgentForge System                        │
│                                                                 │
│   User Prompt                                                   │
│       │                                                         │
│       ▼                                                         │
│  ┌──────────┐     ┌──────────────┐     ┌──────────────────┐     │
│  │ Planner  │────▶│  Architect   │────▶│  Coder (ReAct)   │    │
│  │  Agent   │     │    Agent     │     │     Agent        │     │
│  └──────────┘     └──────────────┘     └──────────────────┘     │
│       │                 │                      │                │
│   Plan(schema)    TaskPlan(schema)        File I/O Tools        │
│                                          (loop until done)      │
│                                               │                 │
│                                               ▼                 │
│                                        📁 Output Folder         │
│                                     index.html / style.css /    │
│                                        app.js / ...             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Agent Workflow

The system is orchestrated as a **directed state graph** using LangGraph:

```
[START]
   │
   ▼
┌─────────────────────────────────────────────────────────┐
│  PLANNER AGENT                                          │
│  • Reads the user prompt                                │
│  • Produces a structured Plan (title, description,      │
│    tech stack, file list)                               │
└───────────────────────┬─────────────────────────────────┘
                        │  Plan
                        ▼
┌─────────────────────────────────────────────────────────┐
│  ARCHITECT AGENT                                        │
│  • Receives the Plan                                    │
│  • Breaks it into ordered implementation steps          │
│  • Assigns each step a file path + task description     │
│  • Outputs a TaskPlan                                   │
└───────────────────────┬─────────────────────────────────┘
                        │  TaskPlan
                        ▼
┌─────────────────────────────────────────────────────────┐
│  CODER AGENT  (ReAct Loop)                              │
│  • Iterates through each implementation step            │
│  • Uses read_file / write_file / list_files tools       │
│  • Writes one file per iteration                        │
│  • Loops until all steps are complete                   │
└───────────────────────┬─────────────────────────────────┘
                        │  status == "DONE"
                        ▼
                     [END]
```

### Conditional Loop Logic

The `coder` node loops back to itself until all implementation steps are exhausted:

```
coder ──▶ (status == "DONE"?) ──▶ YES ──▶ END
               │
               NO
               │
               └──▶ coder (next step)
```

---

## 📁 Project Structure

```
agentforge/
│
├── agent/
│   ├── graph.py          # LangGraph state graph definition & agent nodes
│   ├── states.py         # Pydantic state schemas (Plan, TaskPlan, CoderState)
│   ├── tools.py          # File I/O tools (read_file, write_file, list_files, etc.)
│   └── prompts.py        # Prompt templates for each agent
│
├── output/               # Generated apps are saved here
│   └── <app_name>/
│       ├── index.html
│       ├── style.css
│       └── app.js
│
├── .env                  # API keys (GROQ_API_KEY)
├── requirements.txt
└── README.md
```

---

## 🧠 Agent Details

### 1. 🗺️ Planner Agent
- **Input**: Raw user prompt string
- **Output**: Structured `Plan` (Pydantic model)
- **Responsibility**: High-level understanding — what to build, what tech stack to use, and what files will be needed.

### 2. 🏛️ Architect Agent
- **Input**: `Plan`
- **Output**: `TaskPlan` with ordered `implementation_steps`
- **Responsibility**: Low-level design — break the plan into discrete, sequenced coding tasks, each mapped to a specific file.

### 3. 💻 Coder Agent *(ReAct)*
- **Input**: `CoderState` (TaskPlan + current step index)
- **Output**: Written files on disk
- **Responsibility**: Executes one file per invocation using a **ReAct (Reason + Act)** loop powered by `create_react_agent`. Loops through all steps until completion.

**Tools available to the Coder:**

| Tool | Description |
|------|-------------|
| `read_file` | Read existing file content |
| `write_file` | Write/overwrite a file |
| `list_files` | List files in a directory |
| `get_current_directory` | Get the working directory path |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- A [Groq API Key](https://console.groq.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/agentforge.git
cd agentforge

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Add your GROQ_API_KEY to .env
```

### Usage

``` python
from agent. graph import agent

result = agent.invoke(
    {"user_prompt": "create a simple calculator web application"},
    {"recursion_limit": 100}
)
```

Or run directly:

```bash
python agent/graph.py
```

The generated app will appear in the `output/` directory.

---

## 🔧 Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `GROQ_API_KEY` | Your Groq API key | *required* |
| `recursion_limit` | Max LangGraph steps | `100` |
| LLM Model | Set in `graph.py` | `openai/gpt-oss-120b` |

---

## 📦 Dependencies

```txt
langchain-groq
langchain-core
langgraph
python-dotenv
pydantic
```

---

## 🗺️ Roadmap

- [ ] Web UI for prompt input and live file tree preview
- [ ] Support for multi-file edits and iterative refinement
- [ ] Reviewer agent to validate and test the generated code
- [ ] Docker containerization
- [ ] Streaming output to terminal during generation
- [ ] Support for additional LLM providers (OpenAI, Anthropic)

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License


---

<div align="center">

Built with ❤️ using [LangGraph](https://langchain-ai.github.io/langgraph/) · [Groq](https://groq.com) · [LangChain](https://langchain.com)

⭐ **Star this repo if you found it useful!**

</div>


