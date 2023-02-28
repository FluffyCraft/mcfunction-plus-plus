filter();

function main() {
	const node = api.std.node;

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

		const fullDirname = node.path.join(
			context.config.outPath,
			"BP/functions",
			mcf.path || filePath.slice("BP/mcfppfunctions/".length, -".js".length)
		);

		if (!mcf.sets) {
			let mcfunction = "";
			mcf.function(undefined, cmd => (mcfunction += cmd + "\n"));

			const dirname = node.path.dirname(fullDirname);
			const filename = node.path.basename(fullDirname);

			node.fs.mkdirSync(dirname, { recursive: true });
			node.fs.writeFileSync(node.path.join(dirname, `${filename}.mcfunction`), mcfunction); // write the function

			return;
		}

		for (const set of mcf.sets) {
			let mcfunction = "";
			mcf.function(set, cmd => (mcfunction += cmd + "\n"));

			node.fs.mkdirSync(fullDirname, { recursive: true });
			node.fs.writeFileSync(node.path.join(fullDirname, `${set}.mcfunction`), mcfunction); // write the function
		}
	}

	for (const filePath of api.std.glob.sync(`${mcfppfunctionsPath}/**/*.js`))
		makeFunction(
			filePath
				.split(context.config.outPath + "/")
				.slice(1)
				.join(context.config.outPath + "/"),
			Function(node.fs.readFileSync(filePath, "utf8"))()
		);

	node.fs.rmSync(mcfppfunctionsPath, { recursive: true }); // delete mcfppfunctions
}
