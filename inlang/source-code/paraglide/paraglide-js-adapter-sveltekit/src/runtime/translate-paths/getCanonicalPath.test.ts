import { describe, it, expect } from "vitest"
import { getCanonicalPath } from "./getCanonicalPath"

describe("getCanonicalPath", () => {
	it("returns the translatedPath if no translations are given", () => {
		const translatedPath = getCanonicalPath("/foo", "en", {})
		expect(translatedPath).toBe("/foo")
	})

	it("returns the canonical path in case of a match", () => {
		const canonicalPath = getCanonicalPath("/foo", "en", {
			"/foo": {
				en: "/bar",
				de: "/baz",
			},
		})
		expect(canonicalPath).toBe("/foo")
	})
})
