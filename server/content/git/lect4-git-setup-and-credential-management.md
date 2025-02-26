# Lect4 (Git Setup and Credential Management)

#### Step 1: Check if Git is Installed
1. **Open Command Prompt or PowerShell**
   - Type the following command:
     ```bash
     git --version
     ```
2. **Output**:
   - If Git is installed, it will display the version (e.g., `git version 2.41.0`).
   - If not installed, it will show:
     ```
     'git' is not recognized as an internal or external command.
     ```

#### Step 2: Download and Install Git
1. **Go to the Git Official Website**:
   - Open [Git Downloads](https://git-scm.com/downloads).
2. **Choose the Correct Version**:
   - Download the version for your operating system (e.g., Windows, macOS, Linux).
3. **Run the Installer**:
   - Follow the installation steps and choose default settings if you’re unsure.
4. **Verify Installation**:
   - Open Command Prompt or PowerShell and run:
     ```bash
     git --version
     ```
![Git](images/03_git_2.png)


#### Step 3: Configure Git for the First Time
1. **Set Global Username**:
   - Run the following command:
     ```bash
     git config --global user.name "Your Name"
     ```
   - Example output:
     ```
     PS C:\Users\navin> git config --global user.name "Navin"
     ```
2. **Set Global Email**:
   - Run the following command:
     ```bash
     git config --global user.email "your-email@example.com"
     ```
   - Example output:
     ```
     PS C:\Users\navin> git config --global user.email "navin@example.com"
     ```
3. **Verify Configuration**:
   - Use the command:
     ```bash
     git config --global --list
     ```
   - Example output:
     ```
     user.name=Navin
     user.email=navin@example.com
     ```

#### Step 4: Change Git Credentials
If you need to change your Git credentials:
1. **Update Username**:
   - Run the following command:
     ```bash
     git config --global user.name "New Name"
     ```
2. **Update Email**:
   - Run the following command:
     ```bash
     git config --global user.email "new-email@example.com"
     ```

#### Step 5: Manage Windows Credentials
If you’re using Git with HTTPS and need to change your stored credentials:
1. **Open Credential Manager**:
   - Press `Windows Key + S` and search for **Credential Manager**.
   - Open **Windows Credential Manager**.
2. **Find GitHub or Git Entry**:
   - Look for entries like `git:https://github.com` under **Windows Credentials**.
3. **Edit or Remove Credentials**:
   - Click on the entry and select **Edit** or **Remove**.
4. **Add New Credentials** (if needed):
   - Select **Add a Windows Credential**.
   - Enter your Git server URL (e.g., `https://github.com`), username, and password.

![Manage Credential](images/03_manage_credential_1.png)

#### Step 6: Test New Credentials
1. **Clone a Repository**:
   - Use the following command:
     ```bash
     git clone https://github.com/your-username/your-repository.git
     ```
2. **Push or Pull**:
   - Verify that Git uses your updated credentials when pushing or pulling changes.

---

### Key Git Commands
1. **Check Git Version**:
   ```bash
   git --version
   ```
2. **Set Global Username**:
   ```bash
   git config --global user.name "Your Name"
   ```
3. **Set Global Email**:
   ```bash
   git config --global user.email "your-email@example.com"
   ```
4. **View Global Configurations**:
   ```bash
   git config --global --list
   ```
5. **Clone a Repository**:
   ```bash
   git clone https://github.com/your-username/your-repository.git
   ```

#### Troubleshooting
- If Git doesn’t recognize credentials, ensure the correct URL and credentials are stored in the **Credential Manager**.
- If issues persist, clear old credentials and re-enter them.

These steps should help beginners set up Git and manage their credentials effectively!

