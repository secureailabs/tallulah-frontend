.PHONY: clean sail_client build_image

run:
	@uvicorn app.main:server --reload

build_image:
	@./scripts.sh build_image tallulah/ui

push_image: build_image
	@./scripts.sh push_image_to_registry tallulah/ui

