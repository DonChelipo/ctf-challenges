#!/bin/sh

echo "${FLAG:-flag\{**********\}}" > flag
chown jerry:jerry flag
chmod 400 flag

socat tcp-l:1024,reuseaddr,fork EXEC:"/home/jerry/jerry-wrapper.sh"
