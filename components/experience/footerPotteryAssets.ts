export interface PotteryDesignTemplate {
  id: string;
  label: string;
  src: string;
  width: number;
  height: number;
  /** Convex polygon vertices normalized around sprite center [-0.5, +0.5] */
  hull: [number, number][];
}

export interface PotteryBodyPlacement {
  instanceId: string;
  templateId: string;
  label: string;
  src: string;
  naturalWidth: number;
  naturalHeight: number;
  hull: [number, number][];
  /** Target height relative to AUROVILLE capital height */
  heightToCapRatio: number;
  /** Spawn X ratio relative to centered AUROVILLE wordmark span (can span ~0.04..0.96) */
  spawnXRatio: number;
  /** Vertical tier offset during drop so staggered cluster builds organically */
  spawnTierOffset: number;
  delayMs: number;
  initialAngle: number;
  /** Gentle bottom-weighted center-of-mass bias (higher on tall/upright vessels so they wobble rather than flattening 90deg) */
  bottomWeightBias: number;
  flipX: boolean;
  zOrder: number;
  /** Mobile curated inclusion (~8 objects on mobile, 16 on desktop) */
  showOnMobile: boolean;
  mobileSpawnXRatio?: number;
  mobileScaleMultiplier?: number;
  mobileDelayMs?: number;
}

const TEMPLATES: Record<string, PotteryDesignTemplate> = {
  "pot-large-matka": {
    id: "pot-large-matka",
    label: "Large traditional clay pot",
    src: "/illustrated/footer-pottery/pot-large-matka.webp",
    width: 468,
    height: 520,
    hull: [
      [-0.4654, -0.0985],
      [-0.316, -0.4357],
      [-0.0466, -0.4887],
      [0.2249, -0.4736],
      [0.3133, -0.4338],
      [0.4712, -0.0758],
      [0.4291, 0.2216],
      [0.2439, 0.4451],
      [0.0313, 0.4868],
      [-0.2402, 0.4451],
      [-0.4002, 0.2709],
      [-0.4675, 0.1345],
    ],
  },
  "pot-small-rounded": {
    id: "pot-small-rounded",
    label: "Small rounded earthenware pot",
    src: "/illustrated/footer-pottery/pot-small-rounded.webp",
    width: 481,
    height: 439,
    hull: [
      [-0.47, -0.0839],
      [-0.3533, -0.407],
      [-0.2632, -0.4608],
      [0.0849, -0.4855],
      [0.3491, -0.4137],
      [0.4842, -0.0121],
      [0.4515, 0.1899],
      [0.3143, 0.3761],
      [0.1709, 0.4614],
      [-0.0482, 0.4861],
      [-0.3226, 0.3716],
      [-0.4455, 0.2078],
    ],
  },
  "pot-water-vessel": {
    id: "pot-water-vessel",
    label: "Narrow-necked water vessel",
    src: "/illustrated/footer-pottery/pot-water-vessel.webp",
    width: 243,
    height: 520,
    hull: [
      [-0.4722, 0.1076],
      [-0.225, -0.4607],
      [0.075, -0.4872],
      [0.2209, -0.455],
      [0.4601, 0.0962],
      [0.4803, 0.1909],
      [0.4398, 0.2894],
      [0.2736, 0.4561],
      [-0.0628, 0.4883],
      [-0.2939, 0.4467],
      [-0.4114, 0.3349],
      [-0.4844, 0.2004],
    ],
  },
  "pot-tall-vase": {
    id: "pot-tall-vase",
    label: "Decorative terracotta vase",
    src: "/illustrated/footer-pottery/pot-tall-vase.webp",
    width: 222,
    height: 520,
    hull: [
      [-0.4837, -0.1446],
      [-0.4083, -0.334],
      [-0.2264, -0.4704],
      [0.0842, -0.4893],
      [0.2262, -0.4666],
      [0.4569, -0.2525],
      [0.4791, -0.0442],
      [0.4125, 0.2267],
      [0.2306, 0.4673],
      [-0.1155, 0.4824],
      [-0.2841, 0.437],
      [-0.4527, 0.115],
    ],
  },
  "pot-shallow-bowl": {
    id: "pot-shallow-bowl",
    label: "Shallow clay bowl",
    src: "/illustrated/footer-pottery/pot-shallow-bowl.webp",
    width: 520,
    height: 333,
    hull: [
      [-0.357, -0.3776],
      [-0.0596, -0.4841],
      [0.1753, -0.4664],
      [0.3647, -0.3776],
      [0.4594, -0.2682],
      [0.4803, -0.0818],
      [0.4026, 0.1666],
      [0.2984, 0.353],
      [0.0427, 0.4831],
      [-0.1695, 0.4476],
      [-0.3286, 0.3145],
      [-0.4877, -0.1114],
    ],
  },
  "pot-wide-storage": {
    id: "pot-wide-storage",
    label: "Wide ceramic storage vessel",
    src: "/illustrated/footer-pottery/pot-wide-storage.webp",
    width: 520,
    height: 471,
    hull: [
      [-0.4622, -0.1685],
      [-0.3372, -0.3986],
      [-0.0644, -0.4885],
      [0.1819, -0.4739],
      [0.3334, -0.4028],
      [0.4584, -0.1706],
      [0.4584, 0.1159],
      [0.2955, 0.3898],
      [0.0568, 0.486],
      [-0.1515, 0.4714],
      [-0.286, 0.4045],
      [-0.4716, 0.0845],
    ],
  },
  "pot-sideways": {
    id: "pot-sideways",
    label: "Pottery vessel lying on its side",
    src: "/illustrated/footer-pottery/pot-sideways.webp",
    width: 520,
    height: 458,
    hull: [
      [-0.4003, -0.2989],
      [-0.3018, -0.4021],
      [-0.1085, -0.486],
      [0.3082, -0.3849],
      [0.4332, -0.2602],
      [0.4806, 0.0431],
      [0.401, 0.2044],
      [0.0752, 0.4668],
      [-0.1237, 0.4797],
      [-0.2999, 0.4023],
      [-0.4306, 0.2367],
      [-0.4893, 0.0624],
    ],
  },
  "pot-small-pitcher": {
    id: "pot-small-pitcher",
    label: "Small terracotta pitcher",
    src: "/illustrated/footer-pottery/pot-small-pitcher.webp",
    width: 350,
    height: 378,
    hull: [
      [-0.487, 0.1089],
      [-0.4617, -0.3575],
      [-0.3013, -0.4591],
      [-0.0227, -0.4878],
      [0.1574, -0.4513],
      [0.3938, -0.3419],
      [0.4839, -0.1673],
      [0.4473, -0.0448],
      [0.1631, 0.4216],
      [0.0505, 0.4711],
      [-0.2141, 0.4737],
      [-0.3435, 0.4164],
    ],
  },
  "pot-decorative-urn": {
    id: "pot-decorative-urn",
    label: "Decorative terracotta vessel",
    src: "/illustrated/footer-pottery/pot-decorative-urn.webp",
    width: 238,
    height: 520,
    hull: [
      [-0.4594, -0.0923],
      [-0.2152, -0.4674],
      [0.091, -0.4882],
      [0.2111, -0.4655],
      [0.4552, -0.0942],
      [0.4801, 0.0706],
      [0.3973, 0.26],
      [0.2193, 0.4608],
      [-0.058, 0.4873],
      [-0.2235, 0.457],
      [-0.4304, 0.2108],
      [-0.4842, 0.0649],
    ],
  },
};

