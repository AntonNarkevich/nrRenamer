#!/usr/bin/env node

var parseArgs = require('minimist');
var glob = require("glob");
var fs = require('fs');

var args = parseArgs(process.argv.slice(2), {
	alias: {
		dirName: 'd',
		find: 'f',
		replace: 'r'
	}
});

var dirName = args.dirName || __dirname;
var pattern = [dirName, '/**/*', args.find, '*'].join("");

console.log("Searching in %s, by pattern: %s\n", dirName, pattern);

glob(pattern, function (err, files) {
	if (err) { throw err; }

	files.forEach(function (filePath) {
		//Slash thent any number of non-slash chars in the end of string
		//This means the last portion of the path - filename
		var flieNameRegExp = /[^\/]*$/;

		var newFilePath = filePath.replace(flieNameRegExp, function(fileName) {
			return fileName.replace(args.find, args.replace);
		});

		console.log("%s ---> %s", filePath, newFilePath);

		fs.rename(filePath, newFilePath, function (err) {
			if (err) {
				console.log("Error renaming %s.", filePath);
				console.log(err);
			}
		});
	});
});