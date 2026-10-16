#!/bin/bash

echo "Updating portfolio-client submodule..."
git submodule update

if [ $? -eq 0 ]; then
    echo "submodule updated"
else
    echo "Submodule could not be updated"
    exit 1
fi


cd portfolio-client

npm approve-scripts --all

echo "Installing portfolio-client dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "Installation successful"
else
    echo "Error installing portfolio-client dependencies"
    exit 1
fi

echo "Building portfolio-client..."
npm run build

if [ $? -eq 0 ]; then
    echo "Building portfolio-client succeeded"
else
    echo "Error building portfolio-client"
    exit 1
fi

echo "Copying files to ./static..."
cp -a build/. ../static/

cd ..

echo "Installing portfolio-server dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "Installation successful"
else
    echo "Error installing portfolio-server dependencies"
    exit 1
fi

echo "Build succeeded"
