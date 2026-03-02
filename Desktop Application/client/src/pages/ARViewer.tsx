import React, { Suspense, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, ContactShadows } from '@react-three/drei';
import apiClient from '../utils/apiClient';
import { map2Dto3D } from '../utils/coordinateMapper';

const FURNITURE_HEIGHT: Record<string, number> = {
    Table: 0.75, Chair: 0.85, Sofa: 0.70, Window: 0.05, Door: 0.05, Desk: 0.75
};

const FURNITURE_TEMPLATES = [
    { name: 'Table', w: 100, h: 60 },
    { name: 'Chair', w: 45, h: 45 },
    { name: 'Sofa', w: 160, h: 65 },
    { name: 'Window', w: 80, h: 10 },
    { name: 'Door', w: 40, h: 80 },
    { name: 'Desk', w: 90, h: 50 },
];

const ARViewer = () => {
    const { id } = useParams<{ id: string }>();
    const [design, setDesign] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDesign = async () => {
            try {
                const res = await apiClient.get(`/api/public/designs/${id}`);
                setDesign(res.data.data.design);
            } catch (err) {
                console.error('Failed to load AR design', err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchDesign();
    }, [id]);

    if (loading) return <div className="flex h-screen w-screen items-center justify-center bg-slate-900 text-white font-bold">Loading AR Model...</div>;
    if (!design) return <div className="flex h-screen w-screen items-center justify-center bg-slate-900 text-red-400 font-bold">Failed to load design.</div>;

    const roomWidth = design.room?.width || 8;
    const roomHeight = design.room?.height || 6;

    return (
        <div className="w-screen h-screen bg-slate-950 flex flex-col relative overflow-hidden">
            {/* Absolute Header Overlay */}
            <div className="absolute top-0 left-0 w-full z-10 p-4 bg-gradient-to-b from-black/80 to-transparent">
                <h2 className="text-white font-black text-lg drop-shadow-lg text-center tracking-wide">{design.name}</h2>
                <p className="text-center text-xs text-slate-300 drop-shadow-md">AR Mode</p>
            </div>

            <Canvas shadows camera={{ position: [0, 2, 5], fov: 60 }}>
                <Suspense fallback={null}>
                    <Environment preset="city" />
                    <ambientLight intensity={0.7} />
                    <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />

                    {/* Furniture Rendering using the exact exact exact mapping logic inside Viewer3D */}
                    <group position={[0, -0.5, 0]}>
                        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                            <planeGeometry args={[roomWidth, roomHeight]} />
                            <meshStandardMaterial color={design.room?.color || '#334155'} roughness={0.8} />
                        </mesh>

                        {(design.furniture || []).map((f: any, i: number) => {
                            const tmpl = FURNITURE_TEMPLATES.find(t => t.name === f.type);
                            const w = tmpl ? tmpl.w / 50 : 80 / 50;
                            const h = tmpl ? tmpl.h / 50 : 60 / 50;
                            const yHeight = FURNITURE_HEIGHT[f.type] ?? 0.5;

                            // Ensure we fallback safely if f.x or f.y is somehow unmapped
                            const threePos = map2Dto3D({ x: f.x || 80, y: f.y || 80 }, { width: roomWidth, height: roomHeight });

                            let roughness = 0.55;
                            let metalness = 0.08;

                            if (f.material === 'wood') { roughness = 0.85; metalness = 0.05; }
                            else if (f.material === 'metal') { roughness = 0.2; metalness = 0.85; }
                            else if (f.material === 'fabric') { roughness = 0.95; metalness = 0.0; }

                            return (
                                <mesh key={i} position={[threePos.x + w / 2, yHeight / 2, threePos.z + h / 2]} castShadow receiveShadow>
                                    <boxGeometry args={[w, yHeight, h]} />
                                    <meshStandardMaterial color={f.color} roughness={roughness} metalness={metalness} />
                                </mesh>
                            );
                        })}
                    </group>

                    <ContactShadows position={[0, -0.49, 0]} opacity={0.6} scale={15} blur={2.5} far={5} />
                    <OrbitControls makeDefault enableDamping />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default ARViewer;
