import React, { Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Grid, SoftShadows } from '@react-three/drei';
import { map2Dto3D } from '../utils/coordinateMapper';

export interface Furniture {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  name: string;
  price: number;
  material?: string;
}

interface Viewer3DProps {
  roomWidth: number;
  roomHeight: number;
  furniture: Furniture[];
  selectedId?: string | null;
  ambientIntensity?: number;
  pointIntensity?: number;
  softShadows?: boolean;
  roomColor?: string;
  timeOfDay?: 'morning' | 'noon' | 'evening' | 'night';
  isFirstPerson?: boolean;
}

const FURNITURE_HEIGHT: Record<string, number> = {
  Table: 0.75,
  Chair: 0.85,
  Sofa: 0.70,
  Window: 0.05,
  Door: 0.05,
};

const FurnitureBox = ({
  item,
  roomDims,
  isSelected,
}: {
  item: Furniture;
  roomDims: { width: number; height: number };
  isSelected?: boolean;
}) => {
  const safeX = Number(item.x) || 80;
  const safeY = Number(item.y) || 80;
  const safeRoomW = Number(roomDims.width) || 8;
  const safeRoomH = Number(roomDims.height) || 6;
  const safeW = Number(item.width) || 80;
  const safeH = Number(item.height) || 60;

  const threePos = map2Dto3D({ x: safeX, y: safeY }, { width: safeRoomW, height: safeRoomH });
  const width3D = safeW / 50;
  const depth3D = safeH / 50;
  const height3D = FURNITURE_HEIGHT[item.name] || 0.5;

  let roughness = 0.55;
  let metalness = 0.08;

  if (item.material === 'wood') {
    roughness = 0.85;
    metalness = 0.05;
  } else if (item.material === 'metal') {
    roughness = 0.2;
    metalness = 0.85;
  } else if (item.material === 'fabric') {
    roughness = 0.95;
    metalness = 0.0;
  }

  const mProps = {
    color: item.color,
    roughness,
    metalness,
    emissive: isSelected ? '#0ea5e9' : '#000000',
    emissiveIntensity: isSelected ? 0.35 : 0
  };

  const renderShape = () => {
    if (item.name === 'Table' || item.name === 'Desk') {
      return (
        <group>
          {/* Top */}
          <mesh position={[0, height3D - 0.05, 0]} castShadow receiveShadow>
            <boxGeometry args={[width3D, 0.1, depth3D]} />
            <meshStandardMaterial {...mProps} />
          </mesh>
          {/* Legs */}
          {[-1, 1].map(x => [-1, 1].map(z => (
            <mesh key={`${x}-${z}`} position={[x * (width3D / 2 - 0.05), (height3D - 0.1) / 2, z * (depth3D / 2 - 0.05)]} castShadow receiveShadow>
              <boxGeometry args={[0.08, height3D - 0.1, 0.08]} />
              <meshStandardMaterial {...mProps} />
            </mesh>
          )))}
        </group>
      );
    }
    if (item.name === 'Chair') {
      return (
        <group>
          {/* Seat */}
          <mesh position={[0, height3D * 0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[width3D, 0.08, depth3D]} />
            <meshStandardMaterial {...mProps} />
          </mesh>
          {/* Backrest */}
          <mesh position={[0, height3D * 0.8, -depth3D / 2 + 0.04]} castShadow receiveShadow>
            <boxGeometry args={[width3D, height3D * 0.6, 0.08]} />
            <meshStandardMaterial {...mProps} />
          </mesh>
          {/* Legs */}
          {[-1, 1].map(x => [-1, 1].map(z => (
            <mesh key={`${x}-${z}`} position={[x * (width3D / 2 - 0.04), height3D * 0.225, z * (depth3D / 2 - 0.04)]} castShadow receiveShadow>
              <boxGeometry args={[0.06, height3D * 0.45, 0.06]} />
              <meshStandardMaterial {...mProps} />
            </mesh>
          )))}
        </group>
      );
    }
    if (item.name === 'Sofa') {
      return (
        <group>
          {/* Seat base */}
          <mesh position={[0, height3D * 0.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[width3D, height3D * 0.4, depth3D * 0.9]} />
            <meshStandardMaterial {...mProps} />
          </mesh>
          {/* Backrest */}
          <mesh position={[0, height3D * 0.65, -depth3D / 2 + depth3D * 0.1]} castShadow receiveShadow>
            <boxGeometry args={[width3D, height3D * 0.7, depth3D * 0.2]} />
            <meshStandardMaterial {...mProps} />
          </mesh>
          {/* Arm rests */}
          {[-1, 1].map(x => (
            <mesh key={x} position={[x * (width3D / 2 - width3D * 0.05), height3D * 0.45, 0]} castShadow receiveShadow>
              <boxGeometry args={[width3D * 0.1, height3D * 0.6, depth3D]} />
              <meshStandardMaterial {...mProps} />
            </mesh>
          ))}
        </group>
      );
    }

    // Default Box
    return (
      <mesh position={[0, height3D / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width3D, height3D, depth3D]} />
        <meshStandardMaterial {...mProps} />
      </mesh>
    );
  };

  return (
    <group position={[threePos.x + width3D / 2, 0, threePos.z + depth3D / 2]}>
      {renderShape()}
    </group>
  );
};

const Viewer3D = ({
  roomWidth,
  roomHeight,
  furniture,
  selectedId = null,
  ambientIntensity = 0.6,
  pointIntensity = 1.2,
  softShadows = false,
  roomColor = '#334155',
  timeOfDay = 'noon',
  isFirstPerson = false
}: Viewer3DProps) => {

  let dirLightPos: [number, number, number] = [0, 15, 0];
  let dirLightColor = '#ffffff';
  let ambientCol = '#ffffff';
  let pointCol = '#4f9eff';
  let pIntMult = 1.0;
  let aIntMult = 1.0;

  if (timeOfDay === 'morning') {
    dirLightPos = [15, 5, 15];
    dirLightColor = '#ffecd6';
    ambientCol = '#ffe4cc';
    pointCol = '#ffaa66';
    pIntMult = 1.2;
    aIntMult = 0.9;
  } else if (timeOfDay === 'evening') {
    dirLightPos = [-20, 2, -20];
    dirLightColor = '#ff7700';
    ambientCol = '#ffaa66';
    pointCol = '#ff6600';
    pIntMult = 1.8;
    aIntMult = 0.7;
  } else if (timeOfDay === 'night') {
    dirLightPos = [5, 15, 5];
    dirLightColor = '#6666bb';
    ambientCol = '#050a15';
    pointCol = '#fffba3';
    pIntMult = 0.3;
    aIntMult = 0.4;
  }

  return (
    <div className="w-full h-full bg-[#020617] rounded-xl overflow-hidden border border-slate-700/40 shadow-2xl">
      <Canvas shadows={{ type: 1 }} camera={{ position: [10, 10, 10], fov: 45 }}>
        <Suspense fallback={null}>
          {/* Soft shadows when enabled */}
          {softShadows && <SoftShadows size={25} samples={16} focus={0.5} />}

          <Environment preset="city" />

          {/* Adjustable lighting */}
          <ambientLight intensity={ambientIntensity * aIntMult} color={ambientCol} />
          <directionalLight
            position={dirLightPos}
            intensity={pointIntensity * pIntMult}
            color={dirLightColor}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-near={0.5}
            shadow-camera-far={50}
            shadow-camera-left={-15}
            shadow-camera-right={15}
            shadow-camera-top={15}
            shadow-camera-bottom={-15}
          />
          <pointLight
            position={timeOfDay === 'night' ? [0, 8, 0] : [-8, 8, -8]}
            intensity={timeOfDay === 'night' ? pointIntensity * 1.5 : pointIntensity * 0.4}
            color={pointCol}
          />

          {/* Floor */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
            <planeGeometry args={[roomWidth, roomHeight]} />
            <meshStandardMaterial color={roomColor} roughness={0.8} metalness={0.0} />
          </mesh>

          {/* Walls (thin room outline) */}
          <mesh position={[0, 0.5, -roomHeight / 2]}>
            <boxGeometry args={[roomWidth, 1, 0.05]} />
            <meshStandardMaterial color="#1e293b" roughness={0.9} />
          </mesh>
          <mesh position={[-roomWidth / 2, 0.5, 0]}>
            <boxGeometry args={[0.05, 1, roomHeight]} />
            <meshStandardMaterial color="#1e293b" roughness={0.9} />
          </mesh>

          <Grid
            infiniteGrid
            fadeDistance={50}
            cellColor="#334155"
            sectionColor="#475569"
          />

          {/* Furniture */}
          {furniture.map((item) => (
            <FurnitureBox
              key={item.id}
              item={item}
              roomDims={{ width: roomWidth, height: roomHeight }}
              isSelected={item.id === selectedId}
            />
          ))}

          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.5}
            scale={25}
            blur={softShadows ? 3.5 : 1.5}
            far={5}
          />
          <CameraController isFirstPerson={isFirstPerson} />
          <ExporterController />
        </Suspense>
      </Canvas>
    </div>
  );
};

const ExporterController = () => {
  const sceneObj = useThree((state: any) => state.scene);

  React.useEffect(() => {
    (window as any)._exportGLTF = () => {
      import('three/examples/jsm/exporters/GLTFExporter.js').then(({ GLTFExporter }) => {
        const exporter = new GLTFExporter();
        exporter.parse(sceneObj, (gltf) => {
          const output = JSON.stringify(gltf, null, 2);
          const blob = new Blob([output], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.style.display = 'none';
          link.href = url;
          link.download = 'room_design.gltf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, (err) => console.error(err), { binary: false });
      }).catch(err => console.error('Failed to load GLTFExporter', err));
    };
    return () => { delete (window as any)._exportGLTF; };
  }, [sceneObj]);
  return null;
};

const CameraController = ({ isFirstPerson }: { isFirstPerson: boolean }) => {
  const { camera } = useThree();
  const controlsRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (isFirstPerson) {
      // Set to eye level inside the room
      camera.position.set(0, 1.65, 2.5);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 1.65, -2);
        controlsRef.current.maxPolarAngle = Math.PI / 2 + 0.15; // Limit looking up/down too much
        controlsRef.current.minPolarAngle = Math.PI / 2 - 0.3;
        controlsRef.current.minDistance = 0.6;
        controlsRef.current.maxDistance = 15;
      }
    } else {
      // Set back to overhead default
      camera.position.set(10, 10, 10);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.maxPolarAngle = Math.PI;
        controlsRef.current.minPolarAngle = 0;
        controlsRef.current.minDistance = 1;
        controlsRef.current.maxDistance = 50;
      }
    }
  }, [isFirstPerson, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan
      enableZoom
      enableRotate
      enableDamping
      dampingFactor={0.05}
    />
  );
};

export default Viewer3D;
