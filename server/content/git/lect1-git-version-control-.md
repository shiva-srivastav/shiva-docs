# Lect1 (Git Version Control)

### 1. Local Version Control
- **Definition**: Tracks changes in files on a single computer. A version database is used to store different versions of files.
- **Example with QuizApplication**:
  - You create a QuizApplication on your local computer.
  - Every time you make a significant update, such as adding a new feature or fixing a bug, you save a version (e.g., version 1: basic questions, version 2: added user authentication).
  - Limitation: No collaboration support; all changes are confined to your local machine.

### 2. Centralized Version Control System (CVCS)
- **Definition**: A single server hosts the repository, and developers pull and push changes to this central server.
- **Workflow**:
  - A central server stores the QuizApplication code.
  - Developers clone the repository to their local systems and commit changes to the central repository.
  - Examples: SVN, Perforce.
- **Advantages**:
  - Simplifies collaboration as all versions are stored in one place.
  - Allows multiple developers to work on the QuizApplication.
- **Example with QuizApplication**:
  - Developer #1 adds a feature for a leaderboard and commits it to the server.
  - Developer #2 updates the question bank and commits their changes.
  - Limitation: If the central server goes down, the entire team cannot access the repository.

### 3. Distributed Version Control System (DVCS)
- **Definition**: Every developer has a full copy of the repository, including the history, allowing for offline access and independent versioning.
- **Workflow**:
  - Developers pull changes from a remote repository and push their updates.
  - Multiple repositories are maintained: one central repository and local repositories on each developer’s machine.
  - Examples: Git, Mercurial.
- **Advantages**:
  - Decentralized: Even if the central server goes offline, developers can continue working with their local copies.
  - Better collaboration and easier branching/merging.
- **Example with QuizApplication**:
  - Developer #1 adds a feature to track user scores and pushes it to the central server.
  - Developer #2 works offline to implement a timer for the quiz. Once done, they pull the latest changes from the central repository, merge them with their work, and push the updates back.

### Git Features Highlighted with QuizApplication
1. **Branching**:
   - Create a `feature-leaderboard` branch to add a leaderboard without affecting the main application code.
   - Merge the branch into the main branch after testing.

2. **Collaboration**:
   - Multiple developers can work on different features (e.g., question bank, leaderboard, timer) simultaneously.

3. **Commit History**:
   - Each change is documented with a commit message (e.g., "Added leaderboard feature").

4. **Versioning**:
   - If a bug is introduced, revert to an earlier version (e.g., revert to the state before the leaderboard feature was added).
