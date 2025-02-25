# Lect2 (History of Git)

#### 1. The Need for Version Control in the Linux Community
- **Linux Kernel Development**:
  - The Linux kernel is an open-source project requiring effective version control to manage contributions from developers worldwide.
  - In the early 2000s, the Linux kernel developers used **BitKeeper**, a proprietary Distributed Version Control System (DVCS).

#### 2. The BitKeeper Era
- **BitKeeper Introduction**:
  - BitKeeper was created by Larry McVoy in the late 1990s.
  - It introduced distributed version control concepts, allowing developers to work offline and sync changes later.
  - The Linux kernel team adopted BitKeeper in 2002 due to its advanced features and scalability.
- **Controversy**:
  - While BitKeeper was free for open-source projects, it was proprietary.
  - This led to discomfort among developers who preferred open-source tools.

#### 3. The Breaking Point: BitKeeper Starts Charging
- **Trigger Event (2005)**:
  - The relationship between BitKeeper and the Linux community deteriorated.
  - BitKeeper's parent company announced that the tool would no longer be free for open-source projects.
  - This decision sparked a crisis in the Linux development community as they could no longer rely on BitKeeper without incurring costs.
- **Impact on Linux Development**:
  - The Linux team faced the challenge of finding an alternative version control system that could match BitKeeper's features while being free and open-source.

#### 4. Linus Torvalds Creates Git
- **Why Git Was Created**:
  - Linus Torvalds, the creator of Linux, decided to develop a new DVCS tailored to the needs of the Linux kernel development.
  - Torvalds wanted a system that was fast, distributed, and supported non-linear development (e.g., branching and merging).
- **Design Goals of Git**:
  - **Speed**: Handle large projects efficiently.
  - **Distributed**: Allow every developer to have a full copy of the repository.
  - **Integrity**: Ensure data integrity with cryptographic hashes.
  - **Free and Open-Source**: Align with the principles of the Linux community.

#### 5. Git's Launch and Adoption
- **Initial Development**:
  - Git was developed in April 2005.
  - Within weeks, Torvalds and the Linux team migrated the kernel development to Git.
- **Features That Set Git Apart**:
  - High performance for large-scale projects.
  - Easy branching and merging.
  - Robust history tracking with SHA-1 hashes.
- **Wider Adoption**:
  - Over time, Git gained popularity beyond the Linux community.
  - Today, Git is the most widely used version control system, powering platforms like GitHub, GitLab, and Bitbucket.

#### Timeline Summary
1. **2002**: Linux kernel team adopts BitKeeper.
2. **2005**: BitKeeper starts charging for open-source projects, causing a shift.
3. **April 2005**: Linus Torvalds develops Git.
4. **Mid-2005**: Linux kernel development fully transitions to Git.
5. **2008**: GitHub launches, further boosting Git’s popularity.

#### Legacy
- Git not only resolved the Linux kernel’s version control crisis but also became a cornerstone of modern software development. It embodies the open-source philosophy, empowering developers worldwide.

