#!/bin/bash
set -euo pipefail


cd /home/jerry
function cleanup {
  rm -f "/home/jerry/pwn.js"
}
trap cleanup EXIT

echo -e '\x1b[36mEnter your JavaScript code, ending with "EOF" on an otherwise empty line:\x1b[0m'
while IFS= read -r line; do
    if [ "${line}" = EOF ]; then
        break
    else
        echo "${line}" >> "pwn.js"
    fi
done

if [ ! -s "pwn.js" ]; then
    echo -e '\x1b[31mYour script is empty.\x1b[0m'
    exit 1
fi
echo -e '\x1b[36mThank you, running it now.\x1b[0m'

set +e # Still tell the user we're done if jerry exists with an error
stdbuf -i 0 -o 0 ./jerry pwn.js
cd /
echo -e '\x1b[36mDone.\x1b[0m'
