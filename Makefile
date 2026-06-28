.PHONY: install test lint demo

install:
	pip install -e ".[dev]"

test:
	pytest

lint:
	ruff check ai_framework tests
	mypy ai_framework

demo:
	python -m ai_framework.demo --goal "Recon the target" --target http://localhost:8000 --backend offline
