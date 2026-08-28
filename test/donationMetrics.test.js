import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  calculateCampaignMetrics,
  resolveMilestones,
} from "../src/donationMetrics.js";

describe("calculateCampaignMetrics", () => {
  it("caps progress at 100 percent and derives symbolic seats from each 100 euro", () => {
    const metrics = calculateCampaignMetrics({
      goal: 11000,
      raised: 11420,
      seatValue: 100,
    });

    assert.equal(metrics.progressPercent, 100);
    assert.equal(metrics.symbolicSeats, 110);
    assert.equal(metrics.remaining, 0);
  });

  it("keeps partial campaigns proportional to the configured goal", () => {
    const metrics = calculateCampaignMetrics({
      goal: 11000,
      raised: 4350,
      seatValue: 100,
    });

    assert.equal(metrics.progressPercent, 39.55);
    assert.equal(metrics.symbolicSeats, 43);
    assert.equal(metrics.remaining, 6650);
  });
});

describe("resolveMilestones", () => {
  it("marks milestones reached when the raised amount meets the threshold", () => {
    const milestones = resolveMilestones(4350, [
      { amount: 2500, label: "Tessere numerate attive" },
      { amount: 5000, label: "Incontro sostenitori sbloccato" },
    ]);

    assert.deepEqual(milestones, [
      { amount: 2500, label: "Tessere numerate attive", reached: true },
      { amount: 5000, label: "Incontro sostenitori sbloccato", reached: false },
    ]);
  });
});
