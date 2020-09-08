SHELL := /bin/bash

PLIST=info.plist
BUILD_DIR=build
EXEC_BIN=$(BUILD_DIR)/alfred-ghq
DIST_FILE=$(BUILD_DIR)/ghq.alfredworkflow
GO_SRCS=$(shell find -f . \( -name \*.go \))

all: $(DIST_FILE)

$(BUILD_DIR):
	mkdir -p $(BUILD_DIR)

$(EXEC_BIN): $(BUILD_DIR) $(GO_SRCS)
	go build -o $(EXEC_BIN) .

$(DIST_FILE): $(EXEC_BIN) $(PLIST)
	zip -r $(DIST_FILE) $(PLIST) $(EXEC_BIN)

.PHONY: clean
clean:
	rm -rf $(BUILD_DIR)