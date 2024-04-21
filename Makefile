export BROWSER_PYSCRIPT

define PRINT_HELP_PYSCRIPT
import re, sys

for line in sys.stdin:
	match = re.match(r'^([a-zA-Z_-]+):.*?## (.*)$$', line)
	if match:
		target, help = match.groups()
		print("%-20s %s" % (target, help))
endef
export PRINT_HELP_PYSCRIPT
BROWSER := python -c "$$BROWSER_PYSCRIPT"

help:
	@python -c "$$PRINT_HELP_PYSCRIPT" < $(MAKEFILE_LIST)

clean: clean-build clean-install clean-test ## remove all build, test, coverage

clean-build: ## remove build artifacts
	rm -fr dist/

clean-install: ## remove node_modules. package-lock.json
	rm -rf node_modules/
	rm -f package-lock.json
	npm cache clean --force

clean-test: ## remove test and coverage artifacts
	rm -rf .coverage

lint: ## check style with eslint
	npm run lint

test: lint ## run tests with coverage
	npm run test

dist: test clean-build ## builds source
	npm run build

release: dist  ## package and upload a release
	npm publish
