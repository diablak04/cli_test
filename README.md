# BigQuery Release Notes Hub

A premium, modern web application built using **Python Flask**, **Vanilla HTML5**, **CSS3**, and **JavaScript** to view, filter, and share BigQuery release notes. It parses Google Cloud's official Atom release notes feed and splits daily logs into individual updates, enabling users to select specific items and compose announcements to post on X (Twitter).

---

## Key Features

1. **Intelligent Feed Parsing**: 
   Uses `feedparser` and `BeautifulSoup` to split daily release logs into distinct, category-specific updates (e.g., Features, Changes, Announcements, Deprecations, Issues).
2. **Premium Visual Styling**: 
   A high-end dark mode interface using **glassmorphic components**, fluid radial gradients, modern typography (Outfit & Inter), and micro-animations.
3. **Advanced Filtering & Search**:
   Allows real-time textual searching and tab-based filtering across categories.
4. **Selective Tweet Composer**:
   - Single or multi-select cards from the release timeline.
   - A floating status bar when cards are selected.
   - A modern Tweet dialog with a live **280-character count tracker**, circular progress bar, text editor, "Copy Draft" button, and direct link to X (Twitter) compose intent.
5. **Robust Caching**:
   Caches feed content in-memory for 5 minutes to ensure fast loads, with manual sync bypassing.
6. **Graceful Fallbacks**:
   Handles network drops smoothly, showing offline notifications and using cached structures.

---

## Project Structure

```
agy_projects/
├── app.py                  # Flask Application Server
├── requirements.txt        # Python dependencies
├── static/
│   ├── css/
│   │   └── style.css       # Premium responsive glassmorphic styles
│   └── js/
│       └── app.js          # Main client application (XML handling, search, filter, tweet composer)
├── templates/
│   └── index.html          # Main HTML structure with custom SVG icons
└── README.md               # Documentation
```

---

## Setup & Running Instructions

### 1. Prerequisites
Make sure Python 3 is installed on your machine.

### 2. Installation
Navigate to the project directory and set up the virtual environment:

```bash
# Create a virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Running the Server
Run the Flask server:

```bash
python app.py
```

The application will start in development mode, listening on:
- **Local URL**: [http://127.0.0.1:5000](http://127.0.0.1:5000)

### 4. Bypassing Cache
To fetch fresh records directly from the Google API, click the **"Refresh Feed"** button in the top-right corner of the application. This makes a request with `?refresh=true` which updates the local memory cache immediately.

---

## How Sharing to X (Twitter) Works

1. **Card Hover & Select**:
   Hover over any update to view links or direct action buttons. Clicking on any card highlights it with a glowing cyan border.
2. **Selection Actions**:
   Selecting one or more cards summons the bottom action bar.
3. **Compose draft**:
   Click **"Draft Tweet"** to launch the dialog.
   - If **one card** is selected, a tweet structure is generated including the date, category, condensed update description, direct deep link, and standard tags (`#BigQuery #GoogleCloud`).
   - If **multiple cards** are selected, it generates a bulleted list summary showing items chronologically and linking to the release page.
4. **Publishing**:
   Users can copy the text using **"Copy Draft"** or click **"Post to X"** to open a new tab containing the pre-filled text in the official Twitter Web Intent composer.
