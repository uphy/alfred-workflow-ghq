WORKFLOW_FILE = ghq.alfredworkflow

build:
	zip -r $(WORKFLOW_FILE) * -x Makefile -x .gitignore -x .git -x .github -x .editorconfig -x README.md

install: build
	open $(WORKFLOW_FILE)

clean:
	rm -rf $(WORKFLOW_FILE)
