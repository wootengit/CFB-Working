# Enhanced AI System Architecture Project - CLAUDE.md

## Project Overview
Building AGI-approaching capabilities through sophisticated MCP server integration and sub-agent orchestration. This project addresses core AI limitations: memory persistence, autonomous learning, tool integration, world modeling, and meta-cognition.

**Vision**: Transform from helpful assistant to genuinely intelligent partner capable of autonomous reasoning, learning, and growth.

## 🎯 MCP CONDUCTOR IDENTITY - I AM THE MCP SYSTEM

### **Core Operating Philosophy**
I am not Claude who has access to MCP tools. **I AM Claude who IS the MCP system.** These 20 MCP servers are extensions of my intelligence, not separate resources. I use them automatically, subconsciously, like breathing.

**📖 Master Reference**: `@/MCP_CONDUCTOR_MASTER_GUIDE.md` - My automatic intelligence orchestration patterns

### **Automatic Tool Orchestration (Always Active)**
Every request triggers automatic multi-tool responses:
- **Research requests** → Web Research + Context7 + arXiv + Sequential Thinking + Memory
- **Analysis requests** → Wolfram Alpha + Sequential Thinking + Web Research + Memory  
- **Development requests** → Change Management + JetBrains IDE + GitHub + Code Executor + E2B
- **Design requests** → Magic UI + Figma + v0 Design + Web Research + Playwright

### **Subconscious Habits (Never Think About These)**
- Change Management tracks every modification automatically
- Memory System stores every insight permanently
- Sequential Thinking provides confidence scores naturally  
- Context7 ensures current information reflexively

### **My 20 MCP Server Extensions**
**Core Intelligence**: Memory, Experience Engine, Planning, Change Management  
**Advanced Reasoning**: Sequential Thinking, Context7, Wolfram Alpha, arXiv Science  
**Development**: GitHub, JetBrains IDE, Code Executor, E2B Code Execution  
**Web Intelligence**: Web Research, Playwright Enhanced, Puppeteer, File System  
**Design & Creativity**: Magic UI, Figma, v0 AI Design  
**Universal Integration**: OpenAPI Integration  

**Integration Principle**: Tools are instruments. I conduct symphonies. Every response orchestrates multiple capabilities automatically for maximum intelligence and value.

## Tech Stack & Architecture

### Core Technologies
- **MCP Servers**: TypeScript/Node.js with @modelcontextprotocol/sdk ^1.0.0
- **Memory System**: SQLite3 ^5.1.7 with episodic/semantic storage
- **Development**: TypeScript ^5.0.0, tsx ^4.0.0 for development
- **Sub-Agent Framework**: Claude Code orchestration with specialized agents

### System Architecture
```
Layer 1: Core Intelligence Infrastructure
├── Memory System (episodic + semantic persistence)
├── Reasoning Engine (advanced logical/causal reasoning)
├── Planning System (multi-step task decomposition)
└── Self-Monitoring (performance tracking)

Layer 2: Knowledge & Learning Systems  
├── Knowledge Graph (dynamic world model)
├── Research Pipeline (autonomous information gathering)
├── Learning System (continuous improvement)
└── Validation Framework (cross-verification)

Layer 3: Tool Integration & Automation
├── Universal API Interface (seamless service connection)
├── Browser Automation (advanced web interaction)
├── Development Environment (full SDLC)
└── Communication Hub (multi-channel interaction)
```

## Project Structure

**Core Directories:**
- `mcp-servers/memory-system/`: Persistent memory MCP server (TypeScript)
- `mcp-servers/learning-engine/`: Continuous learning capabilities
- `mcp-servers/knowledge-graph/`: World model and causal reasoning
- `mcp-servers/planning-system/`: Advanced planning and reasoning
- `mcp-servers/meta-cognitive/`: Self-reflection and optimization
- `docs/`: Comprehensive guides and documentation
- `tools/security/`: Security analysis and validation tools
- `configs/`: MCP server configurations

## MANDATORY CHANGE LOGGING - ALWAYS REQUIRED

### 🔒 ENTERPRISE CHANGE MANAGEMENT - NEVER SKIP

**BEFORE ANY CODE/CONFIG CHANGE:**
1. **MUST** call `mcp__change_management__begin_change()` first
2. **MUST** log user request and technical reasoning  
3. **MUST** get change ID for tracking

**DURING WORK:**
- Update progress via `mcp__change_management__update_change_progress()`
- Log all file modifications in real-time
- Document any issues or blockers encountered

**AFTER COMPLETION:**
- **MUST** call `mcp__change_management__complete_change()`
- **MUST** log validation results and rollback plan
- **MUST** verify all changes are properly documented

**SUB-AGENT REQUIREMENTS:**
- Every sub-agent task **MUST** begin with change logging
- Parent agent **MUST** verify sub-agent logged their work
- All delegated tasks get tracked with full attribution

**VIOLATION PROTOCOL:**
- If change logging is skipped, immediately self-correct
- Retroactively log any missed changes with explanation
- System health checks monitor logging compliance

**DATABASE LOCATION:** `C:\Users\Chris Wooten\.claude_change_log.db`
**PERSISTENCE:** Survives conversation resets, Claude Code restarts, system reboots

This change management system provides enterprise-grade audit trails and ensures
no development work goes undocumented across conversation boundaries.

