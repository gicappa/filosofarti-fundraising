import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const page = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const styles = readFileSync(
  new URL("../src/styles.css", import.meta.url),
  "utf8",
);

describe("experiences layout", () => {
  it("places Adopt a question before the full-width Thought wall", () => {
    const questionsPosition = page.indexOf('class="experience-card questions"');
    const wallPosition = page.indexOf('class="thought-wall"');

    assert.notEqual(questionsPosition, -1);
    assert.notEqual(wallPosition, -1);
    assert.ok(questionsPosition < wallPosition);

    const experienceGrid = page.match(
      /<div class="belonging-grid">[\s\S]*?<\/div>\s*<\/section>/,
    );

    assert.ok(experienceGrid);
    assert.doesNotMatch(experienceGrid[0], /class="thought-wall"/);
    assert.match(
      page,
      /<section class="thought-wall-section"[^>]*>[\s\S]*?<article class="thought-wall"[^>]*>/,
      "the Thought wall should sit in its own full-width section",
    );
  });

  it("uses a light wall with compact pill-shaped words", () => {
    assert.match(
      styles,
      /\.thought-wall-section\s*{[^}]*background:\s*var\(--white\)/s,
    );
    assert.match(
      styles,
      /\.word-chip\s*{[^}]*border-radius:\s*999px[^}]*font-size:\s*0\.9rem/s,
    );
  });
});
