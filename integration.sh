#!/bin/bash

OUTPUT=$(./node_modules/jscs/bin/jscs --config .integration_jscsrc -m -1 $@ | grep "ReferenceError" | wc -l)

if [ "$OUTPUT" -gt 0 ]; then
  exit 1
fi

exit 0