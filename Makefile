.PHONY: clean sail_client build_image

install:
	@./build/dev_setup.sh

run:
	@uvicorn app.main:server --reload

build_image:
	@./scripts.sh build_image tallulah/ui

push_image: build_image
	@./scripts.sh push_image_to_registry tallulah/ui

generate_client:
	@./scripts.sh generate_client
