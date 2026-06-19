import os
import time
import requests
import feedparser
from bs4 import BeautifulSoup
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

# Constants
FEED_URL = "https://docs.cloud.google.com/feeds/bigquery-release-notes.xml"
CACHE_EXPIRY_SECONDS = 300  # 5 minutes cache

# Simple in-memory cache
cache = {
    "data": None,
    "last_updated": 0
}

def parse_release_notes(feed_content):
    """
    Parses the Atom feed XML and splits daily updates into individual items.
    """
    feed = feedparser.parse(feed_content)
    releases = []
    
    for entry in feed.entries:
        date_str = entry.get("title", "Unknown Date").strip()
        link = entry.get("link", "").strip()
        entry_id = entry.get("id", "").strip()
        updated = entry.get("updated", "").strip()
        
        # Extract HTML content
        html_content = ""
        if "content" in entry and isinstance(entry.content, list) and len(entry.content) > 0:
            html_content = entry.content[0].value
        elif "summary" in entry:
            html_content = entry.summary
            
        # Parse content using BeautifulSoup to extract individual updates
        soup = BeautifulSoup(html_content, "html.parser")
        updates = []
        
        current_type = "Update"
        current_content = []
        
        for elem in soup.contents:
            # GCP feed tags are typically <h3> representing the change category (Feature, Changed, etc.)
            if elem.name in ["h3", "h4"]:
                if current_content:
                    html_snippet = "".join(str(c) for c in current_content).strip()
                    text_snippet = BeautifulSoup(html_snippet, "html.parser").get_text().strip()
                    if text_snippet:
                        updates.append({
                            "type": current_type,
                            "html": html_snippet,
                            "text": text_snippet
                        })
                    current_content = []
                current_type = elem.get_text().strip()
            else:
                if str(elem).strip():
                    current_content.append(elem)
                    
        # Add the remaining/last update
        if current_content or current_type != "Update":
            html_snippet = "".join(str(c) for c in current_content).strip()
            text_snippet = BeautifulSoup(html_snippet, "html.parser").get_text().strip()
            if text_snippet:
                updates.append({
                    "type": current_type,
                    "html": html_snippet,
                    "text": text_snippet
                })
                
        # If no updates parsed, add the whole HTML as a single update
        if not updates and html_content.strip():
            text_snippet = soup.get_text().strip()
            updates.append({
                "type": "Update",
                "html": html_content,
                "text": text_snippet
            })
            
        releases.append({
            "date": date_str,
            "link": link,
            "id": entry_id,
            "updated": updated,
            "updates": updates
        })
        
    return {
        "feed_title": feed.feed.get("title", "BigQuery Release Notes"),
        "releases": releases
    }

def fetch_feed_data(force=False):
    """
    Fetches the Atom feed from BigQuery.
    Uses in-memory cache if it is still valid and force is False.
    """
    global cache
    current_time = time.time()
    
    # Return cache if valid
    if not force and cache["data"] and (current_time - cache["last_updated"] < CACHE_EXPIRY_SECONDS):
        return cache["data"], "cache"
        
    try:
        response = requests.get(FEED_URL, timeout=15)
        response.raise_for_status()
        
        # Parse data
        parsed_data = parse_release_notes(response.text)
        
        # Update cache
        cache["data"] = parsed_data
        cache["last_updated"] = current_time
        return parsed_data, "network"
    except Exception as e:
        # If there's an error but we have cached data, fall back to it
        if cache["data"]:
            return cache["data"], "network_fallback"
        raise e

@app.route("/")
def index():
    """
    Serve the main application HTML.
    """
    return render_template("index.html")

@app.route("/api/releases")
def api_releases():
    """
    Endpoint that returns parsed release notes.
    Supports ?refresh=true query parameter to bypass cache.
    """
    force_refresh = request.args.get("refresh", "false").lower() == "true"
    try:
        data, source = fetch_feed_data(force=force_refresh)
        return jsonify({
            "status": "success",
            "source": source,
            "last_updated": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(cache["last_updated"])),
            "feed_title": data["feed_title"],
            "releases": data["releases"]
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
