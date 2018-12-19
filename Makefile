publish:
	git checkout master
	./node_modules/.bin/lerna publish --conventional-commits --yes
	./node_modules/.bin/conventional-github-releaser -p angular -t ${GH_TOKEN}
