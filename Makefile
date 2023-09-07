install:
	pnpm install

build:
	docker build -t images/panel-api .

start:
	docker container run -it -p 5000:5000 -d --name panel-api images/panel-api

dev:
	docker run -it images/panel-api