function makePlacement(
  instanceId: string,
  templateId: string,
  opts: Omit<
    PotteryBodyPlacement,
    "instanceId" | "templateId" | "label" | "src" | "naturalWidth" | "naturalHeight" | "hull"
  >
): PotteryBodyPlacement {
  const tpl = TEMPLATES[templateId];
  const rawHull = opts.flipX
    ? tpl.hull
        .map(([nx, ny]): [number, number] => [-nx, ny])
        .reverse()
    : tpl.hull;
  return {
    instanceId,
    templateId,
    label: tpl.label,
    src: tpl.src,
    naturalWidth: tpl.width,
    naturalHeight: tpl.height,
    hull: rawHull,
    ...opts,
  };
}

/**
 * 16 curated vessels across 9 unique hand-illustrated designs on desktop;
 * 8 curated vessels across mobile screens for balanced framing & 60fps.
 */
export const FOOTER_POTTERY_PLACEMENTS: PotteryBodyPlacement[] = [
  makePlacement("matka-hero-left", "pot-large-matka", {
    heightToCapRatio: 1.06,
    spawnXRatio: 0.16,
    spawnTierOffset: 0,
    delayMs: 30,
    initialAngle: -0.09,
    bottomWeightBias: 0.022,
    flipX: false,
    zOrder: 4,
    showOnMobile: true,
    mobileSpawnXRatio: 0.25,
    mobileScaleMultiplier: 1.12,
    mobileDelayMs: 40,
  }),
  makePlacement("rounded-far-left", "pot-small-rounded", {
    heightToCapRatio: 0.64,
    spawnXRatio: 0.065,
    spawnTierOffset: 24,
    delayMs: 190,
    initialAngle: 0.12,
    bottomWeightBias: 0.016,
    flipX: false,
    zOrder: 6,
    showOnMobile: true,
    mobileSpawnXRatio: 0.095,
    mobileScaleMultiplier: 1.12,
    mobileDelayMs: 180,
  }),
  makePlacement("bowl-left-mid", "pot-shallow-bowl", {
    heightToCapRatio: 0.52,
    spawnXRatio: 0.26,
    spawnTierOffset: 10,
    delayMs: 110,
    initialAngle: -0.08,
    bottomWeightBias: 0.02,
    flipX: false,
    zOrder: 7,
    showOnMobile: true,
    mobileSpawnXRatio: 0.41,
    mobileScaleMultiplier: 1.12,
    mobileDelayMs: 260,
  }),
  makePlacement("pitcher-left-cluster", "pot-small-pitcher", {
    heightToCapRatio: 0.68,
    spawnXRatio: 0.21,
    spawnTierOffset: 115,
    delayMs: 560,
    initialAngle: 0.11,
    bottomWeightBias: 0.024,
    flipX: false,
    zOrder: 8,
    showOnMobile: false,
  }),
  makePlacement("urn-mid-left", "pot-decorative-urn", {
    heightToCapRatio: 0.94,
    spawnXRatio: 0.355,
    spawnTierOffset: 15,
    delayMs: 270,
    initialAngle: 0.07,
    bottomWeightBias: 0.032,
    flipX: false,
    zOrder: 3,
    showOnMobile: false,
  }),
  makePlacement("rounded-center-left", "pot-small-rounded", {
    heightToCapRatio: 0.56,
    spawnXRatio: 0.43,
    spawnTierOffset: 90,
    delayMs: 650,
    initialAngle: -0.14,
    bottomWeightBias: 0.016,
    flipX: true,
    zOrder: 7,
    showOnMobile: false,
  }),
  makePlacement("sideways-center", "pot-sideways", {
    heightToCapRatio: 0.78,
    spawnXRatio: 0.505,
    spawnTierOffset: 0,
    delayMs: 150,
    initialAngle: 0.18,
    bottomWeightBias: 0.008,
    flipX: false,
    zOrder: 5,
    showOnMobile: true,
    mobileSpawnXRatio: 0.56,
    mobileScaleMultiplier: 1.12,
    mobileDelayMs: 110,
  }),
  makePlacement("bowl-center", "pot-shallow-bowl", {
    heightToCapRatio: 0.46,
    spawnXRatio: 0.585,
    spawnTierOffset: 105,
    delayMs: 730,
    initialAngle: 0.1,
    bottomWeightBias: 0.02,
    flipX: true,
    zOrder: 8,
    showOnMobile: false,
  }),
  makePlacement("storage-mid-right", "pot-wide-storage", {
    heightToCapRatio: 0.84,
    spawnXRatio: 0.655,
    spawnTierOffset: 12,
    delayMs: 240,
    initialAngle: -0.09,
    bottomWeightBias: 0.022,
    flipX: false,
    zOrder: 3,
    showOnMobile: true,
    mobileSpawnXRatio: 0.72,
    mobileScaleMultiplier: 1.05,
    mobileDelayMs: 360,
  }),
  makePlacement("vase-right", "pot-tall-vase", {
    heightToCapRatio: 1.08,
    spawnXRatio: 0.75,
    spawnTierOffset: 4,
    delayMs: 85,
    initialAngle: -0.06,
    bottomWeightBias: 0.036,
    flipX: false,
    zOrder: 4,
    showOnMobile: true,
    mobileSpawnXRatio: 0.85,
    mobileScaleMultiplier: 1.08,
    mobileDelayMs: 220,
  }),
  makePlacement("pitcher-right-front", "pot-small-pitcher", {
    heightToCapRatio: 0.62,
    spawnXRatio: 0.70,
    spawnTierOffset: 120,
    delayMs: 820,
    initialAngle: -0.1,
    bottomWeightBias: 0.022,
    flipX: true,
    zOrder: 9,
    showOnMobile: true,
    mobileSpawnXRatio: 0.91,
    mobileScaleMultiplier: 1.06,
    mobileDelayMs: 490,
  }),
  makePlacement("surahi-right", "pot-water-vessel", {
    heightToCapRatio: 0.98,
    spawnXRatio: 0.84,
    spawnTierOffset: 14,
    delayMs: 340,
    initialAngle: 0.08,
    bottomWeightBias: 0.034,
    flipX: false,
    zOrder: 5,
    showOnMobile: false,
  }),
  makePlacement("rounded-far-right", "pot-small-rounded", {
    heightToCapRatio: 0.6,
    spawnXRatio: 0.935,
    spawnTierOffset: 28,
    delayMs: 420,
    initialAngle: -0.13,
    bottomWeightBias: 0.016,
    flipX: false,
    zOrder: 6,
    showOnMobile: false,
  }),
  makePlacement("sideways-right-cluster", "pot-sideways", {
    heightToCapRatio: 0.66,
    spawnXRatio: 0.88,
    spawnTierOffset: 118,
    delayMs: 910,
    initialAngle: -0.2,
    bottomWeightBias: 0.008,
    flipX: true,
    zOrder: 8,
    showOnMobile: true,
    mobileSpawnXRatio: 0.18,
    mobileScaleMultiplier: 1.02,
    mobileDelayMs: 420,
  }),
  makePlacement("matka-secondary-left", "pot-large-matka", {
    heightToCapRatio: 0.76,
    spawnXRatio: 0.30,
    spawnTierOffset: 125,
    delayMs: 980,
    initialAngle: 0.11,
    bottomWeightBias: 0.022,
    flipX: true,
    zOrder: 5,
    showOnMobile: false,
  }),
  makePlacement("urn-far-left-accent", "pot-decorative-urn", {
    heightToCapRatio: 0.78,
    spawnXRatio: 0.115,
    spawnTierOffset: 110,
    delayMs: 1060,
    initialAngle: -0.09,
    bottomWeightBias: 0.03,
    flipX: true,
    zOrder: 4,
    showOnMobile: false,
  }),
];
