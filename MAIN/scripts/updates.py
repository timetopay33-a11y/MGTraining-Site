import subprocess
from datetime import datetime

N = 8  # how many commits to show
OUTFILE = "docs/_includes/recent-updates.md"

cmd = [
    "git", "log", f"-n{N}",
    "--pretty=format:- **%s**  \n  <small>%ad • %h</small>",
    "--date=short"
]

lines = subprocess.check_output(cmd, text=True).strip().splitlines()

content = [
    "<!-- Auto-generated. Do not edit by hand. -->",
    "## Recent updates",
    "",
    *lines,
    "",
]

with open(OUTFILE, "w", encoding="utf-8") as f:
    f.write("\n".join(content))
