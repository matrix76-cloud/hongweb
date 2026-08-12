// src/components/DevHeroParticles.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { BloomPass } from "three/examples/jsm/postprocessing/BloomPass.js";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js";
import { FocusShader } from "three/examples/jsm/shaders/FocusShader.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

export default function DevHeroParticles({
    style,
    className,
    height = 240, // ✅ 부모에서 height:100% 주면 자동으로 따라가도록 아래에서 처리
}) {
    const wrapRef = useRef(null);

    useEffect(() => {
        const wrap = wrapRef.current;
        if (!wrap) return;

        let destroyed = false;

        // -----------------------
        // Scene / Camera / Renderer
        // -----------------------
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000104);
        scene.fog = new THREE.FogExp2(0x000104, 0.0000675);

        const camera = new THREE.PerspectiveCamera(20, 1, 1, 50000);

        // ✅ 모바일에서 위 검은 여백 줄이기(살짝만)
        const isMobile = window.matchMedia?.("(max-width: 420px)")?.matches;
        camera.position.set(0, isMobile ? 560 : 700, isMobile ? 6400 : 7000);
        camera.lookAt(scene.position);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.autoClear = false;

        // ✅ 캔버스가 부모를 무조건 꽉 채우게 강제
        const canvas = renderer.domElement;
        canvas.style.position = "absolute";
        canvas.style.inset = "0";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.display = "block";

        // ✅ wrap도 relative + overflow hidden 보장
        wrap.style.position = "relative";
        wrap.style.overflow = "hidden";

        wrap.appendChild(canvas);

        // parent
        const parent = new THREE.Object3D();
        scene.add(parent);

        // grid
        const grid = new THREE.Points(
            new THREE.PlaneGeometry(15000, 15000, 64, 64),
            new THREE.PointsMaterial({ color: 0xff0000, size: 10 })
        );
        grid.position.y = -400;
        grid.rotation.x = -Math.PI / 2;
        parent.add(grid);

        // -----------------------
        // Postprocessing
        // -----------------------
        const renderModel = new RenderPass(scene, camera);
        const effectBloom = new BloomPass(0.75);
        const effectFilm = new FilmPass();
        const effectFocus = new ShaderPass(FocusShader);
        const outputPass = new OutputPass();

        const composer = new EffectComposer(renderer);
        composer.addPass(renderModel);
        composer.addPass(effectBloom);
        composer.addPass(effectFilm);
        composer.addPass(effectFocus);
        composer.addPass(outputPass);

        // -----------------------
        // Data containers
        // -----------------------
        const meshes = [];
        const clonemeshes = [];
        const clock = new THREE.Clock();

        function combineBuffer(model, bufferName) {
            let count = 0;

            model.traverse((child) => {
                if (child && child.isMesh) {
                    const buffer = child.geometry?.attributes?.[bufferName];
                    if (buffer?.array?.length) count += buffer.array.length;
                }
            });

            const combined = new Float32Array(count);
            let offset = 0;

            model.traverse((child) => {
                if (child && child.isMesh) {
                    const buffer = child.geometry?.attributes?.[bufferName];
                    if (buffer?.array?.length) {
                        combined.set(buffer.array, offset);
                        offset += buffer.array.length;
                    }
                }
            });

            return new THREE.BufferAttribute(combined, 3);
        }

        function createMesh(positions, scale, x, y, z, color) {
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute("position", positions.clone());
            geometry.setAttribute("initialPosition", positions.clone());
            geometry.attributes.position.setUsage(THREE.DynamicDrawUsage);

            const clones = [
                [6000, 0, -4000],
                [5000, 0, 0],
                [1000, 0, 5000],
                [1000, 0, -5000],
                [4000, 0, 2000],
                [-4000, 0, 1000],
                [-5000, 0, -5000],
                [0, 0, 0],
            ];

            let lastMesh = null;

            for (let i = 0; i < clones.length; i++) {
                const c = i < clones.length - 1 ? 0x252525 : color;

                const m = new THREE.Points(
                    geometry,
                    new THREE.PointsMaterial({ size: 30, color: c })
                );
                m.scale.set(scale, scale, scale);

                m.position.set(x + clones[i][0], y + clones[i][1], z + clones[i][2]);

                parent.add(m);
                clonemeshes.push({ mesh: m, speed: 0.5 + Math.random() });
                lastMesh = m;
            }

            meshes.push({
                mesh: lastMesh,
                verticesDown: 0,
                verticesUp: 0,
                direction: 0,
                speed: 15,
                delay: Math.floor(200 + 200 * Math.random()),
                start: Math.floor(100 + 200 * Math.random()),
            });
        }

        // -----------------------
        // Load OBJ
        // -----------------------
        const loader = new OBJLoader();

        loader.load(
            "/three/male02.obj",
            (object) => {
                if (destroyed) return;
                const positions = combineBuffer(object, "position");
                createMesh(positions, 4.05, -500, -350, 600, 0xff7744);
                createMesh(positions, 4.05, 500, -350, 0, 0xff5522);
                createMesh(positions, 4.05, -250, -350, 1500, 0xff9922);
                createMesh(positions, 4.05, -250, -350, -1500, 0xff99ff);
            },
            undefined,
            (err) => console.warn("male02.obj load fail:", err)
        );

        loader.load(
            "/three/female02.obj",
            (object) => {
                if (destroyed) return;
                const positions = combineBuffer(object, "position");
                createMesh(positions, 4.05, -1000, -350, 0, 0xffdd44);
                createMesh(positions, 4.05, 0, -350, 0, 0xffffff);
                createMesh(positions, 4.05, 1000, -350, 400, 0xff4422);
                createMesh(positions, 4.05, 250, -350, 1500, 0xff9955);
                createMesh(positions, 4.05, 250, -350, 2500, 0xff77dd);
            },
            undefined,
            (err) => console.warn("female02.obj load fail:", err)
        );

        // -----------------------
        // Resize
        // -----------------------
        const resize = () => {
            if (!wrap) return;

            // ✅ wrap이 display:none이거나 높이 0이면 안전 처리
            const w = Math.max(1, wrap.clientWidth || 1);
            const h = Math.max(1, wrap.clientHeight || 1);

            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            camera.lookAt(scene.position);

            renderer.setSize(w, h, false);
            composer.setSize(w, h);

            effectFocus.uniforms.screenWidth.value = w * (window.devicePixelRatio || 1);
            effectFocus.uniforms.screenHeight.value = h * (window.devicePixelRatio || 1);
        };

        // ✅ 첫 렌더 직후 한 번 더(레이아웃 안정화)
        resize();
        const t = setTimeout(resize, 0);

        window.addEventListener("resize", resize);

        // -----------------------
        // Animation Loop
        // -----------------------
        let raf = 0;
        const animate = () => {
            if (destroyed) return;
            raf = requestAnimationFrame(animate);

            let delta = 10 * clock.getDelta();
            delta = delta < 2 ? delta : 2;

            parent.rotation.y += -0.02 * delta;

            for (let j = 0; j < clonemeshes.length; j++) {
                const cm = clonemeshes[j];
                cm.mesh.rotation.y += -0.1 * delta * cm.speed;
            }

            for (let j = 0; j < meshes.length; j++) {
                const data = meshes[j];
                const positions = data.mesh.geometry.attributes.position;
                const initialPositions = data.mesh.geometry.attributes.initialPosition;

                const count = positions.count;

                if (data.start > 0) data.start -= 1;
                else if (data.direction === 0) data.direction = -1;

                for (let i = 0; i < count; i++) {
                    const px = positions.getX(i);
                    const py = positions.getY(i);
                    const pz = positions.getZ(i);

                    // falling down
                    if (data.direction < 0) {
                        if (py > 0) {
                            positions.setXYZ(
                                i,
                                px + 1.5 * (0.5 - Math.random()) * data.speed * delta,
                                py + 3.0 * (0.25 - Math.random()) * data.speed * delta,
                                pz + 1.5 * (0.5 - Math.random()) * data.speed * delta
                            );
                        } else {
                            data.verticesDown += 1;
                        }
                    }

                    // rising up
                    if (data.direction > 0) {
                        const ix = initialPositions.getX(i);
                        const iy = initialPositions.getY(i);
                        const iz = initialPositions.getZ(i);

                        const dx = Math.abs(px - ix) || 1;
                        const dy = Math.abs(py - iy) || 1;
                        const dz = Math.abs(pz - iz) || 1;

                        const d = dx + dy + dx;

                        if (d > 1) {
                            positions.setXYZ(
                                i,
                                px - ((px - ix) / dx) * data.speed * delta * (0.85 - Math.random()),
                                py - ((py - iy) / dy) * data.speed * delta * (1 + Math.random()),
                                pz - ((pz - iz) / dz) * data.speed * delta * (0.85 - Math.random())
                            );
                        } else {
                            data.verticesUp += 1;
                        }
                    }
                }

                // all vertices down
                if (data.verticesDown >= count) {
                    if (data.delay <= 0) {
                        data.direction = 1;
                        data.speed = 5;
                        data.verticesDown = 0;
                        data.delay = 320;
                    } else data.delay -= 1;
                }

                // all vertices up
                if (data.verticesUp >= count) {
                    if (data.delay <= 0) {
                        data.direction = -1;
                        data.speed = 15;
                        data.verticesUp = 0;
                        data.delay = 120;
                    } else data.delay -= 1;
                }

                positions.needsUpdate = true;
            }

            composer.render(0.01);
        };

        animate();

        return () => {
            destroyed = true;
            clearTimeout(t);
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(raf);

            try {
                composer?.dispose?.();
            } catch { }

            try {
                renderer?.dispose?.();
            } catch { }

            if (renderer?.domElement && renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }

            scene.traverse((obj) => {
                if (obj.geometry) obj.geometry.dispose?.();
                if (obj.material) {
                    if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose?.());
                    else obj.material.dispose?.();
                }
            });
        };
    }, []);

    // ✅ height가 숫자면 px로, 부모에서 100% 주고 싶으면 height="100%"로 넘겨도 됨
    const resolvedHeight = typeof height === "number" ? `${height}px` : height;

    return (
        <div
            ref={wrapRef}
            className={className}
            style={{
                width: "100%",
                height: resolvedHeight,
                borderRadius: 18,
                overflow: "hidden",
                background: "#000104",
                position: "relative",
                ...style,
            }}
        />
    );
}
