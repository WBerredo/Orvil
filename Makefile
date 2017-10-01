processMessageFile = processMessage.js
libDir = lib/
modelDir = model/
zipFilename = orvil.zip

to_dist:
	@echo "Copying files to dist"
	rm -r -f dist/
	mkdir dist/
	cp $(processMessageFile) dist/
	cp $(libDir) dist/ -r
	cp $(modelDir) dist/ -r
	cp package.json dist/
	cd dist; npm install --production

deploy: to_dist
	@echo "Ziping content"
	cd dist/; zip -r ../$(zipFilename) *