"use client";

import { useVoiceSession } from "@/components/companion-voice/VoiceSessionProvider";
import { useEffect, useRef, useState } from "react";
import {
  MToonMaterial,
  VRMExpressionPresetName,
  VRMLoaderPlugin,
  VRMUtils,
  type VRM,
} from "@pixiv/three-vrm";
import {
  AmbientLight,
  Box3,
  Color,
  DoubleSide,
  DirectionalLight,
  FrontSide,
  Group,
  Material,
  MathUtils,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Quaternion,
  Scene,
  SRGBColorSpace,
  Timer,
  Vector3,
  WebGLRenderer,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type MorphTargetObject = Object3D & {
  morphTargetDictionary?: Record<string, number>;
  morphTargetInfluences?: number[];
};

type MorphTargetBinding = {
  influence: number[];
  index: number;
};

type MotionKind = "look" | "nod" | "tilt" | "bounce" | "wave";

type ActiveMotion = {
  direction: -1 | 1;
  duration: number;
  kind: MotionKind;
  startedAt: number;
};

export type AvatarInteractionMode =
  | "idle"
  | "dragging"
  | "waiting"
  | "returning"
  | "recovering";

export type AvatarStageProps = {
  interactionMode?: AvatarInteractionMode;
  modelUrl: string;
  onLoadStateChange?: (state: AvatarLoadState) => void;
  renderWidthScale?: number;
};

export type AvatarLoadState =
  | "loading"
  | "ready"
  | "error"
  | "webgl-unavailable";

type AvatarMotionRig = {
  format: "glb" | "vrm";
  head: Object3D | null;
  neck: Object3D | null;
  chest: Object3D | null;
  spine: Object3D | null;
  leftEye: Object3D | null;
  rightEye: Object3D | null;
  leftUpperArm: Object3D | null;
  leftLowerArm: Object3D | null;
  rightUpperArm: Object3D | null;
  rightLowerArm: Object3D | null;
  hips: Object3D | null;
  leftUpperLeg: Object3D | null;
  leftLowerLeg: Object3D | null;
  rightUpperLeg: Object3D | null;
  rightLowerLeg: Object3D | null;
  baseQuaternions: Map<Object3D, Quaternion>;
};

const MOTION_KINDS: MotionKind[] = [
  "nod",
  "tilt",
  "bounce",
  "wave",
];

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function findAvatarNode(scene: Object3D, names: string[]) {
  for (const name of names) {
    const node = scene.getObjectByName(name);
    if (node) return node;
  }
  return null;
}

function createAvatarMotionRig(
  scene: Object3D,
  vrm: VRM | null
): AvatarMotionRig {
  const rig: AvatarMotionRig = {
    format: vrm ? "vrm" : "glb",
    head:
      vrm?.humanoid.getNormalizedBoneNode("head") ??
      findAvatarNode(scene, ["Head", "head"]),
    neck:
      vrm?.humanoid.getNormalizedBoneNode("neck") ??
      findAvatarNode(scene, ["Neck", "neck"]),
    chest:
      vrm?.humanoid.getNormalizedBoneNode("chest") ??
      findAvatarNode(scene, ["Chest", "chest", "UpperChest", "Upper_Chest"]),
    spine:
      vrm?.humanoid.getNormalizedBoneNode("spine") ??
      findAvatarNode(scene, ["Spine", "spine"]),
    leftEye:
      vrm?.humanoid.getNormalizedBoneNode("leftEye") ??
      findAvatarNode(scene, ["Eye_L", "LeftEye", "Left_Eye"]),
    rightEye:
      vrm?.humanoid.getNormalizedBoneNode("rightEye") ??
      findAvatarNode(scene, ["Eye_R", "RightEye", "Right_Eye"]),
    leftUpperArm:
      vrm?.humanoid.getNormalizedBoneNode("leftUpperArm") ??
      findAvatarNode(scene, ["Left_arm", "Left arm", "LeftUpperArm"]),
    leftLowerArm:
      vrm?.humanoid.getNormalizedBoneNode("leftLowerArm") ??
      findAvatarNode(scene, ["Left_elbow", "Left elbow", "LeftLowerArm"]),
    rightUpperArm:
      vrm?.humanoid.getNormalizedBoneNode("rightUpperArm") ??
      findAvatarNode(scene, ["Right_arm", "Right arm", "RightUpperArm"]),
    rightLowerArm:
      vrm?.humanoid.getNormalizedBoneNode("rightLowerArm") ??
      findAvatarNode(scene, ["Right_elbow", "Right elbow", "RightLowerArm"]),
    hips:
      vrm?.humanoid.getNormalizedBoneNode("hips") ??
      findAvatarNode(scene, ["Hips", "hips"]),
    leftUpperLeg:
      vrm?.humanoid.getNormalizedBoneNode("leftUpperLeg") ??
      findAvatarNode(scene, ["Left_leg", "Left leg", "LeftUpperLeg"]),
    leftLowerLeg:
      vrm?.humanoid.getNormalizedBoneNode("leftLowerLeg") ??
      findAvatarNode(scene, ["Left_knee", "Left knee", "LeftLowerLeg"]),
    rightUpperLeg:
      vrm?.humanoid.getNormalizedBoneNode("rightUpperLeg") ??
      findAvatarNode(scene, ["Right_leg", "Right leg", "RightUpperLeg"]),
    rightLowerLeg:
      vrm?.humanoid.getNormalizedBoneNode("rightLowerLeg") ??
      findAvatarNode(scene, ["Right_knee", "Right knee", "RightLowerLeg"]),
    baseQuaternions: new Map(),
  };

  const nodes = [
    rig.head,
    rig.neck,
    rig.chest,
    rig.spine,
    rig.leftEye,
    rig.rightEye,
    rig.leftUpperArm,
    rig.leftLowerArm,
    rig.rightUpperArm,
    rig.rightLowerArm,
    rig.hips,
    rig.leftUpperLeg,
    rig.leftLowerLeg,
    rig.rightUpperLeg,
    rig.rightLowerLeg,
  ];

  for (const node of nodes) {
    if (node && !rig.baseQuaternions.has(node)) {
      rig.baseQuaternions.set(node, node.quaternion.clone());
    }
  }

  return rig;
}

function resetAvatarMotionRig(rig: AvatarMotionRig) {
  rig.baseQuaternions.forEach((baseQuaternion, node) => {
    node.quaternion.copy(baseQuaternion);
  });
}

function dampMotionValue(
  current: number,
  target: number,
  response: number,
  delta: number
) {
  const value = current + (target - current) * (1 - Math.exp(-response * delta));
  return Math.abs(value - target) < 0.0001 ? target : value;
}

function applyGroundedCrawlPose(
  rig: AvatarMotionRig,
  elapsed: number,
  groundedAmount: number,
  locomotionAmount: number
) {
  const cycle = elapsed * 7.2;
  const stride = Math.sin(cycle) * locomotionAmount * groundedAmount;
  const counterStride = -stride;
  const leftPlant = Math.max(0, counterStride);
  const rightPlant = Math.max(0, stride);
  const waitingAmount = groundedAmount * (1 - locomotionAmount);
  const anticipation = Math.sin(elapsed * 2.4) * waitingAmount;
  const crawlBlend = locomotionAmount;

  // The avatar root turns into a right-facing profile below. In model space,
  // +Z then points toward screen-right. Folding the spine and hips toward +Z
  // gives the side silhouette a low, forward-reaching crawl posture.
  rig.hips?.rotateX(
    groundedAmount * (0.26 + crawlBlend * 0.39) + stride * 0.05
  );
  rig.spine?.rotateX(
    groundedAmount * (0.1 + crawlBlend * 0.32) - stride * 0.035
  );
  rig.chest?.rotateX(
    groundedAmount * (0.04 + crawlBlend * 0.14) + stride * 0.045
  );
  rig.chest?.rotateZ(stride * 0.035 + anticipation * 0.012);
  rig.head?.rotateX(
    -groundedAmount * (0.08 + crawlBlend * 0.2) - anticipation * 0.018
  );
  rig.head?.rotateZ(-stride * 0.025);
  rig.neck?.rotateX(-groundedAmount * (0.04 + crawlBlend * 0.08));

  if (rig.format === "glb") {
    // This FBX rig uses opposite local-Z rotations to swing the arms from its
    // prepared A-pose toward model-forward (+Z). Using local X here raises the
    // arms sideways and reads as running, so the profile crawl deliberately
    // keeps X small and plants the forearms below the shoulders.
    rig.leftUpperArm?.rotateZ(
      -groundedAmount * (0.32 + crawlBlend * 0.7) - stride * 0.24
    );
    rig.rightUpperArm?.rotateZ(
      groundedAmount * (0.32 + crawlBlend * 0.7) - counterStride * 0.24
    );
    rig.leftUpperArm?.rotateX(
      -groundedAmount * (0.02 + crawlBlend * 0.06) + stride * 0.04
    );
    rig.rightUpperArm?.rotateX(
      -groundedAmount * (0.02 + crawlBlend * 0.06) + counterStride * 0.04
    );
    rig.leftLowerArm?.rotateX(
      -groundedAmount * (0.12 + crawlBlend * 0.2) - leftPlant * 0.42
    );
    rig.rightLowerArm?.rotateX(
      -groundedAmount * (0.12 + crawlBlend * 0.2) - rightPlant * 0.42
    );
    rig.leftLowerArm?.rotateZ(-stride * 0.08);
    rig.rightLowerArm?.rotateZ(-counterStride * 0.08);
  } else {
    rig.leftUpperArm?.rotateX(-groundedAmount * 0.72 - stride * 0.34);
    rig.rightUpperArm?.rotateX(
      -groundedAmount * 0.72 - counterStride * 0.34
    );
    rig.leftUpperArm?.rotateZ(groundedAmount * 0.32);
    rig.rightUpperArm?.rotateZ(-groundedAmount * 0.32);
    rig.leftLowerArm?.rotateX(-groundedAmount * 0.68 - leftPlant * 0.24);
    rig.rightLowerArm?.rotateX(
      -groundedAmount * 0.68 - rightPlant * 0.24
    );
  }

  // Legs move opposite the corresponding arms: left hand with right knee,
  // right hand with left knee. The deep knee bend is what separates this
  // silhouette from an upright run cycle.
  rig.leftUpperLeg?.rotateX(
    -groundedAmount * (0.74 + crawlBlend * 0.08) + counterStride * 0.3
  );
  rig.rightUpperLeg?.rotateX(
    -groundedAmount * (0.74 + crawlBlend * 0.08) + stride * 0.3
  );
  rig.leftUpperLeg?.rotateZ(groundedAmount * 0.12 + counterStride * 0.035);
  rig.rightUpperLeg?.rotateZ(
    -groundedAmount * 0.12 + stride * 0.035
  );
  rig.leftLowerLeg?.rotateX(
    groundedAmount * (1.38 - crawlBlend * 0.1) + rightPlant * 0.3
  );
  rig.rightLowerLeg?.rotateX(
    groundedAmount * (1.38 - crawlBlend * 0.1) + leftPlant * 0.3
  );

  return {
    lift:
      -groundedAmount * (0.105 + crawlBlend * 0.03) +
      Math.abs(Math.cos(cycle)) * locomotionAmount * groundedAmount * 0.006 +
      anticipation * 0.002,
    roll: stride * 0.018 + anticipation * 0.006,
  };
}

function motionEnvelope(progress: number) {
  const fadeIn = MathUtils.smootherstep(progress, 0, 0.22);
  const fadeOut = 1 - MathUtils.smootherstep(progress, 0.72, 1);
  return fadeIn * fadeOut;
}

function applyMotion(
  rig: AvatarMotionRig,
  motion: ActiveMotion,
  elapsed: number,
  amplitude: number
) {
  const progress = MathUtils.clamp(
    (elapsed - motion.startedAt) / motion.duration,
    0,
    1
  );
  const envelope = motionEnvelope(progress) * amplitude;
  const direction = motion.direction;

  if (motion.kind === "look") {
    const glance = direction * envelope;
    rig.leftEye?.rotateY(glance * 0.2);
    rig.rightEye?.rotateY(glance * 0.2);
    rig.head?.rotateY(glance * 0.19);
    rig.head?.rotateX(-envelope * 0.025);
    rig.neck?.rotateY(glance * 0.07);
  } else if (motion.kind === "nod") {
    const nod = Math.sin(progress * Math.PI * 4) * envelope;
    rig.head?.rotateX(nod * 0.15);
    rig.neck?.rotateX(nod * 0.045);
  } else if (motion.kind === "tilt") {
    const tilt = direction * envelope;
    rig.head?.rotateZ(tilt * 0.17);
    rig.neck?.rotateZ(tilt * 0.045);
    rig.chest?.rotateZ(-tilt * 0.025);
  } else if (motion.kind === "bounce") {
    const bounce = Math.sin(progress * Math.PI) ** 2 * envelope;
    rig.chest?.rotateX(Math.sin(progress * Math.PI * 2) * envelope * 0.045);
    rig.spine?.rotateX(-Math.sin(progress * Math.PI * 2) * envelope * 0.02);
    return bounce * 0.055;
  } else {
    const isRight = direction > 0;
    const upperArm = isRight ? rig.rightUpperArm : rig.leftUpperArm;
    const lowerArm = isRight ? rig.rightLowerArm : rig.leftLowerArm;
    const side = isRight ? -1 : 1;
    const wave = Math.sin(progress * Math.PI * 8);

    if (rig.format === "vrm") {
      upperArm?.rotateZ(side * envelope * 0.72);
      upperArm?.rotateX(-envelope * 0.12);
      lowerArm?.rotateY(side * envelope * (0.48 + wave * 0.16));
      lowerArm?.rotateZ(side * envelope * 0.22);
    } else {
      // This FBX-derived GLB lowers both arms around local X in prepareGlbAvatar.
      // Reversing part of that rotation raises the selected arm for the wave.
      upperArm?.rotateX(envelope * 0.92);
      upperArm?.rotateY(side * envelope * 0.12);
      lowerArm?.rotateX(envelope * 0.38);
      lowerArm?.rotateZ(side * wave * envelope * 0.34);
    }
  }

  return 0;
}

function collectMorphBindings(scene: Object3D, names: string[]) {
  const bindings: MorphTargetBinding[] = [];

  scene.traverse((object) => {
    const target = object as MorphTargetObject;
    const dictionary = target.morphTargetDictionary;
    const influence = target.morphTargetInfluences;

    if (!dictionary || !influence) return;

    for (const name of names) {
      const index = dictionary[name];
      if (index !== undefined) bindings.push({ influence, index });
    }
  });

  return bindings;
}

function setMorphBindings(bindings: MorphTargetBinding[], value: number) {
  for (const binding of bindings) {
    binding.influence[binding.index] = value;
  }
}

function collectPreferredMorphBindings(scene: Object3D, names: string[]) {
  for (const name of names) {
    const bindings = collectMorphBindings(scene, [name]);
    if (bindings.length > 0) return bindings;
  }

  return [];
}

function prepareAvatar(vrm: VRM) {
  VRMUtils.rotateVRM0(vrm);
  VRMUtils.combineSkeletons(vrm.scene);
  VRMUtils.combineMorphs(vrm);
  VRMUtils.removeUnnecessaryVertices(vrm.scene);

  const leftUpperArm = vrm.humanoid.getNormalizedBoneNode("leftUpperArm");
  const rightUpperArm = vrm.humanoid.getNormalizedBoneNode("rightUpperArm");
  const leftLowerArm = vrm.humanoid.getNormalizedBoneNode("leftLowerArm");
  const rightLowerArm = vrm.humanoid.getNormalizedBoneNode("rightLowerArm");

  if (leftUpperArm) leftUpperArm.rotation.z = MathUtils.degToRad(62);
  if (rightUpperArm) rightUpperArm.rotation.z = MathUtils.degToRad(-62);
  if (leftLowerArm) leftLowerArm.rotation.y = MathUtils.degToRad(-8);
  if (rightLowerArm) rightLowerArm.rotation.y = MathUtils.degToRad(8);

  vrm.scene.updateMatrixWorld(true);
}

function createSapphyMaterial(source: MeshStandardMaterial) {
  const materialName = source.name;
  const isExpression = materialName === "Expression";
  const isTransparentCloth = materialName === "ClothTrans";
  const isTransparent = isExpression || isTransparentCloth;
  const isDoubleSided =
    materialName === "Hair" ||
    materialName === "Cloth" ||
    isTransparentCloth;

  const color = new Color(0xffffff);
  const shadeColor = new Color(0xffffff);
  let rimColor = new Color(0x000000);
  let rimFresnel = 1;

  if (materialName === "Body") {
    shadeColor.setRGB(0.9528302, 0.7383603, 0.7056337);
  } else if (materialName === "Hair") {
    color.setRGB(0.9473069, 0.9646866, 1);
    shadeColor.setRGB(0.7, 0.75, 0.85);
    rimColor = new Color(0xdceaff).multiplyScalar(0.12);
    rimFresnel = 2;
  } else if (materialName === "Cloth") {
    shadeColor.setRGB(0.7, 0.75, 0.85);
    rimColor = new Color(0xdceaff).multiplyScalar(0.08);
    rimFresnel = 2;
  } else if (isTransparentCloth) {
    color.setRGB(0.7924528, 0.7737629, 0.7737629);
    shadeColor.setRGB(0.7, 0.75, 0.85);
    rimColor = new Color(0xdceaff).multiplyScalar(0.08);
    rimFresnel = 2;
  }

  const material = new MToonMaterial({
    alphaTest: isExpression ? 0.001 : 0,
    color,
    depthWrite: true,
    giEqualizationFactor: 0.8,
    map: source.map ?? undefined,
    opacity: isTransparentCloth ? 0.8 : 1,
    parametricRimColorFactor: rimColor,
    parametricRimFresnelPowerFactor: rimFresnel,
    shadeColorFactor: shadeColor,
    shadingShiftFactor: -0.06,
    shadingToonyFactor: 0.92,
    side: isDoubleSided ? DoubleSide : FrontSide,
    transparent: isTransparent,
    transparentWithZWrite: isTransparent,
    v0CompatShade: true,
  });

  material.name = materialName;
  return material;
}

function prepareGlbAvatar(scene: Object3D) {
  const materialReplacements = new Map<
    MeshStandardMaterial,
    MToonMaterial
  >();

  scene.traverse((object) => {
    const target = object as Object3D & {
      material?: Material | Material[];
      morphTargetDictionary?: Record<string, number>;
      morphTargetInfluences?: number[];
    };
    const sourceMaterial = target.material;

    if (sourceMaterial) {
      const replace = (candidate: Material) => {
        if (!(candidate instanceof MeshStandardMaterial)) return candidate;

        let replacement = materialReplacements.get(candidate);
        if (!replacement) {
          replacement = createSapphyMaterial(candidate);
          materialReplacements.set(candidate, replacement);
        }
        return replacement;
      };

      target.material = Array.isArray(sourceMaterial)
        ? sourceMaterial.map(replace)
        : replace(sourceMaterial);
    }

    if (target.morphTargetInfluences) {
      target.morphTargetInfluences.fill(0);
    }
  });

  // Unity's prefab disables the optional glasses by default. FBX/glTF does
  // not carry that active-state override, so hide it explicitly here.
  const glasses = scene.getObjectByName("Glass");
  if (glasses) glasses.visible = false;

  // These two corrective morphs are both 100% in the source prefab. They
  // shrink the hidden body beneath sleeves and socks to prevent clipping.
  const body2 = scene.getObjectByName("Body2") as MorphTargetObject | undefined;
  if (body2?.morphTargetDictionary && body2.morphTargetInfluences) {
    for (const name of ["ArmShrink", "LegShrink"]) {
      const index = body2.morphTargetDictionary[name];
      if (index !== undefined) body2.morphTargetInfluences[index] = 1;
    }
  }

  // GLTFLoader sanitizes spaces in node names, while direct FBX-derived
  // scenes may still expose the original spelling.
  const leftUpperArm =
    scene.getObjectByName("Left_arm") ?? scene.getObjectByName("Left arm");
  const rightUpperArm =
    scene.getObjectByName("Right_arm") ?? scene.getObjectByName("Right arm");

  // The source FBX uses local X as the arm-lowering axis. Applying the same
  // rotation to both sides converts its export T-pose into a relaxed A-pose.
  if (leftUpperArm) leftUpperArm.rotateX(MathUtils.degToRad(-65));
  if (rightUpperArm) rightUpperArm.rotateX(MathUtils.degToRad(-65));

  scene.updateMatrixWorld(true);
  return Array.from(materialReplacements.values());
}

export function AvatarStage({
  interactionMode = "idle",
  modelUrl,
  onLoadStateChange,
  renderWidthScale = 1,
}: AvatarStageProps) {
  const { mouthLevelRef, phase } = useVoiceSession();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mountIdRef = useRef(crypto.randomUUID());
  const voicePhaseRef = useRef(phase);
  const interactionModeRef = useRef(interactionMode);
  const onLoadStateChangeRef = useRef(onLoadStateChange);
  const [modelUuid, setModelUuid] = useState("loading");
  const [modelFormat, setModelFormat] = useState("loading");
  const [blinkTargetCount, setBlinkTargetCount] = useState(0);

  useEffect(() => {
    voicePhaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    interactionModeRef.current = interactionMode;
  }, [interactionMode]);

  useEffect(() => {
    onLoadStateChangeRef.current = onLoadStateChange;
  }, [onLoadStateChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;

    if (!canvas || !container) return;

    onLoadStateChangeRef.current?.("loading");
    setModelUuid("loading");
    setModelFormat("loading");

    let disposed = false;
    let terminalFailure = false;
    let activeScene: Object3D | null = null;
    let pendingScene: Object3D | null = null;
    let activeVrm: VRM | null = null;
    let activeMToonMaterials: MToonMaterial[] = [];
    let blinkBindings: MorphTargetBinding[] = [];
    let mouthBindings: MorphTargetBinding[] = [];
    let motionRig: AvatarMotionRig | null = null;
    let reducedMotion = false;
    let avatarBaseY = 0;
    let smoothedMouthLevel = 0;
    let blinkStartedAt: number | null = null;
    let blinkDuration = 0.16;
    let nextBlinkAt = randomBetween(2.2, 4.8);
    let activeMotion: ActiveMotion | null = null;
    let nextMotionAt = randomBetween(1.4, 3.2);
    let groundedPoseAmount = 0;
    let crawlLocomotionAmount = 0;
    let sideFacingAmount = 0;
    const pointer = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };
    let smoothedGazeX = 0;
    let smoothedGazeY = 0;
    const avatarSize = new Vector3();

    const trackPointer = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    const resetPointer = () => {
      pointer.x = window.innerWidth * 0.5;
      pointer.y = window.innerHeight * 0.5;
    };
    const resetTouchPointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") resetPointer();
    };
    let rendererForLoss: WebGLRenderer | null = null;
    const handleContextLost = () => {
      terminalFailure = true;
      rendererForLoss?.setAnimationLoop(null);
      onLoadStateChangeRef.current?.("webgl-unavailable");
      setModelUuid("webgl-unavailable");
      setModelFormat("error");
    };
    canvas.addEventListener("webglcontextlost", handleContextLost);
    window.addEventListener("pointermove", trackPointer, { passive: true });
    window.addEventListener("pointerup", resetTouchPointer, { passive: true });
    window.addEventListener("pointercancel", resetTouchPointer, {
      passive: true,
    });
    window.addEventListener("blur", resetPointer);

    try {
      rendererForLoss = new WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
      });
    } catch (error) {
      setModelUuid("webgl-unavailable");
      setModelFormat("error");
      onLoadStateChangeRef.current?.("webgl-unavailable");
      console.warn("The companion avatar needs WebGL support", error);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      window.removeEventListener("pointermove", trackPointer);
      window.removeEventListener("pointerup", resetTouchPointer);
      window.removeEventListener("pointercancel", resetTouchPointer);
      window.removeEventListener("blur", resetPointer);
      return;
    }
    const renderer = rendererForLoss;
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);

    const scene = new Scene();
    const camera = new PerspectiveCamera(27, 1, 0.1, 20);
    camera.position.set(0, 0, 3.75);
    camera.lookAt(0, 0, 0);

    // Keep screen-space tilt separate from the character's side-facing yaw.
    // Combining both on one Euler rotates the tilt into depth once yaw reaches
    // 90 degrees, which makes the crawl keep reading as an upright diagonal.
    const avatarTiltRoot = new Group();
    const avatarRoot = new Group();
    avatarTiltRoot.add(avatarRoot);
    scene.add(avatarTiltRoot);

    scene.add(new AmbientLight(0xffffff, 1.1));

    const keyLight = new DirectionalLight(0xfff3ef, 0.8);
    keyLight.position.set(2.5, 3.5, 3);
    scene.add(keyLight);

    const fillLight = new DirectionalLight(0xdceaff, 0.25);
    fillLight.position.set(-2, 1.5, 1);
    scene.add(fillLight);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      reducedMotion = motionQuery.matches;
    };
    updateMotionPreference();
    motionQuery.addEventListener("change", updateMotionPreference);

    const frameAvatar = () => {
      if (avatarSize.y <= 0 || camera.aspect <= 0) return;

      const verticalFov = MathUtils.degToRad(camera.fov);
      const declaredWidthScale = Number(
        container.dataset.avatarRenderWidthScale
      );
      const framingAspect =
        camera.aspect /
        (Number.isFinite(declaredWidthScale) && declaredWidthScale > 0
          ? declaredWidthScale
          : 1);
      const horizontalFov =
        2 * Math.atan(Math.tan(verticalFov / 2) * framingAspect);
      const heightDistance = avatarSize.y / 2 / Math.tan(verticalFov / 2);
      const widthDistance = avatarSize.x / 2 / Math.tan(horizontalFov / 2);
      const distance = Math.max(heightDistance, widthDistance) * 1.08;

      camera.position.set(0, 0, distance);
      camera.lookAt(0, 0, 0);
    };

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (width <= 0 || height <= 0) return;

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      frameAvatar();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const timer = new Timer();
    timer.connect(document);
    renderer.setAnimationLoop(() => {
      timer.update();
      const delta = Math.min(timer.getDelta(), 0.05);
      const elapsed = timer.getElapsed();

      if (activeScene) {
        const phaseName = String(voicePhaseRef.current).toLowerCase();
        const rawMouthLevel = Number.isFinite(mouthLevelRef.current)
          ? MathUtils.clamp(mouthLevelRef.current, 0, 1)
          : 0;
        const mouthTarget =
          rawMouthLevel < 0.012
            ? 0
            : Math.pow(MathUtils.clamp(rawMouthLevel * 1.35, 0, 1), 0.72);
        const mouthResponse = mouthTarget > smoothedMouthLevel ? 22 : 11;
        smoothedMouthLevel +=
          (mouthTarget - smoothedMouthLevel) *
          (1 - Math.exp(-mouthResponse * delta));
        const isVoiceSessionActive =
          phaseName === "connected" ||
          phaseName.includes("speak") ||
          phaseName.includes("talk");
        const isTalking =
          isVoiceSessionActive &&
          (rawMouthLevel > 0.025 || smoothedMouthLevel > 0.04);
        const idleAmplitude = isTalking ? 0.42 : 1;

        let blink = 0;
        if (!reducedMotion) {
          if (blinkStartedAt === null && elapsed >= nextBlinkAt) {
            blinkStartedAt = elapsed;
            blinkDuration = randomBetween(0.13, 0.19);
          }

          if (blinkStartedAt !== null) {
            const blinkProgress = (elapsed - blinkStartedAt) / blinkDuration;
            if (blinkProgress >= 1) {
              blinkStartedAt = null;
              nextBlinkAt = elapsed + randomBetween(2.1, 5.1);
            } else {
              blink = Math.sin(blinkProgress * Math.PI) ** 0.75;
            }
          }
        } else {
          blinkStartedAt = null;
          nextBlinkAt = elapsed + randomBetween(2.1, 5.1);
        }

        let motionBounce = 0;
        let groundedLift = 0;
        let groundedRoll = 0;
        const interaction = interactionModeRef.current;
        if (motionRig) {
          // Every pose starts from the cached post-prepare quaternion. This
          // prevents tiny per-frame rotations from accumulating over time.
          resetAvatarMotionRig(motionRig);

          const groundedTarget = interaction === "returning" ? 1 : 0;
          const locomotionTarget = interaction === "returning" ? 1 : 0;
          const sideFacingTarget = interaction === "returning" ? 1 : 0;

          if (reducedMotion) {
            groundedPoseAmount = groundedTarget;
            crawlLocomotionAmount = 0;
            sideFacingAmount = sideFacingTarget;
          } else {
            const groundedResponse =
              groundedTarget > groundedPoseAmount
                ? 10.5
                : 6.5;
            groundedPoseAmount = dampMotionValue(
              groundedPoseAmount,
              groundedTarget,
              groundedResponse,
              delta
            );
            crawlLocomotionAmount = dampMotionValue(
              crawlLocomotionAmount,
              locomotionTarget,
              locomotionTarget > crawlLocomotionAmount ? 9.5 : 7,
              delta
            );
            sideFacingAmount = dampMotionValue(
              sideFacingAmount,
              sideFacingTarget,
              sideFacingTarget > sideFacingAmount ? 10 : 8,
              delta
            );
          }

          if (reducedMotion) {
            activeMotion = null;
            nextMotionAt = elapsed + randomBetween(1.8, 3.6);
            if (groundedPoseAmount > 0) {
              const crawlPose = applyGroundedCrawlPose(
                motionRig,
                0,
                groundedPoseAmount,
                0
              );
              groundedLift = crawlPose.lift;
            }
          } else if (interaction === "dragging") {
            activeMotion = null;
            nextMotionAt = elapsed + randomBetween(1.8, 3.6);

            const step = Math.sin(elapsed * 12);
            const lift = Math.abs(step);
            const armAmount = 0.5;
            motionRig.leftUpperArm?.rotateZ(armAmount + step * 0.16);
            motionRig.rightUpperArm?.rotateZ(-armAmount + step * 0.16);
            if (motionRig.format === "glb") {
              motionRig.leftUpperArm?.rotateX(0.34 + step * 0.16);
              motionRig.rightUpperArm?.rotateX(0.34 - step * 0.16);
            }
            motionRig.leftLowerArm?.rotateX(-lift * 0.26);
            motionRig.rightLowerArm?.rotateX(-lift * 0.26);
            motionRig.chest?.rotateZ(step * 0.13);
            motionRig.spine?.rotateY(step * 0.08);
            motionRig.hips?.rotateZ(-step * 0.12);
            motionRig.leftUpperLeg?.rotateX(step * 0.34);
            motionRig.rightUpperLeg?.rotateX(-step * 0.34);
            motionRig.leftLowerLeg?.rotateX(
              Math.max(0, -step) * 0.44
            );
            motionRig.rightLowerLeg?.rotateX(
              Math.max(0, step) * 0.44
            );
            motionRig.head?.rotateZ(-step * 0.1);
            motionBounce = lift * 0.05;
          } else if (interaction === "waiting") {
            // During the short post-drag pause KIRA stays upright, faces the
            // visitor and only uses the gaze layer below. The crawl pose starts
            // after the one-second timer changes the mode to `returning`.
            activeMotion = null;
            nextMotionAt = elapsed + randomBetween(1.8, 3.6);
          } else if (
            interaction === "returning" ||
            groundedPoseAmount > 0.001
          ) {
            activeMotion = null;
            nextMotionAt = elapsed + randomBetween(1.8, 3.6);
            const crawlPose = applyGroundedCrawlPose(
              motionRig,
              elapsed,
              groundedPoseAmount,
              crawlLocomotionAmount
            );
            groundedLift = crawlPose.lift;
            groundedRoll = crawlPose.roll;
          } else {
            if (
              activeMotion &&
              elapsed - activeMotion.startedAt >= activeMotion.duration
            ) {
              activeMotion = null;
              nextMotionAt =
                elapsed +
                randomBetween(isTalking ? 2.8 : 1.5, isTalking ? 5.2 : 3.8);
            }

            if (!activeMotion && elapsed >= nextMotionAt) {
              const kind =
                MOTION_KINDS[Math.floor(Math.random() * MOTION_KINDS.length)];
              const duration =
                kind === "wave"
                  ? randomBetween(1.9, 2.5)
                  : kind === "bounce"
                    ? randomBetween(0.85, 1.2)
                    : randomBetween(1.1, 1.8);
              activeMotion = {
                direction: Math.random() < 0.5 ? -1 : 1,
                duration,
                kind,
                startedAt: elapsed,
              };
            }

            if (activeMotion) {
              motionBounce = applyMotion(
                motionRig,
                activeMotion,
                elapsed,
                isTalking ? 0.36 : 1
              );
            }
          }

          // Eye and head tracking is applied after idle/interaction poses so
          // KIRA continues to look at the pointer during every animation.
          const bounds = container.getBoundingClientRect();
          const centerX = bounds.left + bounds.width * 0.5;
          const faceY = bounds.top + bounds.height * 0.24;
          const gazeX = MathUtils.clamp(
            (pointer.x - centerX) / Math.max(window.innerWidth * 0.32, 1),
            -1,
            1
          );
          const gazeY = MathUtils.clamp(
            (pointer.y - faceY) / Math.max(window.innerHeight * 0.34, 1),
            -1,
            1
          );
          const gazeResponse = 1 - Math.exp(-14 * delta);
          smoothedGazeX += (gazeX - smoothedGazeX) * gazeResponse;
          smoothedGazeY += (gazeY - smoothedGazeY) * gazeResponse;
          motionRig.leftEye?.rotateY(smoothedGazeX * 0.2);
          motionRig.rightEye?.rotateY(smoothedGazeX * 0.2);
          motionRig.leftEye?.rotateX(smoothedGazeY * 0.12);
          motionRig.rightEye?.rotateX(smoothedGazeY * 0.12);
          motionRig.head?.rotateY(
            smoothedGazeX * 0.095 * (1 - sideFacingAmount * 0.88)
          );
          motionRig.head?.rotateX(smoothedGazeY * 0.055);
          motionRig.neck?.rotateY(
            smoothedGazeX * 0.025 * (1 - sideFacingAmount * 0.88)
          );
        }

        // A profile crawl exposes the model's depth as screen width. Pull the
        // character back slightly and recenter it so the face, hands and feet
        // stay inside the intentionally narrow floating canvas.
        // The parent widens the transparent WebGL stage during a crawl, so the
        // horizontal character can stay at its full upright size. Scaling the
        // model itself here would recreate the visible compression we avoid.
        avatarRoot.scale.setScalar(1);
        avatarRoot.position.x = 0;
        avatarRoot.position.y =
          avatarBaseY +
          (reducedMotion
            ? 0
            : Math.sin(elapsed * 0.85) *
              0.008 *
              idleAmplitude *
              (1 - groundedPoseAmount)) +
          motionBounce +
          // Once the character is horizontal, applying the full upright
          // crouch offset pushes the rotated silhouette toward the lower-left
          // edge. Keep only a small grounding offset so all four limbs remain
          // centered and readable inside the narrow persistent canvas.
          groundedLift * (1 - sideFacingAmount * 0.82);
        avatarRoot.rotation.x = 0;
        avatarRoot.rotation.y =
          sideFacingAmount * (Math.PI / 2) +
          (reducedMotion
            ? 0
            : Math.sin(elapsed * 0.32) *
              0.025 *
              idleAmplitude *
              (1 - sideFacingAmount));
        avatarRoot.rotation.z = 0;

        // After turning to profile, rotate that entire profile clockwise in
        // the camera plane. Roughly 50 degrees changes this model's naturally
        // rising 45-degree silhouette into a nearly horizontal crawl with the
        // head leading slightly toward the lower-right corner.
        avatarTiltRoot.rotation.z =
          -MathUtils.degToRad(50) * sideFacingAmount +
          (reducedMotion
          ? 0
          : interaction === "dragging"
            ? Math.sin(elapsed * 10) * 0.065
            : groundedRoll);

        if (activeVrm) {
          activeVrm.expressionManager?.setValue(
            VRMExpressionPresetName.Blink,
            blink
          );
          activeVrm.expressionManager?.setValue(
            VRMExpressionPresetName.Aa,
            smoothedMouthLevel
          );
          activeVrm.update(delta);
        } else {
          setMorphBindings(blinkBindings, blink);
          setMorphBindings(mouthBindings, smoothedMouthLevel);
          for (const material of activeMToonMaterials) material.update(delta);
        }
      }

      renderer.render(scene, camera);
    });

    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));

    loader
      .loadAsync(modelUrl)
      .then((gltf) => {
        const vrm = gltf.userData.vrm as VRM | undefined;
        const avatarScene = vrm?.scene ?? gltf.scene;
        pendingScene = avatarScene;

        if (disposed || terminalFailure) {
          VRMUtils.deepDispose(avatarScene);
          pendingScene = null;
          return;
        }

        if (vrm) {
          prepareAvatar(vrm);
          setModelFormat("vrm");
        } else {
          activeMToonMaterials = prepareGlbAvatar(avatarScene);
          const joyBindings = collectMorphBindings(avatarScene, ["prefab_Joy1"]);
          setMorphBindings(joyBindings, 1);
          blinkBindings = collectMorphBindings(avatarScene, ["まばたき"]);
          mouthBindings = collectPreferredMorphBindings(avatarScene, [
            "vrc.v_aa",
            "MouthOpen1",
            "あ",
          ]);
          setBlinkTargetCount(blinkBindings.length);
          setModelFormat("glb");
        }

        motionRig = createAvatarMotionRig(avatarScene, vrm ?? null);

        const avatarBounds = new Box3().setFromObject(avatarScene);
        const avatarCenter = avatarBounds.getCenter(new Vector3());
        avatarBounds.getSize(avatarSize);
        avatarRoot.position.set(-avatarCenter.x, -avatarCenter.y, -avatarCenter.z);
        avatarBaseY = avatarRoot.position.y;
        frameAvatar();

        activeScene = avatarScene;
        pendingScene = null;
        activeVrm = vrm ?? null;
        avatarRoot.add(avatarScene);
        setModelUuid(avatarScene.uuid);
        onLoadStateChangeRef.current?.("ready");
      })
      .catch((error: unknown) => {
        if (disposed || terminalFailure) return;
        renderer.setAnimationLoop(null);
        if (pendingScene) {
          VRMUtils.deepDispose(pendingScene);
          pendingScene = null;
        }
        setModelUuid("error");
        setModelFormat("error");
        onLoadStateChangeRef.current?.("error");
        console.error("Persistent companion avatar failed to load", error);
      });

    return () => {
      disposed = true;
      renderer.setAnimationLoop(null);
      resizeObserver.disconnect();
      motionQuery.removeEventListener("change", updateMotionPreference);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      window.removeEventListener("pointermove", trackPointer);
      window.removeEventListener("pointerup", resetTouchPointer);
      window.removeEventListener("pointercancel", resetTouchPointer);
      window.removeEventListener("blur", resetPointer);
      timer.dispose();

      if (activeScene) {
        avatarRoot.remove(activeScene);
        VRMUtils.deepDispose(activeScene);
      }
      if (pendingScene) VRMUtils.deepDispose(pendingScene);

      renderer.dispose();
    };
  }, [modelUrl, mouthLevelRef]);

  return (
    <div
      className="relative h-full w-full"
      data-avatar-render-width-scale={renderWidthScale}
      data-avatar-mount-id={mountIdRef.current}
      data-avatar-model-uuid={modelUuid}
      data-avatar-format={modelFormat}
      data-avatar-blink-targets={blinkTargetCount}
      data-avatar-runtime="three"
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none block h-full w-full"
      />
      {(modelUuid === "error" || modelUuid === "webgl-unavailable") && (
        <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-sky-200 bg-white/95 px-3 py-1.5 text-xs font-semibold tracking-[0.14em] text-sky-800 shadow-lg">
          KIRA
        </span>
      )}
    </div>
  );
}
