# BroodMind

<br/>

**BroodMind** is a local AI orchestration system built around a Queen + Workers architecture. It runs on your device or server and acts as a long-running AI operator that plans tasks, spawns workers, and executes workflows on your behalf.

<br/>

The Queen is the long-running coordinator: it holds memory, plans work, chooses tools, manages context, and delegates execution. Workers are short-lived specialists with limited permissions, bounded context, and task-specific tool access.

<br/>

**BroodMind** is designed for persistent assistant workflows, not just single prompts. It combines conversation channels, reusable workers, scheduling, memory, canon, policy controls, and an ops dashboard into one local system you can run on your own machine or server.

This separation improves safety and reliability: sensitive context stays with the Queen, while workers receive only the minimum context needed to complete a task.

<br/>

**Github:** [https://github.com/pmbstyle/BroodMind](https://github.com/pmbstyle/BroodMind)