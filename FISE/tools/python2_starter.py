import subprocess
import sys

# Define the path to Python 3 executable
python3_executable = "python3"  # Adjust this if necessary (e.g., "/usr/bin/python3")

# Define the Python 3 script you want to run
script_path = "/code/config/FISE/tools/add-sdi-records.py"

# Run the Python 3 script
try:
    subprocess.call([python3_executable, script_path])
except OSError as e:
    print("Error starting Python 3 script:", e)