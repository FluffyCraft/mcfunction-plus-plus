filter();

function main() {
	const mcfppfunctionsPath = `${context.config.outPath}/BP/mcfppfunctions`;

	// filePath here is not including the outPath
	// if the original was dist/BP/mcfppfunctions/a.js, pass BP/mcfppfunctions/a.js here
	function makeFunction(filePath, mcf) {
		if (typeof mcf !== "object") throw `mcfpp_ERR: In ${filePath}: Return value must be an object or an array.`;

		if (Array.isArray(mcf)) {
			for (const subMcf of mcf) {
				if (!subMcf.path)
					throw `mcfpp_ERR: In ${filePath}: If the file defines multiple functions, all functions must have the \`path\` value defined.`;
				makeFunction(filePath, subMcf);
			}
			return;
		}

		const fullDirname = api.std.node.path.join(
			context.config.outPath,
			"BP/functions",
			mcf.path || filePath.slice("BP/mcfppfunctions/".length, -".js".length)
		);

		for (const set of mcf.sets) {
			let mcfunction = "";
			mcf.function(set, cmd => (mcfunction += cmd + "\n"));

			api.std.node.fs.mkdirSync(fullDirname, { recursive: true });
			api.std.node.fsPromises.writeFile(api.std.node.path.join(fullDirname, `${set}.mcfunction`), mcfunction); // write the function
		}
	}

	for (const filePath of api.std.glob.sync(`${mcfppfunctionsPath}/**/*.js`))
		makeFunction(
			filePath
				.split(context.config.outPath + "/")
				.slice(1)
				.join(context.config.outPath + "/"),
			Function(api.std.node.fs.readFileSync(filePath, "utf8"))()
		);

	api.std.node.fsPromises.rm(mcfppfunctionsPath, { recursive: true }); // delete mcfppfunctions
}
