# Lect5 (Git Initialization and Status Commands)

## 1. **What is `git init`?**
The `git init` command initializes a new Git repository in your project folder. This sets up a `.git` folder to track changes to your files.

### What Does `git init` Do?
- Creates a `.git` directory in your project folder. This hidden folder contains all the files necessary for Git to start tracking changes.
- Prepares your directory to use Git commands like `git add`, `git commit`, etc.
- Does not track files automatically; you need to add files manually using `git add`.
- Does not overwrite an existing repository if one already exists.

### Example with Folder: `C:\navin\telusko\FirstProject`
1. Navigate to the folder:
   ```bash
   $ cd C:\navin\telusko\FirstProject
   ```

2. Initialize the repository:
   ```bash
   $ git init
   Initialized empty Git repository in C:/navin/telusko/FirstProject/.git/
   ```

---

## 2. **What is `git status`?**
The `git status` command displays the current state of the working directory and staging area. It shows which changes have been staged, which have not, and which files aren’t being tracked by Git.

### Common Outputs of `git status`:

1. **Untracked Files:**
   ```plaintext
   Untracked files:
     (use "git add <file>..." to include in what will be committed)
     file.txt
   ```
   - This means the file is not yet tracked by Git.
   - **Solution:** Use `git add <file>` to stage the file.

2. **Changes Not Staged for Commit:**
   ```plaintext
   Changes not staged for commit:
     (use "git add <file>..." to update what will be committed)
     modified: file.txt
   ```
   - This means the file has been modified but is not yet staged.
   - **Solution:** Use `git add <file>` to stage the changes.

3. **Staged Changes:**
   ```plaintext
   Changes to be committed:
     (use "git rm --cached <file>..." to unstage)
     new file:   file.txt
   ```
   - This means the file is staged and ready to be committed.

4. **Clean Working Tree:**
   ```plaintext
   On branch main
   nothing to commit, working tree clean
   ```
   - This means there are no changes to be staged or committed.

### Example Usage with Folder: `C:\navin\telusko\FirstProject`
1. Navigate to the folder:
   ```bash
   $ cd C:\navin\telusko\FirstProject
   ```

2. Check the status of the repository:
   ```bash
   $ git status
   On branch main

   No commits yet

   Untracked files:
     (use "git add <file>..." to include in what will be committed)
       file.txt
   ```
   - **Action:** Use `git add file.txt` to stage the file, then `git commit` to save it.

---
By understanding these two commands, you can effectively initialize repositories and track the state of your project with Git!

