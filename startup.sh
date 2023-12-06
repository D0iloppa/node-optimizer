#!/bin/bash

# Set environment variables if needed
export NODE_ENV=production

# check if 
pid=`ps -ef | grep "babel-node src/server.js" | grep -v grep | awk '{print $2}'`
if [ -n "$pid" ]; then
  echo "process is running on $pid"
  exit 0;
#  kill -9 $pid
else
  echo "No server process found. let's start the server"
fi

# Start the Node.js app with nohup
#nohup babel-node src/server.js > app.log 2>&1 &
nohup npm rum dev > app.log 2>&1 &

# Save the process ID to a file for use in the shutdown script
echo $! > app.pid

# Display a message indicating the app has started
echo "App started with PID `cat app.pid`"
