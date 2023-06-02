.PHONY: all

build:
	docker build -t chatbot-ui:latest .

run:
	docker stop chatbot-ui || true && docker rm chatbot-ui || true
	docker run --name chatbot-ui --rm --env-file=.env.local -p 3000:3000 chatbot-ui

dev:
	docker build -f Dockerfile.dev -t chatbot-ui:dev .
	docker run --rm -v "`pwd`:/app" -p 3000:3000 --name chatbot-ui-dev chatbot-ui:dev sh -c "npm i && npm run dev"

shell:
	docker exec -it chatbot-ui-dev /bin/ash

logs:
	docker logs -f chatbot-ui

push:
	docker tag chatbot-ui:latest ${DOCKER_USER}/chatbot-ui:${DOCKER_TAG}
	docker push ${DOCKER_USER}/chatbot-ui:${DOCKER_TAG}