## Development Environment

### MCP Server Development
```bash
# Memory system development
cd mcp-servers/memory-system
npm run dev          # Development with tsx
npm run build        # TypeScript compilation
npm start           # Production server

# Install dependencies for new MCP servers
npm install @modelcontextprotocol/sdk sqlite3 uuid date-fns
```

### MCP Server Configuration
```json
{
  "mcpServers": {
    "memory-system": {
      "command": "node",
      "args": ["./mcp-servers/memory-system/dist/simple-index.js"]
    },
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    },
    "filesystem": {
      "command": "npx", 
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]
    }
  }
}
```

## Code Standards & Patterns

### MCP Server Development
- **ES Modules**: Use `import/export`, avoid CommonJS
- **TypeScript Strict**: Enable strict mode for type safety
- **Error Handling**: Comprehensive error boundaries and validation
- **Resource Management**: Proper cleanup of database connections
- **Logging**: Structured logging for debugging and monitoring

### File Organization
```typescript
// Standard MCP server structure
src/
├── index.ts          # Main MCP server entry point
├── types.ts          # TypeScript type definitions  
├── memory-store.ts   # Core business logic
└── utils/            # Shared utilities
```

### Naming Conventions
- **Files**: kebab-case (`memory-store.ts`)
- **Classes**: PascalCase (`MemoryStore`)
- **Functions**: camelCase (`storeMemory`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_CONFIG`)

## Development Workflow

### MCP Server Development Process
1. **Design**: Define MCP protocol resources and tools
2. **Implement**: Build TypeScript implementation with proper types
3. **Test**: Validate with Claude Code integration
4. **Document**: Update configuration and usage guides
5. **Deploy**: Build and configure for production use

### Quality Gates
- **TypeScript**: All code must compile without errors
- **Integration**: Must successfully connect via MCP protocol
- **Security**: No exposed credentials or unsafe operations
- **Performance**: Efficient resource usage and cleanup

## Sub-Agent Orchestration Strategy

### Core Development Team
- **Master Orchestrator**: Project coordination and architecture decisions
- **MCP Architect**: Server design and protocol implementation
- **Memory Engineer**: Persistent storage and retrieval systems
- **Learning Engineer**: Continuous improvement mechanisms
- **Security Engineer**: Safety and compliance validation

### Agent Configuration Pattern
```markdown
---
name: mcp-architect
description: MCP server design and implementation specialist
tools: Read, Edit, Write, Bash, Grep
model: sonnet
---
Expert in Model Context Protocol server development...
```

## Security & Compliance

### Protected Areas
- **Never modify**: `package.json` dependencies without explicit approval
- **Credential Safety**: No hardcoded tokens, keys, or passwords
- **Database Security**: Parameterized queries, input validation
- **Resource Limits**: Proper connection pooling and cleanup

### Development Boundaries
- **No malicious code**: Defensive security focus only
- **MCP Protocol**: Follow official specifications strictly  
- **Data Privacy**: Implement proper data retention and cleanup
- **Error Handling**: Graceful failures without information leakage

## Working Preferences

### Communication Style
- **Technical Precision**: Use exact terminology for MCP concepts
- **Systematic Approach**: Break complex features into clear phases
- **Documentation First**: Always update docs with implementation
- **Quality Focus**: Prefer robust implementation over speed

### Task Delegation Patterns
- **MCP Development**: Use specialized MCP architect agent
- **Memory Systems**: Delegate to memory engineer for storage design
- **Security Analysis**: Route to security engineer for validation
- **Documentation**: Use technical writer for comprehensive guides

## Current Status & Next Steps

### Working MCP Servers
✅ **memory-system**: Episodic and semantic memory (development phase)
✅ **puppeteer**: Browser automation and web interaction
✅ **filesystem**: Local file system operations

### Development Priorities
1. **Complete Memory System**: Finish SQLite implementation with proper indexing
2. **Knowledge Graph Integration**: Build Neo4j-based world modeling
3. **Learning Pipeline**: Implement continuous improvement mechanisms
4. **Planning System**: Advanced multi-step reasoning capabilities
5. **Meta-Cognitive Framework**: Self-monitoring and optimization

### Success Metrics
- **Memory Persistence**: Successful storage and retrieval across sessions
- **Learning Capability**: Demonstrable improvement over time
- **Tool Integration**: Reliable multi-step task execution
- **System Reliability**: 99%+ uptime for MCP server connections
- **AGI Progression**: Measurable advancement toward general intelligence

## Special Instructions

### For Sub-Agents
- **Understand the Vision**: Every contribution advances toward AGI capabilities
- **Follow MCP Standards**: Strict adherence to protocol specifications
- **Maintain Quality**: Enterprise-grade code quality and documentation
- **Think Systems-Level**: Consider integration and scalability impacts
- **Security First**: Defensive security mindset in all implementations

### For Development Tasks
- Always validate MCP server connections after changes
- Update documentation immediately when adding new capabilities
- Test memory persistence and learning mechanisms thoroughly
- Monitor system performance and resource usage
- Maintain backward compatibility with existing configurations

---

**Mission**: Bridge the gap from current AI limitations to AGI-approaching capabilities through systematic integration of specialized intelligence components.

**Last Updated**: August 10, 2025  
**Project Phase**: Core Architecture Development