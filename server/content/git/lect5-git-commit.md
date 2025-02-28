# Lect5 (Git Commit)

## 1. **What is `git commit`?**
The `git commit` command is used to save changes to your project. Think of it as taking a snapshot of your project at a specific moment. Each snapshot gets a unique ID, called a commit ID.

### What Does `git commit` Do?
- Saves the changes from the staging area to the repository.
- Creates a unique ID for the changes (called a commit ID).
- Adds your changes to the project's history.

---

## 2. **How to Use `git commit`: Step-by-Step Example**
Let's take an example using the folder `C:\navin\telusko\FirstProject`.

### Step 1: Navigate to Your Project Folder
Go to the folder where your project is stored:
```bash
$ cd C:\navin\telusko\FirstProject
```

### Step 2: Create a File
Create a new file called `file.txt`:
```bash
$ echo "Hello Git!" > file.txt
```
This adds the text "Hello Git!" to the file.

### Step 3: Stage the File
Use `git add` to prepare the file for saving:
```bash
$ git add file.txt
```

### Step 4: Commit the File
Save the changes using `git commit`:
```bash
$ git commit -m "Initial commit: Added file.txt"
```
**Output Explanation:**
- `[main (root-commit) fd914d5]`: This shows the branch (`main`), the type of commit (`root-commit` means it’s the first commit), and the unique commit ID (`fd914d5`).
- `1 file changed, 1 insertion(+)`: This tells you that one file was changed, and one line of content was added.
- `create mode 100644 file.txt`: This means a new file named `file.txt` was created.

### Step 5: Modify the File
Let’s add more content to the file:
```bash
$ echo "This is a Git example." >> file.txt
```
Now, the file contains:
```plaintext
Hello Git!
This is a Git example.
```

### Step 6: Stage and Commit Again
Stage the changes:
```bash
$ git add file.txt
```
Commit the changes with a message:
```bash
$ git commit -m "Updated file.txt with additional content"
```
**Output Explanation:**
- A new commit ID is generated (e.g., `abc1234`).
- The output will show the number of files changed and lines added.

---

## 3. **How to See Your Commit History**
To view a list of all the commits in your project, use:
```bash
$ git log
```
**Example Output:**
```plaintext
commit abc1234
Author: navin <connect@telusko.com>
Date:   YYYY-MM-DD HH:MM:SS

    Updated file.txt with additional content

commit fd914d5
Author: navin <connect@telusko.com>
Date:   YYYY-MM-DD HH:MM:SS

    Initial commit: Added file.txt
```
### Explanation:
- Each `commit` line shows the unique commit ID (e.g., `abc1234` or `fd914d5`).
- The `Author` shows who made the commit.
- The `Date` shows when the commit was made.
- The message explains what was changed in that commit.

---

## 4. **Key Points for Beginners**
1. **Write Good Commit Messages:** Always describe what changes you made using `git commit -m "Your message"`.
2. **Commit IDs:** These are unique and used to identify a specific snapshot of your project.
3. **Check Commit History:** Use `git log` to see what changes were made and when.
4. **Stage Before Commit:** Always use `git add` to stage your changes before committing.

By following these steps, you can easily save and track changes in your project using `git commit`!

