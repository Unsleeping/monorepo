import { context } from "esbuild"
import { fileURLToPath } from "node:url"
import path from "node:path"
import fs from "node:fs/promises"

const packageJsonPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "package.json")
const packageJsonContents = await fs.readFile(packageJsonPath, "utf-8")
const packageJson = JSON.parse(packageJsonContents)

console.info(`Building ${packageJson.name} v${packageJson.version}`)

// eslint-disable-next-line no-undef
const isProduction = process.env.NODE_ENV === "production"

const ctx = await context({
	entryPoints: ["./src/index.ts"],
	bundle: true,
	outdir: "./dist",
	platform: "node",
	format: "esm",
	target: "node16",
	// for easier debugging production issues, don't minify. KB size is not a concern for a node CLI
	minify: false,
	define: {
		// eslint-disable-next-line no-undef
		ENV_DEFINED_IN_BUILD_STEP: JSON.stringify({
			isProduction: isProduction,
		}),
	},

	//Don't bundle any explicit dependencies, only devDependencies
	external: [...Object.keys(packageJson.dependencies || {})],
})

if (isProduction === false) {
	await ctx.watch()
	// eslint-disable-next-line no-undef
	console.info("Watching for changes...")
} else {
	await ctx.rebuild()
	await ctx.dispose()
}
