#!/bin/bash

# Find the process ID of the node process and kill it
pid=`ps -ef | grep "babel-node src/server.js" | grep -v grep | awk '{print $2}'`
if [ -n "$pid" ]; then
  echo "Killing process $pid"
  kill -9 $pid
else
  echo "No process found"
fi

echo "Server stopped!"

