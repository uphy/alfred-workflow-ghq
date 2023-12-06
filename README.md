# Alfred Workflow for ghq

Search and open ghq managed repositories in Visual Studio Code, iTerm, IntelliJ IDEA.
Inspired by https://github.com/uetchy/alfred-workflow-ghq

Differences:
- Support fuzzy search
- Easy Installation (use golang instead of python3)

## Install

[Download Alfred Workflow](https://github.com/uphy/alfred-workflow-ghq/releases) and install it on your machine.


## Development

execution

```shell
alfred_workflow_bundleid=1 alfred_workflow_cache=cache alfred_workflow_data=data go run main.go query 
```

## Release

tag `vX.X.X`
