echo "Starting front init"
cp ~/scripts/frsp/package.json ./package.json
echo "Create package.json"
cp ~/scripts/frsp/webpack.config.js ./webpack.config.js
echo "Create webpack.config.js"
mkdir src dist
echo "Create src and dist dir"
cp ~/scripts/frsp/src/index.css ./src/index.css
cp ~/scripts/frsp/src/index.js ./src/index.js
cp ~/scripts/frsp/src/index.html ./src/index.html
echo "Fill src dir with basic files"
cp ~/scripts/frsp/.gitignore ./.gitignore
echo "Create .gitignore"
npm i
echo "Install NPM-packages"
echo "Ending front init"